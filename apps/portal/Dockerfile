## Multi-stage Dockerfile for Next.js portal with SNMP support
# 1) Builder: install deps and build Next.js (standalone)
FROM node:20-alpine AS builder
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy only package manifests first for better caching
COPY apps/portal/package.json ./package.json
COPY apps/portal/package-lock.json ./package-lock.json
RUN npm ci --prefer-offline --no-audit --no-fund

# Then copy the rest of the source
COPY apps/portal/ .

# Disable ESLint during build inside Docker to avoid enforcing dev lint rules in CI image build
ENV NEXT_DISABLE_ESLINT=true
RUN npm run build

# 2) Runner: copy standalone output and run
FROM node:20-alpine AS runner
WORKDIR /app

# Install runtime tools for SNMP
RUN apk add --no-cache net-snmp net-snmp-tools

ENV NODE_ENV=production

# Create non-root user
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs

# Copy standalone server and static files from builder
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Ensure correct ownership
RUN chown -R nextjs:nextjs /app
USER nextjs

EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
