# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files (including package-lock.json)
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma Client
RUN npm run prisma:generate

# Build TypeScript
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files (including package-lock.json)
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy built files and Prisma schema
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "dist/server.js"]

