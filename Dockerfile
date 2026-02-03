# -------- Builder --------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy only dependency manifests
COPY package.json package-lock.json ./

# Clean, reproducible install
RUN npm ci

# Copy source (dockerignore MUST exclude node_modules/.next)
COPY . .

# Build Next.js
RUN npm run build
RUN npm install -D tailwindcss postcss autoprefixer firebase


# -------- Runner --------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy only what is needed to run
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["npx", "next", "start", "-H", "0.0.0.0", "-p", "3000"]
