
FROM node:alpine

# Set working directory
WORKDIR /maye-beauty-salon

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port 5000
EXPOSE 4000

# Start server
CMD ["npm", "start"]