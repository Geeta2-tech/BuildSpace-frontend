# Step 1: Build the React app
FROM node:22.16.0

# Set working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source code and build the app
COPY . .

RUN npm run build