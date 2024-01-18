# Build stage
FROM node:14 as build

# Set working directory
WORKDIR /FrontEnd

# Copy package.json and package-lock.json
COPY package*.json ./

# Print the contents of the working directory for debugging
RUN ls -la

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Print the contents of the working directory again for debugging
RUN ls -la

# Build React app
RUN npm build --legacy-peer-deps

# Production stage
FROM nginx:latest as production-app

# Set working directory to Nginx HTML directory
WORKDIR /usr/share/nginx/html
RUN ls -la

# Copy build from the build stage
COPY /FrontEnd/build .
COPY /FrontEnd/nginx.conf /etc/nginx/nginx.conf

# Print the contents of the copied directory for debugging
RUN ls -la

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
