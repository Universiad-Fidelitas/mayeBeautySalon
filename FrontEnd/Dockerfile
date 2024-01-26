# Stage 1: Build the React app
FROM node:20-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the entire application
COPY . .

# Build the React app
RUN npm run build --legacy-peer-deps

# Stage 2: Use Nginx as a lightweight base image
FROM nginx:alpine

# Copy the built React app to the Nginx web server directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy Nginx configuration
COPY --from=build /app/nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
