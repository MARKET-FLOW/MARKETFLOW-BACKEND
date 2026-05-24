FROM node:22-alpine

RUN npm install -g pnpm && apk add --no-cache openssl dos2unix

ENV CI=true

WORKDIR /app

COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./

RUN printf 'ignore-scripts=false\nunsafe-perm=true\n' > /app/.npmrc

RUN pnpm install --no-frozen-lockfile

COPY . .

RUN pnpm exec prisma generate

EXPOSE 3000

COPY scripts/start.sh /app/scripts/start.sh
RUN chmod +x /app/scripts/start.sh

CMD ["/bin/sh", "/app/scripts/start.sh"]