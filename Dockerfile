# Verwenden Sie das neueste Node.js-Image
FROM node:20-alpine

# Erstellen Sie ein Verzeichnis für die App
WORKDIR /app

# Kopieren Sie package.json und yarn.lock
COPY package.json yarn.lock ./

# Installieren Sie die Abhängigkeiten
RUN yarn install --production

# Kopieren Sie den Rest des Anwendungscodes
COPY . .

# Setzen Sie die Umgebungsvariablen für die Produktion
ENV NODE_ENV=production

# Startkommando für die Anwendung
CMD ["node", "index.js"]
