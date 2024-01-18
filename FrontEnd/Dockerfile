# Build stage
FROM node:14 as build

# Set working directory
RUN mkdir /FrontEnd
COPY . /FrontEnd
WORKDIR /FrontEnd

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
# RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build React app
# RUN npm build --legacy-peer-deps

# Production stage
FROM nginx:latest as production-app

# Set working directory to Nginx HTML directory
WORKDIR /usr/share/nginx/html
RUN ls -la
# Copy build from the build stage
# COPY --from=build /FrontEnd/build .
COPY --from=build /FrontEnd/nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
