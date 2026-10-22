# Node.js LTS — October 2026 Security Releases (u.a. CVE-2026-111497)
ARG NODE_VERSION=24.22.1-alpine
FROM node:${NODE_VERSION}

# Installiere tzdata für die Zeitzoneneinstellung
RUN apk add --no-cache tzdata

# Setze die Zeitzone auf Europe/Berlin (oder deine gewünschte Zeitzone)
ENV TZ=Europe/Berlin

# Erstellen Sie ein Verzeichnis für die App
WORKDIR /app

# Kopieren Sie package.json und yarn.lock
COPY package.json ./

# Installieren Sie die Abhängigkeiten
RUN yarn install --production

# Installieren Sie PM2 global
RUN yarn global add pm2

# Kopieren Sie den Rest des Anwendungscodes
COPY . .

# Setzen Sie die Umgebungsvariablen für die Produktion
ENV NODE_ENV=production

# Standard-Startkommando (wird durch docker-compose überschrieben)
CMD ["pm2-runtime", "start", "index.js"]
