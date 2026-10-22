# Node.js LTS — October 2026 Security Releases (u.a. CVE-2026-111497)
ARG NODE_VERSION=24.22.1-alpine
FROM node:${NODE_VERSION}

RUN apk add --no-cache tzdata

ENV TZ=Europe/Berlin
ENV NODE_ENV=production

WORKDIR /app

COPY package.json ./
RUN yarn install --production && yarn global add pm2

COPY . .

CMD ["pm2-runtime", "start", "ecosystem.config.js"]
