const playwright = require('playwright');
const fs = require('fs');
const generateHTML = require('./template');
const path = require('path');

function imageToDataURL(imagePath) {
    if (!imagePath) return '';
    try {
        const imageBuffer = fs.readFileSync(path.resolve(__dirname, imagePath));
        const imageExt = path.extname(imagePath).substring(1).toLowerCase();

        // Special handling for SVG files
        if (imageExt === 'svg') {
            return `data:image/svg+xml;base64,${imageBuffer.toString('base64')}`;
        }

        // For other image formats
        return `data:image/${imageExt};base64,${imageBuffer.toString('base64')}`;
    } catch (error) {
        console.error(`Error loading image: ${imagePath}`, error);
        return '';
    }
}

async function saveHTML() {
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

    const html = generateHTML(processedData);

    // Save the HTML file
    fs.writeFileSync('ai-enablement-stack.html', html);
}

saveHTML().catch(console.error);