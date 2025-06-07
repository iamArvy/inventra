FROM node:24-slim

WORKDIR /usr/src/app

# Install corepack to manage pnpm easily
RUN npm install -g corepack

# Enable pnpm (corepack comes with Node 16+)
RUN corepack enable
RUN corepack prepare pnpm@latest --activate

RUN apt-get update -y && apt-get install -y openssl libssl-dev

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod


COPY prisma ./prisma
RUN pnpm prisma generate
COPY proto ./proto

COPY ./dist ./ 

EXPOSE 5000

CMD node main
