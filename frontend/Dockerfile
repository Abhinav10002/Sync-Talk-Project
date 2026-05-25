# ==========================================
# Stage 1: Build stage using Node
# ==========================================
FROM node:20-alpine AS build-stage

WORKDIR /app

# Copy package descriptors first to optimize layer caching
COPY package.json package-lock.json ./

# Install packages in a deterministic way
RUN npm ci

# Copy the rest of the frontend source code
COPY . .

# Build the optimized production static bundle (outputs to /app/dist)
RUN npm run build

# ==========================================
# Stage 2: Production stage using Nginx
# ==========================================
FROM nginx:alpine

# Remove the default Nginx index page
RUN rm -rf /usr/share/nginx/html/*

# Copy build files from build-stage to Nginx default public directory
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy the custom Nginx server configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for HTTP traffic
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
