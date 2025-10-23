# Stage 1: Build
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install ALL dependencies (including dev)
# This ensures autoprefixer, tailwindcss, postcss, etc. are available
RUN npm install


# Install missing build-time deps only inside Docker image
RUN npm install -D tailwindcss postcss autoprefixer firebase


# Copy the rest of the source code
COPY . .

# Build your Next.js app
RUN npm run build

# Stage 2: Run
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy only what's needed for runtime
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "start"]

