FROM node:22-alpine AS builder

RUN npm install -g pnpm

WORKDIR /app

COPY pnpm-lock.yaml package.json ./

RUN pnpm install --frozen-lockfile
RUN apk add --no-cache openssl

COPY prisma ./prisma/
RUN pnpm exec prisma generate

COPY . .

EXPOSE 3000

CMD ["sh", "-c", "pnpm exec prisma migrate deploy && pnpm run start:dev"]