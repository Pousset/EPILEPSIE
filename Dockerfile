# syntax=docker/dockerfile:1

FROM node:22-slim AS base
# OpenSSL : Prisma en a besoin pour detecter la plateforme
RUN apt-get update -y \
 && apt-get install -y --no-install-recommends openssl \
 && rm -rf /var/lib/apt/lists/*
RUN npm install -g pnpm@11
WORKDIR /app

# ---------- 1. Dependances ----------
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* .npmrc* ./
COPY prisma ./prisma
COPY prisma*.config.ts ./
# Valeur factice : sert uniquement a ce que Prisma puisse lire sa config pendant l'installation
RUN DATABASE_URL_UNPOOLED="postgresql://build:build@localhost:5432/build" \
    pnpm install --frozen-lockfile

# ---------- 2. Compilation ----------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Valeurs factices : uniquement pour compiler. Les vraies valeurs sont fournies au lancement
# et ne sont jamais ecrites dans l'image finale (cette etape n'est pas livree).
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build" \
    DATABASE_URL_UNPOOLED="postgresql://build:build@localhost:5432/build" \
    BETTER_AUTH_SECRET="valeur-factice-pour-la-compilation-uniquement" \
    BETTER_AUTH_URL="http://localhost:3000" \
    NEXT_TELEMETRY_DISABLED=1
RUN pnpm exec prisma generate
RUN pnpm build

# ---------- 3. Execution (c'est la seule etape livree) ----------
FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000

RUN apt-get update -y \
 && apt-get install -y --no-install-recommends openssl \
 && rm -rf /var/lib/apt/lists/*

# Utilisateur sans droits administrateur
RUN groupadd --system --gid 1001 nodejs \
 && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]