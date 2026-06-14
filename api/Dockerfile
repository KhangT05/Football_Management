FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci --omit=dev
RUN npx prisma generate


FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npx tsoa spec-and-routes
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src/generated/swagger.json ./dist/generated/swagger.json
COPY --from=builder /app/prisma ./prisma
COPY package*.json ./
EXPOSE 3005
CMD ["node", "dist/app.js"]