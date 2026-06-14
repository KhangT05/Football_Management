FROM node:22-alpine AS deps
WORKDIR /app
COPY api/package*.json ./
COPY prisma ./prisma
RUN npm ci --omit=dev
RUN npx prisma generate

FROM node:22-alpine AS builder
WORKDIR /app
COPY api/package*.json ./
RUN npm ci
COPY api/ .
COPY prisma ./prisma
RUN npx prisma generate
RUN npx tsoa spec-and-routes
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src/generated/swagger.json ./dist/generated/swagger.json
COPY --from=builder /app/prisma ./prisma
COPY api/package*.json ./
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/app.js"]