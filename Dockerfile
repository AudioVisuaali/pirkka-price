FROM node:16-slim@sha256:e41a70d089deb43717a834c5c966842dab760e56257bfe391f3f161ce5b28c52 AS base
RUN apt update && apt install git -y
WORKDIR /app

FROM base AS pruner
COPY ./app ./app
COPY ./package.json .
COPY ./tsconfig.json .
COPY ./package-lock.json .

FROM base AS dev-deps
COPY --from=pruner /app/ .
RUN npm ci

FROM base AS prod-deps
COPY --from=pruner /app/ ./prod-deps/
RUN cd ./prod-deps/ && npm ci --only=production

FROM base AS builder
COPY --from=pruner /app/ .
COPY --from=dev-deps /app/node_modules/ ./node_modules/
RUN npm run build

FROM node:16-slim@sha256:e41a70d089deb43717a834c5c966842dab760e56257bfe391f3f161ce5b28c52 AS release
WORKDIR /home/node

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
RUN apt-get update && apt-get install curl gnupg -y \
  && curl --location --silent https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install google-chrome-stable -y --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*


COPY --chown=node:node --from=builder /app/dist ./
COPY --chown=node:node --from=prod-deps /app/prod-deps/node_modules ./node_modules
RUN ["rm", "-rf", "/app"]

USER node

CMD [ "node", "./index.js" ]
