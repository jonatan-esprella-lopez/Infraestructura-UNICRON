FROM node:22-alpine AS base

WORKDIR /workspace

COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages packages

RUN npm ci

COPY . .

FROM base AS api-build
RUN npm run build:api

FROM node:22-alpine AS api
WORKDIR /workspace
ENV NODE_ENV=production

COPY --from=api-build /workspace/node_modules node_modules
COPY --from=api-build /workspace/apps/api/package.json apps/api/package.json
COPY --from=api-build /workspace/apps/api/dist apps/api/dist

EXPOSE 4000
CMD ["node", "apps/api/dist/main.js"]

FROM base AS web-build
RUN npm run build:web

FROM node:22-alpine AS web
WORKDIR /workspace
ENV NODE_ENV=production

RUN npm install -g serve@14
COPY --from=web-build /workspace/apps/web/dist apps/web/dist

EXPOSE 5173
CMD ["serve", "-s", "apps/web/dist", "-l", "5173"]
