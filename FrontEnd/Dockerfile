# Build stage
FROM node:14 as build

# Set working directory
RUN mkdir /app
COPY . /app
WORKDIR /app
RUN pwd

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build React app
RUN npm build --legacy-peer-deps
RUN pwd
RUN ls -la

# Production stage
FROM nginx:latest as production-app

# Set working directory to Nginx HTML directory
RUN cd /app/FrontEnd
RUN pwd
RUN ls -la
# Copy build from the build stage
# COPY --from=build /FrontEnd/build /usr/share/nginx/html
# COPY --from=build /FrontEnd/nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
