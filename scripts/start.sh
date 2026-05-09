#!/bin/sh
set -e
pnpm exec prisma migrate deploy
rm -rf /app/dist 2>/dev/null || true
sleep 1
exec pnpm run start:dev
