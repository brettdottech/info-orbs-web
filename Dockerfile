# Use Node.js as base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (for efficient caching)
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the Vite development server port
EXPOSE 5173

# Set the command to run Vite in development mode
CMD ["npm", "run", "dev", "--", "--host"]