# Build SPA с pnpm, затем отдаём через nginx (он же проксирует API на backend).
FROM node:22-alpine AS build
WORKDIR /app

# Без husky/postinstall сюрпризов в CI
ENV CI=true
ENV HUSKY=0

# Включаем pnpm через corepack — версия берётся из package.json#packageManager.
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

# Сначала манифесты — лучшее кеширование слоёв
COPY package.json pnpm-lock.yaml ./
# vendor нужен из-за file:vendor\xlsx-0.20.3.tgz в зависимостях
COPY vendor ./vendor

RUN pnpm install --frozen-lockfile

COPY . .

# API_URL="" => фронт стучится на тот же origin, nginx ниже проксирует на backend.
ARG VITE_API_URL=""
ENV VITE_API_URL=${VITE_API_URL}

RUN pnpm build

FROM nginx:1.27-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
