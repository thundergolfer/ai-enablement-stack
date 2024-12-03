const fs = require('fs');

function generateReadme(data) {
  let readme = `<!--
TBD:
- Add to visual:
-->

<h1 align="center">
	🔮 AI Enablement Stack
	<p align="center">
		<a href="https://go.daytona.io/slack" target="_blank">
			<img src="https://img.shields.io/static/v1?label=Join&message=%20Slack!&color=mediumslateblue">
		</a>
		<a href="https://twitter.com/daytonaio" target="_blank">
			<img src="https://img.shields.io/twitter/follow/daytonaio.svg?logo=twitter">
		</a>
	</p>
</h1>

<h3 align="center">
  A comprehensive list of tools and technologies for AI Enabled Development
</h3>

<h5 align="center">👉 <a href="CONTRIBUTING.md">Contribute new tool</a></h5>

<img src="./ai-enablement-stack.png" width="100%" alt="AI Enablement Stack" />

Welcome to our AI Enablement Stack.
We structured the list into layers based on their functionality in the AI development ecosystem:

`;

  // Add layers description
  const reversedLayers = [...data.layers].reverse();
  reversedLayers.forEach(layer => {
    readme += `- **${layer.name}**: Layer ${layer.number}\n`;
  });

  readme += `\nTo contribute to this list:\n`;
  readme += `1. Fork the repository\n`;
  readme += `2. Add your tool in the appropriate category in the file ai-enablement-stack.json\n`;
  readme += `3. Add logo under the assets folder\n\n`;
  readme += `4. Submit a pull request\n\n`;

  // Add detailed sections
  reversedLayers.forEach(layer => {
    readme += `## ${layer.name}\n\n`;

    layer.sections.forEach(section => {
      readme += `### ${section.name}\n\n`;

      section.companies.forEach(company => {
        if (typeof company === 'string') {
          readme += `#### [${company}]()\n`;
          readme += `<details>\n\n`;
          readme += `##### Category\n${layer.name} - ${section.name}\n\n`;
          readme += `##### Description\n- No description available\n\n`;
          readme += `##### Links\n- No links available\n\n`;
          readme += `</details>\n\n`;
        } else {
          readme += `#### [${company.name}](${company.link || ''})\n`;
          readme += `<details>\n\n`;
          if (company.logo) {
            readme += `![${company.name}](${company.logo})\n\n`;
          }
          readme += `##### Category\n${layer.name} - ${section.name}\n\n`;
          readme += `##### Description\n${company.description || '- No description available'}\n\n`;
          readme += `##### Links\n`;
          if (company.link) {
            readme += `- [${company.link}](${company.link})\n`;
          }
          readme += `</details>\n\n`;
        }
      });
    });
  });

  // Add footer
  readme += `\n## Contributing\n`;
  readme += `Please read the [contribution guidelines](CONTRIBUTING.md) before submitting a pull request.\n\n`;
  readme += `## License\n`;
  readme += `This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details\n`;

  return readme;
}

// Read and parse the JSON file
const data = JSON.parse(fs.readFileSync('./ai-enablement-stack.json', 'utf8'));

// Generate README content
const readmeContent = generateReadme(data);

// Write to README.md file
fs.writeFileSync('README.md', readmeContent);

console.log('README.md has been generated successfully!');