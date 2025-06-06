# Use official Node.js 22 image
FROM node:22

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY backend/ .

# Build the app (if needed)
RUN npm run build --if-present

# Run tests (optional, remove if not needed)
RUN npm run test --if-present

# Expose the port your app runs on
EXPOSE 8080

# Command to run the application
CMD ["npm", "start"]