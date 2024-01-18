# Use an official Node.js image as a parent image for building
FROM node:14 as builder

WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code to the working directory
COPY . .

# Build the React app
RUN ls -la
RUN npm build --legacy-peer-deps
# RUN npm run build-css --legacy-peer-deps
# RUN npm run build-js --legacy-peer-deps

# Production Stage - Use NGINX image to serve the built app
FROM nginx:alpine

# Copy the build output from the builder stage to the NGINX web server directory
# COPY --from=builder /usr/src/app/build /usr/share/nginx/html
COPY --from=builder ./build /usr/share/nginx/html

# Expose the port the app runs on
EXPOSE 80

# Default command to run the NGINX server
CMD ["nginx", "-g", "daemon off;"]