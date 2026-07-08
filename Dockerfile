# ==============================================================================
# Build Stage: Compile and Bundle Application
# ==============================================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install ALL dependencies (including devDependencies for compile time)
RUN npm ci

# Copy source files
COPY . .

# Build frontend and bundle the server.ts file to CJS format
RUN npm run build

# ==============================================================================
# Runtime Stage: Slim Production Container
# ==============================================================================
FROM node:22-alpine AS runner

WORKDIR /app

# Set node environment to production
ENV NODE_ENV=production
ENV PORT=3000

# Copy package manifests
COPY package*.json ./

# Install only production runtime dependencies
RUN npm ci --only=production

# Copy compiled assets and server bundle from the builder stage
COPY --from=builder /app/dist ./dist

# Expose port (default is 3000, but is fully configurable via PORT env var)
EXPOSE 3000

# Clean-running health check to ensure our Express endpoint remains active
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "const http = require('http'); http.get('http://localhost:' + (process.env.PORT || 3000) + '/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); }).on('error', () => process.exit(1));"

# Launch server
CMD ["npm", "run", "start"]
