# Dockerfile
# Builds a production-ready NestJS app with Prisma client

FROM node:20-alpine

WORKDIR /app

# Install dependencies (including Prisma CLI from package.json)
COPY package*.json ./
RUN npm ci

# Copy source code (including prisma schema)
COPY . .

# Generate Prisma Client during build (so container has it ready)
RUN npx prisma generate

# Build NestJS project to /dist
RUN npm run build

EXPOSE 3000
# Start the compiled app
CMD ["node", "dist/main.js"]
