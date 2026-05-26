pnpm exec prisma migrate deploy || exit 1
pnpm exec prisma generate || exit 1

# Remove dist folder, ignore errors
rm -rf /app/dist 2>/dev/null || rm -rf /app/dist || true
sleep 1

# Launch Prisma Studio in the background
PRISMA_STUDIO_HOST=0.0.0.0 pnpm exec prisma studio --browser none --port 5555 &

# Start the app, replace shell with process
exec pnpm run start:dev
