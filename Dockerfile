FROM node:20-alpine

RUN apk add --no-cache tzdata

ENV TZ=Europe/Berlin
ENV NODE_ENV=production

WORKDIR /app

COPY package.json ./
RUN yarn install --production && yarn global add pm2

COPY . .

CMD ["pm2-runtime", "start", "ecosystem.config.js"]
