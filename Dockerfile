# SPA-builder: на выходе образ с собранным /dist; на старте копирует /dist
# в shared volume и завершается. Статику отдаёт отдельный nginx-сервис
# в docker-compose (см. ../nginx/nginx.conf).

FROM node:22-alpine AS build
WORKDIR /app

# Без husky/postinstall сюрпризов в CI
ENV CI=true
ENV HUSKY=0

# pnpm через corepack — версия из package.json#packageManager
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

# Манифесты первыми — для кеша
COPY package.json pnpm-lock.yaml ./
# vendor нужен из-за file:vendor/xlsx-0.20.3.tgz в зависимостях
COPY vendor ./vendor

RUN pnpm install --frozen-lockfile

COPY . .

# API_URL="" => same-origin; backend-роуты проксируются compose-nginx'ом.
ARG VITE_API_URL=""
ENV VITE_API_URL=${VITE_API_URL}

RUN pnpm build

# Финальный stage — лёгкий init-контейнер. Копирует собранную статику
# в /out (compose монтирует туда named volume `frontend-dist`).
FROM alpine:3.20
COPY --from=build /app/dist /dist
CMD ["sh", "-c", "set -e; mkdir -p /out; rm -rf /out/*; cp -a /dist/. /out/; echo 'frontend assets ready'"]
