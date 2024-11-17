# Use the official Node.js image as a base
FROM node:22

# Install pnpm
RUN npm install -g pnpm

# Set the working directory in the container
WORKDIR /app

# Copy whole application to the container
COPY . .

# Install dependencies
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]
