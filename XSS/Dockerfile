# Use the official Node.js image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
# (We assume you have a package.json, if not, we'll fix that next)
COPY package*.json ./
RUN npm install

# Copy the rest of your app source code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Command to run your app
CMD [ "node", "victim_server.js" ]