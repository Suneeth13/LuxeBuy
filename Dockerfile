# Step 1: Build the Vite App
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Set build arguments if needed, e.g., ARG VITE_GEMINI_API_KEY
RUN npm run build

# Step 2: Serve the App using Nginx
FROM nginx:alpine

# Copy the built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Custom nginx config to route requests properly for SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the standard Cloud Run port (Cloud Run sets PORT env var automatically, but defaults to 8080)
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
