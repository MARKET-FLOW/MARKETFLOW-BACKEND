FROM node:22-alpine AS builder
WORKDIR /build

COPY package*.json ./
RUN npm install

COPY app/prisma ./prisma/
RUN npx prisma generate

COPY app/ . 
RUN npm run build

FROM node:22-alpine
RUN apk add --no-cache openssl
WORKDIR /app

COPY --from=builder /build/node_modules ./node_modules
COPY --from=builder /build/dist ./dist
COPY --from=builder /build/package*.json ./
COPY --from=builder /build/prisma ./prisma

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]