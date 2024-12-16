const playwright = require('playwright');
const fs = require('fs');
const generateHTML = require('./template');
const path = require('path');

function sanitizeSvg(svgString) {
    return svgString
        .replace(/<\?xml.*?\?>/, '') // Remove XML declaration
        .replace(/<!DOCTYPE.*?>/, '') // Remove DOCTYPE
        .replace(/[\r\n\t]/g, ' ') // Replace newlines and tabs with spaces
        .replace(/\s+/g, ' ') // Collapse multiple spaces
        .trim();
}

function imageToDataURL(imagePath) {
    if (!imagePath) return '';
    try {
        const imageBuffer = fs.readFileSync(path.resolve(__dirname, imagePath));
        const imageExt = path.extname(imagePath).substring(1).toLowerCase();

        // Special handling for SVG files
        if (imageExt === 'svg') {
            const svgString = sanitizeSvg(imageBuffer.toString());

            // For Modal SVG specifically
            if (imagePath.includes('modal')) {
                // Force viewBox and size attributes
                const modifiedSvg = svgString
                    .replace(/<svg/, '<svg width="100" height="24" preserveAspectRatio="xMidYMid meet"');
                return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(modifiedSvg)}`;
            }

            return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
        }

        // For other image formats
        return `data:image/${imageExt};base64,${imageBuffer.toString('base64')}`;
    } catch (error) {
        console.error(`Error loading image: ${imagePath}`, error);
        return '';
    }
}

async function generateImage() {
    // Read and parse the JSON file
    const data = JSON.parse(fs.readFileSync('./ai-enablement-stack.json', 'utf8'));

    // Process the data while preserving the company object structure
    const processedData = {
        ...data,
        layers: data.layers.map(layer => ({
            ...layer,
            sections: layer.sections.map(section => ({
                ...section,
                companies: section.companies.map(company => {
                    if (typeof company === 'string') {
                        return { name: company, logo: '' };
                    }
                    return {
                        ...company,
                        logo: imageToDataURL(company.logo)
                    };
                })
            }))
        }))
    };

    // Reverse the layers array if it exists in your data structure
    if (processedData.layers) {
        processedData.layers = processedData.layers.reverse();
    }

      // Generate base64 for the background image
    const bgImageDataUrl = imageToDataURL('./public/bg.png');
    const dtnLogoUrl = imageToDataURL('./public/images/daytonaio.png');

    const html = generateHTML(processedData, bgImageDataUrl, dtnLogoUrl);

    const browser = await playwright.chromium.launch();
    const page = await browser.newPage();

    await page.setContent(html);
    await page.setViewportSize({ width: 1600, height: 1000 });

    // Wait for all images to load
    await page.waitForFunction(() => {
        const images = document.getElementsByTagName('img');
        return Array.from(images).every((img) => {
            return img.complete && img.naturalHeight !== 0;
        });
    });

    // Additional wait to ensure everything is rendered
    await page.waitForTimeout(2000);

    await page.screenshot({
        path: 'ai-enablement-stack.png',
        fullPage: true
    });

    await browser.close();
}

generateImage().catch(console.error);
