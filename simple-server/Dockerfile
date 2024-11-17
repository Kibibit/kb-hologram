# Use a Node.js base image
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Install Chromium dependencies
RUN apt-get update && apt-get install -y \
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
  xdg-utils \
  --no-install-recommends && \
  apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Puppeteer and its dependencies
RUN npm install puppeteer

# Copy the application files to the container
COPY package*.json ./
COPY . .

# Install application dependencies
RUN npm install

# Build the application
RUN npm run build

# Expose the API port
EXPOSE 3000

# Run the server
CMD ["node", "dist/simple-server.js"]
