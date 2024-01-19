# Use the official Node.js image as a base image
FROM node:20-alpine as build

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./
RUN ls -la
# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the entire application
COPY . .
RUN cat package.json
RUN ls -la

# Build the React app
RUN npm run build --legacy-peer-deps

# Use Nginx as a lightweight base image
FROM nginx:alpine
RUN ls -la
# Copy the built React app to the Nginx web server directory
COPY --from=build /build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
