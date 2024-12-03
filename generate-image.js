const playwright = require('playwright');
const fs = require('fs');
const generateHTML = require('./template');

async function generateImage() {
    // Read and parse the JSON file
    const data = JSON.parse(fs.readFileSync('./ai-enablement-stack.json', 'utf8'));

    // Process the data to extract company names and ensure backwards compatibility
    const processedData = {
        ...data,
        layers: data.layers.map(layer => ({
            ...layer,
            sections: layer.sections.map(section => ({
                ...section,
                // Transform company objects to just their names for the existing template
                // or handle both string and object formats for backwards compatibility
                companies: section.companies.map(company =>
                    typeof company === 'string' ? company : company.name
                )
            }))
        }))
    };

    // Reverse the layers array if it exists in your data structure
    if (processedData.layers) {
        processedData.layers = processedData.layers.reverse();
    }

    const html = generateHTML(processedData);

    const browser = await playwright.chromium.launch();
    const page = await browser.newPage();

    await page.setContent(html);
    await page.setViewportSize({ width: 1600, height: 1000 });

    // Wait for any animations/fonts to load
    await page.waitForTimeout(1000);

    await page.screenshot({
        path: 'ai-enablement-stack.png',
        fullPage: true
    });

    await browser.close();
}

generateImage().catch(console.error);