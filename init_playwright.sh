#!/bin/bash

# Exit on any error
set -e

echo "Starting Playwright installation..."

# Install expect if not already installed
if ! command -v expect &> /dev/null; then
    sudo apt-get update
    sudo apt-get install -y expect
fi

# Create expect script for handling arrow key selection
expect << 'END'
spawn yarn create playwright
expect "TypeScript or JavaScript?"
# Send down arrow to select JavaScript
send "\033\[B"
send "\r"
expect "end-to-end tests?"
send "e2e\r"
expect "GitHub Actions workflow?"
send "false\r"
expect "Install Playwright browsers"
send "true\r"
expect "Install Playwright operating system dependencies"
send "true\r"
expect eof
END

echo "Installing Playwright browsers..."
yarn playwright install

echo "Installing system dependencies..."
yarn playwright install-deps

echo "Playwright installation completed successfully!"