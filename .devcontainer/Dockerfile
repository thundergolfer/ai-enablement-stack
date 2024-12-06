# Specific version tag instead of latest for better reproducibility
FROM mcr.microsoft.com/devcontainers/javascript-node:20-bullseye

LABEL maintainer="Niko <niko@daytona.io>"
LABEL version="1.0"
LABEL description="Playwright testing environment"

# Switch to root user to install dependencies
USER root

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive
ENV NODE_ENV=production

# Combine RUN commands and clean up in the same layer to reduce image size
RUN apt-get update && \
    # Install only necessary dependencies
    apt-get install -y --no-install-recommends \
        # Add any additional system dependencies here
        && \
    # Install npm and Playwright
    npm install -g npm@latest && \
    npm install -D @playwright/test && \
    npx playwright install-deps && \
    npx playwright install && \
    # Clean up
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    npm cache clean --force

# Install project dependencies
RUN npm install

# Switch back to non-root user for security
USER vscode

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD node -e "process.exit(1)"

# Default command
CMD ["npx", "playwright", "test"]