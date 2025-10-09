## Single-stage Dockerfile for Next.js portal with SNMP support
FROM node:20-alpine
WORKDIR /app

# Install SNMP tools for querying agents over the network
RUN apk add --no-cache net-snmp net-snmp-tools

# When building with project root as context, copy portal package.json first to ensure correct start script
COPY apps/portal/package.json /app/package.json
# Then copy the rest of the portal files
COPY apps/portal/ /app/
RUN npm install --frozen-lockfile --prefer-offline
# Disable ESLint during build inside Docker to avoid enforcing dev lint rules in CI image build
ENV NEXT_DISABLE_ESLINT=true
RUN npm run build
ENV NODE_ENV=production
EXPOSE 3000
# Start the Next.js server
CMD ["npm", "start"]
