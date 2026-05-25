# Build stage
FROM node:20-alpine as builder

WORKDIR /build

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache dumb-init

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /build/dist ./dist

EXPOSE 4200

ENTRYPOINT ["dumb-init", "--"]

# For development with ng serve
CMD ["npm", "start"]
