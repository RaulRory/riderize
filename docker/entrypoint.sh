#!/bin/sh

set -e

echo "🚀 Gerando Prisma Client..."
npx prisma generate --schema=src/infrastructure/database/prisma/schema.prisma

echo "🚀 Rodando prisma migrate deploy..."
npx prisma migrate deploy --schema=src/infrastructure/database/prisma/schema.prisma

echo "🎯 Iniciando aplicação..."
exec npm run start:dev
