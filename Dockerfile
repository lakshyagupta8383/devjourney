# ---------------------------------------------------------
# 🧱 Stage 1: Build the Next.js app
# ---------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Accept environment variables at build time
ARG FIREBASE_PROJECT_ID
ARG FIREBASE_CLIENT_EMAIL
ARG FIREBASE_PRIVATE_KEY
ARG OPENAI_API_KEY

# Make them available during the Next.js build
ENV FIREBASE_PROJECT_ID=$FIREBASE_PROJECT_ID
ENV FIREBASE_CLIENT_EMAIL=$FIREBASE_CLIENT_EMAIL
ENV FIREBASE_PRIVATE_KEY=$FIREBASE_PRIVATE_KEY
ENV OPENAI_API_KEY=$OPENAI_API_KEY

# Copy dependency files and install deps
COPY package*.json ./
RUN npm install
RUN npm install -D tailwindcss postcss autoprefixer firebase

# Copy the rest of the application
COPY . .

# Build the optimized production app
RUN npm run build

# ---------------------------------------------------------
# 🚀 Stage 2: Create a lightweight runtime image
# ---------------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

# Copy only what’s needed from the build stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Re-declare environment variables for runtime
ENV FIREBASE_PROJECT_ID=$FIREBASE_PROJECT_ID
ENV FIREBASE_CLIENT_EMAIL=$FIREBASE_CLIENT_EMAIL
ENV FIREBASE_PRIVATE_KEY=$FIREBASE_PRIVATE_KEY
ENV OPENAI_API_KEY=$OPENAI_API_KEY

# Next.js runs on port 3000
EXPOSE 3000

# Default command
CMD ["npm", "start"]
