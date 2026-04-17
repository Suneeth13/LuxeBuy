# Step 1: Build the Vite App
FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Set build arguments if needed, e.g., ARG VITE_GEMINI_API_KEY
RUN npm run build

# Step 2: Serve the App using Node.js Backend
FROM node:22-alpine

WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the built frontend from builder and the server source code
COPY --from=builder /app/dist ./dist
COPY server ./server

# Expose the port (Cloud Run defaults to 8080)
ENV PORT=8080
EXPOSE 8080

# Start the Node.js server
CMD ["node", "server/index.js"]
