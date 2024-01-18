# Use an official Node.js image as a parent image
FROM node:14 as builder

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY frontend/package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY frontend/ .

# Build the React app
RUN npm run build

# Use a lightweight image for serving the static files
FROM nginx:alpine

# Copy the build output from the builder stage to the NGINX web server directory
COPY --from=builder /usr/src/app/build /usr/share/nginx/html

# Expose the port the app runs on
EXPOSE 80

# Default command to run the NGINX server
CMD ["nginx", "-g", "daemon off;"]
