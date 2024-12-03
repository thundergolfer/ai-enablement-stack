const generateHTML = (data) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
        }
        .container {
            width: 1200px;
            margin: 0 auto;
        }
        .title {
            font-size: 24px;
            margin-bottom: 30px;
        }
        .title-highlight {
            color: #F4811F;
        }
        .layer {
            margin-bottom: 15px;
            border-radius: 8px;
            padding: 15px;
        }
        .layer-header {
            display: flex;
            gap: 20px;
        }
        .layer-title {
            width: 150px;
            font-weight: bold;
        }
        .section {
            flex: 1;
        }
        .section-title {
            font-size: 12px;
            color: #666;
            margin-bottom: 10px;
        }
        .companies {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 10px;
        }
        .company {
            background: white;
            padding: 8px 16px;
            border-radius: 20px;
            text-align: center;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="title">
            <span class="title-highlight">${data.title.highlight}</span>
            ${data.title.text}
        </h1>
        ${data.layers.map(layer => `
            <div class="layer" style="background-color: ${layer.color}">
                <div class="layer-header">
                    <div class="layer-title">
                        Layer ${layer.number}:<br>${layer.name}
                    </div>
                    <div class="section">
                        ${layer.sections.map(section => `
                            <div class="section-content">
                                <div class="section-title">${section.name}</div>
                                <div class="companies">
                                    ${section.companies.map(company => `
                                        <div class="company">${company}</div>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `).join('')}
    </div>
</body>
</html>
`;

module.exports = generateHTML;