const playwright = require('playwright');
const fs = require('fs');
const generateHTML = require('./template');
const path = require('path');

function sanitizeSvg(svgString) {
    const cleanSvg = svgString
        .replace(/<\?xml.*?\?>/, '')
        .replace(/<!DOCTYPE.*?>/, '')
        .replace(/[\r\n\t]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    // Ensure viewBox is preserved
    if (!cleanSvg.includes('viewBox') && cleanSvg.includes('width') && cleanSvg.includes('height')) {
        return cleanSvg.replace('<svg', '<svg viewBox="0 0 100 100"');
    }
    return cleanSvg;
}

function imageToDataURL(imagePath) {
    if (!imagePath) return '';
    try {
        const imageBuffer = fs.readFileSync(path.resolve(__dirname, imagePath));
        const imageExt = path.extname(imagePath).substring(1).toLowerCase();

        // For SVG files
        if (imageExt === 'svg') {
            const svgString = sanitizeSvg(imageBuffer.toString());
            const encodedSvg = Buffer.from(svgString).toString('base64');
            return `data:image/svg+xml;base64,${encodedSvg}`;
        }

        // For other image formats
        return `data:image/${imageExt};base64,${imageBuffer.toString('base64')}`;
    } catch (error) {
        console.error(`Error loading image: ${imagePath}`, error);
        return '';
    }
}

async function generateImage() {
    let browser;
    try {
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

        // Reverse the layers array if it exists
        if (processedData.layers) {
            processedData.layers = processedData.layers.reverse();
        }

        // Generate base64 for the background image and logo
        const bgImageDataUrl = imageToDataURL('./public/bg.png');
        const dtnLogoUrl = imageToDataURL('./public/images/daytonaio.png');

        // Generate HTML content
        const html = generateHTML(processedData, bgImageDataUrl, dtnLogoUrl);

        // Launch browser with enhanced settings
        browser = await playwright.chromium.launch({
            args: ['--disable-web-security', '--no-sandbox'],
            timeout: 60000
        });

        // Create context with specific viewport and scale settings
        const context = await browser.newContext({
            viewport: { width: 1600, height: 1000 },
            deviceScaleFactor: 2 // Higher resolution
        });

        const page = await context.newPage();

        // Add console logging for debugging
        page.on('console', msg => console.log('Browser console:', msg.text()));
        page.on('pageerror', err => console.error('Browser error:', err));

        // Set content with networkidle wait
        await page.setContent(html, {
            waitUntil: 'networkidle',
            timeout: 30000
        });

        // Comprehensive wait for all images and SVGs to load
        await page.waitForFunction(() => {
            const images = Array.from(document.getElementsByTagName('img'));
            const svgs = Array.from(document.getElementsByTagName('svg'));

            const imagesLoaded = images.every((img) => {
                if (!img.complete) return false;
                if (img.naturalWidth === 0) return false;
                return true;
            });

            const svgsLoaded = svgs.every((svg) => {
                const box = svg.getBoundingClientRect();
                return box.width > 0 && box.height > 0;
            });

            return imagesLoaded && svgsLoaded;
        }, {
            timeout: 30000,
            polling: 1000 // Check every second
        });

        // Additional wait to ensure everything is rendered
        await page.waitForTimeout(3000);

        // Ensure the page is fully loaded
        await page.evaluate(() => {
            return new Promise((resolve) => {
                if (document.readyState === 'complete') {
                    resolve();
                } else {
                    window.addEventListener('load', resolve);
                }
            });
        });

        // Take screenshot with high quality settings
        await page.screenshot({
            path: 'ai-enablement-stack.png',
            fullPage: true,
            omitBackground: false,
            scale: 'device' // Use device scale factor
        });

        console.log('Image generated successfully!');

    } catch (error) {
        console.error('Error generating image:', error);
        throw error;
    } finally {
        if (browser) {
            try {
                await browser.close();
            } catch (closeError) {
                console.error('Error closing browser:', closeError);
            }
        }
    }
}

// Helper function to sanitize SVG content
function sanitizeSvg(svgString) {
    return svgString
        .replace(/<\?xml.*?\?>/, '') // Remove XML declaration
        .replace(/<!DOCTYPE.*?>/, '') // Remove DOCTYPE
        .replace(/[\r\n\t]/g, ' ') // Replace newlines and tabs with spaces
        .replace(/\s+/g, ' ') // Collapse multiple spaces
        .trim();
}

// Helper function to convert image to data URL
function imageToDataURL(imagePath) {
    if (!imagePath) return '';
    try {
        const imageBuffer = fs.readFileSync(path.resolve(__dirname, imagePath));
        const imageExt = path.extname(imagePath).substring(1).toLowerCase();

        // Special handling for SVG files
        if (imageExt === 'svg') {
            const svgString = sanitizeSvg(imageBuffer.toString());

            // Enhanced SVG encoding
            const encodedSvg = encodeURIComponent(svgString)
                .replace(/'/g, '%27')
                .replace(/"/g, '%22')
                .replace(/%20/g, ' ')
                .replace(/%3D/g, '=')
                .replace(/%3A/g, ':')
                .replace(/%2F/g, '/');

            return `data:image/svg+xml;charset=utf-8,${encodedSvg}`;
        }

        // For other image formats
        return `data:image/${imageExt};base64,${imageBuffer.toString('base64')}`;
    } catch (error) {
        console.error(`Error loading image: ${imagePath}`, error);
        return '';
    }
}

// Export the function
module.exports = generateImage;

generateImage().catch(console.error);
