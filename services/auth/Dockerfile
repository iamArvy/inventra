FROM node:24-slim

WORKDIR /usr/src/app

RUN apt-get update -y && apt-get install -y openssl libssl-dev
RUN npm install -g corepack && corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod

COPY dist ./dist
COPY proto ./proto
COPY generated ./generated
EXPOSE 3000

CMD ["node", "dist/main"]
