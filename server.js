const express = require('express');
const fs = require('fs');
const path = require('path');
const generateHTML = require('./template');
const WebSocket = require('ws');
const chokidar = require('chokidar');
const http = require('http');

const app = express();
const port = 4000;

// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Serve static files
app.use(express.static('public'));

// Basic middleware
app.use(express.json());

// Function to inject live reload script into HTML
function injectLiveReloadScript(html) {
    const script = `
        <script>
            (function() {
                const ws = new WebSocket('ws://localhost:${port}');
                ws.onmessage = function(msg) {
                    if (msg.data === 'reload') window.location.reload();
                };
                ws.onclose = function() {
                    console.log('Live reload connection closed. Reconnecting...');
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                };
            })();
        </script>
    `;
    return html.replace('</body>', `${script}</body>`);
}

// Simple route handler
app.get('/', async (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync('./ai-enablement-stack.json', 'utf8'));

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
                            logo: company.logo ? `/images/${path.basename(company.logo)}` : ''
                        };
                    })
                }))
            }))
        };

        if (processedData.layers) {
            processedData.layers = processedData.layers.reverse();
        }

        const html = generateHTML(processedData);
        res.setHeader('Content-Type', 'text/html');
        res.send(injectLiveReloadScript(html));
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Set up file watching
const watcher = chokidar.watch([
    './ai-enablement-stack.json',
    './template.js',
    './public/images/**/*'
], {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true
});

// Broadcast to all clients
function broadcast() {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send('reload');
        }
    });
}

// Watch for file changes
watcher
    .on('change', path => {
        console.log(`File ${path} has been changed`);
        broadcast();
    })
    .on('add', path => {
        console.log(`File ${path} has been added`);
        broadcast();
    })
    .on('unlink', path => {
        console.log(`File ${path} has been removed`);
        broadcast();
    });

// Start server
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log('Live reload enabled - watching for file changes...');
});

// Handle server shutdown
process.on('SIGTERM', () => {
    watcher.close();
    server.close(() => {
        console.log('Server shutdown complete');
    });
});