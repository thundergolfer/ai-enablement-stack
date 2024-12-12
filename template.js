const generateHTML = (data) => {
    const generationDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return `
<!DOCTYPE html>
<html>
<head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #007FFF;
            --secondary: #2ECC71;
            --white: #FFFFFF;
            --black: #0A0A0A;
            --green: #2ECC71;
            --border-light: rgba(222, 222, 222, 0.1);
            --company-bg: #1A1A1A;
        }

        body {
            margin: 0;
            padding: 20px;
            background-color: var(--black);
            color: var(--white);
        }

        .container {
            max-width: 1600px; // Increased from 1200px
            margin: 0 auto;
            padding: 0 28px; // Reduced from 20px
        }

        .highlight {
            font-family: "JetBrains Mono", monospace;
            font-optical-sizing: auto;
            font-weight: 700;
            font-style: normal;
            font-size: 32px;
            margin-bottom: 20px;
            color: var(--white);
        }

        .title {
            font-family: "JetBrains Mono", monospace;
            font-optical-sizing: auto;
            font-weight: 300;
            font-style: normal;
            font-size: 24px;
            margin-bottom: 40px;
            color: var(--white);
        }

        .layer {
            margin-bottom: 24px;
            border-radius: 0px;
            padding: 24px;
            border: 2px dashed var(--border-light, #252525);
            background: rgba(255, 255, 255, 0.02);
        }

        .layer-header {
            display: flex;
            gap: 32px;
            margin-bottom: 16px;
        }

        .layer-title {
            font-family: "JetBrains Mono", monospace;
            font-optical-sizing: auto;
            font-weight: 700;
            font-style: normal;
            font-size: 18px;
            min-width: 200px;
            color: var(--primary);
        }

        .section-title {
            font-family: "JetBrains Mono", monospace;
            font-optical-sizing: auto;
            font-weight: 500;
            font-style: normal;
            font-size: 14px;
            color: var(--secondary);
            margin-bottom: 16px;
            text-transform: uppercase;
            opacity: 0.8;
        }

        .companies {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 16px;
        }

        .company {
            font-family: "Inter", sans-serif;
            font-optical-sizing: auto;
            font-weight: 700;
            font-style: normal;
            background: var(--company-bg);
            padding: 12px 16px;
            border-radius: 6px;
            text-align: center;
            border: 1px solid var(--border-light);
            transition: all 0.2s ease;
        }

        .company:hover {
            background: rgba(255, 255, 255, 0.05);
            transform: translateY(-2px);
            border-color: var(--primary);
        }

        .company img {
            max-width: 100%;
            height: auto;
            max-height: 24px;
            filter: brightness(0) invert(1);
        }

        .sections {
            display: flex;
            flex-direction: column;
            gap: 24px;
        }

        .section {
            background: rgba(255, 255, 255, 0.01);
            padding: 16px;
            border-radius: 8px;
        }

        .generation-date {
            font-family: "Inter", sans-serif;
            font-size: 14px;
            color: rgba(255, 255, 255, 0.5);
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="highlight">${data.title.highlight}</h1>
        <h3 class="title">${data.title.text}</h3>
        ${data.layers.map(layer => `
            <div class="layer">
                <div class="layer-header">
                    <div class="layer-title">
                        Layer ${layer.number}: ${layer.name}
                    </div>
                </div>
                <div class="sections">
                    ${layer.sections.map(section => `
                        <div class="section">
                            <div class="section-title">${section.name}</div>
                            <div class="companies">
                                ${section.companies.map(company => `
                                    <div class="company">
                                        ${company.logo
                                            ? `<img src="${company.logo}" alt="${company.name}">`
                                            : company.name
                                        }
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('')}
        <div class="generation-date">Generated on ${generationDate}</div>
    </div>
</body>
</html>
`;
};

module.exports = generateHTML;