# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Accept Firebase environment variables at build time
ARG FIREBASE_PROJECT_ID
ARG FIREBASE_CLIENT_EMAIL
ARG FIREBASE_PRIVATE_KEY

# Make them available for Next.js build
ENV FIREBASE_PROJECT_ID=$FIREBASE_PROJECT_ID
ENV FIREBASE_CLIENT_EMAIL=$FIREBASE_CLIENT_EMAIL
ENV FIREBASE_PRIVATE_KEY=$FIREBASE_PRIVATE_KEY

COPY package*.json ./
RUN npm install
RUN npm install -D tailwindcss postcss autoprefixer firebase

COPY . .
RUN npm run build
