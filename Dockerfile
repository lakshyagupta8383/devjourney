# ---------------------------------------------------------
# 🧱 Stage 1: Build the Next.js app
# ---------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Accept Firebase environment variables at build time
ARG FIREBASE_PROJECT_ID
ARG FIREBASE_CLIENT_EMAIL
ARG FIREBASE_PRIVATE_KEY

# Make them available for the Next.js build
ENV FIREBASE_PROJECT_ID=$FIREBASE_PROJECT_ID
ENV FIREBASE_CLIENT_EMAIL=$FIREBASE_CLIENT_EMAIL
ENV FIREBASE_PRIVATE_KEY=$FIREBASE_PRIVATE_KEY

# Install dependencies
COPY package*.json ./
RUN npm install
RUN npm install -D tailwindcss postcss autoprefixer firebase

# Copy source code
COPY . .

# Build the app
RUN npm run build

# ---------------------------------------------------------
# 🚀 Stage 2: Run the built app in a minimal image
# ---------------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

# Copy only the necessary output and node_modules from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Re-declare Firebase environment variables (runtime!)
ENV FIREBASE_PROJECT_ID=$FIREBASE_PROJECT_ID
ENV FIREBASE_CLIENT_EMAIL=$FIREBASE_CLIENT_EMAIL
ENV FIREBASE_PRIVATE_KEY=$FIREBASE_PRIVATE_KEY

# Expose the port Next.js will use
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
