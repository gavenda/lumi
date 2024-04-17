# Build Step
FROM node:latest as build

RUN corepack enable pnpm && mkdir -p /app/lumi
WORKDIR /app/lumi
COPY package.json pnpm-lock.yaml /app/lumi
RUN pnpm install

# Actual Image
FROM node:current-alpine

RUN mkdir -p /app/lumi
COPY --from=build /app/lumi /app/lumi
WORKDIR /app/lumi

# Start app
CMD ["node", "--import", "tsx/esm", "./src/app.ts"]
