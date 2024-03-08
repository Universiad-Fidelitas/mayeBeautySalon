# Stage 1: Build the React app
FROM node:20-alpine AS build
WORKDIR /usr/src/app/
COPY FrontEnd/package.json ./
RUN npm install --legacy-peer-deps
COPY FrontEnd .
RUN npm run build

# Stage 2: Create the final image
FROM node:20-alpine
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .
COPY --from=build /usr/src/app ./FrontEnd

# Expose the port your app will run on
EXPOSE 443

# Start the application
CMD ["npm", "run", "start-prod"]
