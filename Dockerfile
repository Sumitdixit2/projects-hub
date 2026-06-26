FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

COPY apps/api/package.json ./apps/api/package.json
COPY packages/shared/package.json ./packages/shared/package.json

RUN npm ci 

COPY tsconfig.base.json ./
COPY apps/api ./apps/api
COPY packages/shared ./packages/shared

RUN npm run build -w shared
RUN npm run build -w api

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/
COPY packages/shared/package.json packages/shared/

RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/apps/api/dist ./apps/api/dist

COPY --from=builder /app/apps/api/migrations ./apps/api/migrations

EXPOSE 4000

CMD ["npm","run","start","-w","api"]
