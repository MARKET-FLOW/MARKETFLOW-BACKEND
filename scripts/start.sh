
pnpm exec prisma migrate deploy || exit 1
# Remove dist folder, ignore errors
rm -rf /app/dist 2>/dev/null || rm -rf /app/dist || true
sleep 1
# Start the app, replace shell with process
exec pnpm run start:dev
