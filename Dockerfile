FROM node:latest

# Enable pnpm
RUN corepack enable pnpm

# Create app directory
RUN mkdir -p /app/lumi
WORKDIR /app/lumi

# Copy package.json and pnpm-lock.yaml
COPY package.json /app/lumi
COPY pnpm-lock.yaml /app/lumi

# Run install
RUN pnpm install

# Copy source files
COPY . /app/lumi

# Start app
CMD ["node", "--import", "tsx/esm", "./src/app.ts"]