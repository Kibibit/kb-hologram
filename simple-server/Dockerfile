# Use a Node.js base image
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Install Chromium dependencies and Chromium
RUN apt-get update && apt-get install -y \
  chromium \
  ca-certificates \
  fonts-liberation \
  libappindicator3-1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdbus-1-3 \
  libgbm1 \
  libnspr4 \
  libnss3 \
  libxcomposite1 \
  libxrandr2 \
  libxshmfence1 \
  xdg-utils \
  --no-install-recommends && \
  apt-get clean && rm -rf /var/lib/apt/lists/*

# Set environment variable to skip Chromium download
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Copy the application files to the container
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the application
RUN npm run build

# Expose the API port
EXPOSE 3000

# Run the server
CMD ["node", "dist/simple-server.js"]
