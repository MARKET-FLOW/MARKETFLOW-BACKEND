FROM node:22-alpine

RUN apk add --no-cache openssl dos2unix curl \
    && npm install -g pnpm@10.33.4

ENV CI=true

WORKDIR /app

COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./

COPY .npmrc ./
RUN printf '\nfetch-retries=5\nfetch-retry-mintimeout=20000\nfetch-retry-maxtimeout=120000\nverify-store-integrity=false\n' >> /app/.npmrc

RUN pnpm install --no-frozen-lockfile

COPY . .

RUN pnpm exec prisma generate

EXPOSE 3000

COPY scripts/start.sh /app/scripts/start.sh
RUN dos2unix /app/scripts/start.sh && chmod +x /app/scripts/start.sh

CMD ["/bin/sh", "/app/scripts/start.sh"]