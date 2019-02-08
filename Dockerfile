# Set base image
FROM node:8

# Set working directory for the app in container
WORKDIR /app

# Copy package.json to container's /app directory and install dependencies
COPY package.json /app
RUN npm install
COPY . /app

# Launch application
CMD node index.js

# Expose container's port 8080 to the outside
EXPOSE 8080
