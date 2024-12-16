const generateHTML = (data, bgImageDataUrl) => {
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
            --bg-color: #f7f7f7;
            --text-primary: #161616;
            --text-secondary: #686868;
            --border-color: #a2a2a2;

            /* Layer-specific colors */
            --layer5-bg: rgba(0, 127, 255, 0.1);
            --layer5-text: #005FBE;
            --layer5-text-no: #0080FF;
            --layer4-bg: rgba(39, 166, 68, 0.1);
            --layer4-text: #08AE78;
            --layer4-text-no: #2ECC71;
            --layer3-bg: rgba(253, 156, 54, 0.1);
            --layer3-text: #E67E22;
            --layer3-text-no: #E7964F;
            --layer2-bg: rgba(54, 157, 171, 0.1);
            --layer2-text: #34A9B9;
            --layer2-text-no: #3CCEE1;
            --layer1-bg: rgba(95, 106, 211, 0.1);
            --layer1-text: #5F6AD3;
            --layer1-text-no: #9599BF;
        }

        body {
            background-color: var(--bg-color);
            color: var(--text-primary);
            padding: 64px 80px;
            background-image: url('./bg.png');
            background-repeat: no-repeat;
            background-position: top right;
            background-size: 50% auto; /* Adjust this value to control the size */
        }

        .container {
            max-width: 1440px;
            margin: 0 auto;
        }

        .heading {
            font-family: "JetBrains Mono", monospace;
            font-size: 44px;
            font-weight: normal;
            line-height: 50.6px;
            color: var(--text-primary);
        }

        .subtitle {
            font-family: "Inter", sans-serif;
            font-size: 20px;
            font-weight: 300;
            line-height: 150%; /* 30px */
            letter-spacing: -0.2px;
            color: var(--text-secondary);
            width: 700px;
            padding-bottom: 10px;
        }

        .layer {
            border: 1px dashed var(--border-color);
            overflow: hidden; /* Ensure content stays within borders */
            font-family: "JetBrains Mono", monospace;
            font-size: 20px;
            font-weight: normal;
            font-weight: 400;
            margin-top: -1px;
        }

        .layer:first-of-type {
            margin-top: 0;
        }

        .layer-header {
            padding: 20px;
            background: var(--layer-bg);
            border: none;
            border-bottom: 1px dashed var(--border-color);
            display: flex;
            gap: 24px;
        }

        /* Add this to your existing CSS */
        .layer1 {
            background-color: var(--layer1-bg);
        }

        .layer2 {
            background-color: var(--layer2-bg);
        }

        .layer3 {
            background-color: var(--layer3-bg);
        }

        .layer4 {
            background-color: var(--layer4-bg);
        }

        .layer5 {
            background-color: var(--layer5-bg);
        }

        .layer-title .no {
            padding-right: 20px;
        }

        .layer1 .layer-title {
            color: var(--layer1-text);
        }

        .layer1 .layer-title .no {
            color: var(--layer1-text-no);
        }

        .layer2 .layer-title {
            color: var(--layer2-text);
        }

        .layer2 .layer-title .no {
            color: var(--layer2-text-no);
        }

        .layer3 .layer-title {
            color: var(--layer3-text);
        }

        .layer3 .layer-title .no {
            color: var(--layer3-text-no);
        }

        .layer4 .layer-title {
            color: var(--layer4-text);
        }

        .layer4 .layer-title .no {
            color: var(--layer4-text-no);
        }

        .layer5 .layer-title {
            color: var(--layer5-text);
        }

        .layer5 .layer-title .no {
            color: var(--layer5-text-no);
        }

        .section {
            background: #F6F6F6;
            border: none;
            border-top: 1px dashed var(--border-color);
            padding: 20px;
        }

        .section:first-child {
            border-top: none;
        }

        .section-title {
            font-family: "JetBrains Mono", monospace;
            font-size: 16px;
            font-weight: normal;
            color: var(--text-primary);
            margin-bottom: 16px;
        }

        .companies {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }

        .company {
            font-family: "Inter", sans-serif;
            font-optical-sizing: auto;
            font-weight: 400;
            font-style: normal;
            background: transparent;
            padding: 12px 16px;
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
        }

        .sections {
            display: flex;
            flex-direction: column;
        }

        .header-section {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 24px;
        }

        .title-section {
            flex: 1;
        }

        .generation-date {
            font-family: "Inter", sans-serif;
            font-size: 16px;
            font-style: normal;
            font-weight: 400;
            line-height: 150%; /* 30px */
            letter-spacing: -0.2px;
            color: var(--text-secondary);
            text-align: right;
        }

        /* Remove any margin from heading when it's inside title-section */
        .title-section .heading {
            margin-top: 0;
        }

        .footer {
            margin-top: 24px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            gap: 12px; /* Increased gap between text and logo */
            font-family: "Inter", sans-serif;
            font-size: 16px; /* Increased font size */
            color: #686868; /* Lighter gray color */
        }

        .footer .company {
            padding: 0; /* Remove padding */
            margin: 0;
            border: none; /* Remove border */
        }

        .footer .company img {
            height: 20px; /* Adjust logo size as needed */
        }

        .footer .company:hover {
            background: transparent; /* Remove hover effect */
            transform: none; /* Remove hover transform */
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header-section">
            <div class="title-section">
                <h1 class="heading">${data.title.heading}</h1>
                <h3 class="subtitle">${data.title.subtitle}</h3>
            </div>
            <div class="generation-date">Generated on ${generationDate}</div>
        </div>
        ${data.layers.map(layer => `
            <div class="layer layer${layer.number}">
                <div class="layer-header">
                    <div class="layer-title">
                        <span class="no">LAYER ${layer.number}</span> ${layer.name}
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

        <div class="footer">
            Crowdsourced by
            <div class="company">
                <img src="./images/daytonaio.png" alt="Daytona">
            </div>
        </div>
    </div>

    </div>
</body>
</html>
`;
};

module.exports = generateHTML;