const playwright = require('playwright');
const fs = require('fs');
const generateHTML = require('./template');

async function generateImage() {
    const data = JSON.parse(fs.readFileSync('./ai-enablement-stack.json', 'utf8'));

    // Reverse the layers array if it exists in your data structure
    if (data.layers) {
        data.layers = data.layers.reverse();
    }

    const html = generateHTML(data);

    const browser = await playwright.chromium.launch();
    const page = await browser.newPage();

    await page.setContent(html);
    await page.setViewportSize({ width: 1200, height: 800 });

    // Wait for any animations/fonts to load
    await page.waitForTimeout(1000);

    await page.screenshot({
        path: 'ai-enablement-stack.png',
        fullPage: true
    });

    await browser.close();
}

generateImage().catch(console.error);