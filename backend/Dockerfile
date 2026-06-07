# Use the official Node.js 20 image as our base (Alpine is a lightweight version)
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first to leverage Docker layer caching
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of your application code to the working directory
COPY . .

# Expose the port the app runs on (Default Express port or from ENV)
EXPOSE 3000

# Start the application using our npm start script (which runs "node index.js start")
CMD ["npm", "start"]
