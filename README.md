# GPT-AdminMail

**Version**: 1.0.0  
**Lizenz**: MIT

Node.js-Anwendung, die ungelesene E-Mails per IMAP abruft, mit OpenAI zusammenfasst und das Ergebnis per SMTP versendet. Der Container startet die Zusammenfassung **täglich um 08:00 Uhr** (Zeitzone `Europe/Berlin`) über PM2-Cron.

## Inhaltsverzeichnis

- [Features](#features)
- [Umgebungsvariablen](#umgebungsvariablen)
- [Deployment mit GHCR-Image](#deployment-mit-ghcr-image)
  - [Voraussetzungen](#voraussetzungen)
  - [Mittwald-Server (linux/amd64)](#mittwald-server-linuxamd64)
  - [Raspberry Pi 4 (linux/arm64)](#raspberry-pi-4-linuxarm64)
  - [Image manuell aktualisieren](#image-manuell-aktualisieren)
  - [Summarization-Prompt anpassen](#summarization-prompt-anpassen)
- [Lokale Entwicklung](#lokale-entwicklung)
- [CI/CD](#cicd)
- [Abhängigkeiten](#abhängigkeiten)
- [Lizenz](#lizenz)

## Features

- Ungelesene E-Mails per IMAP abrufen und zusammenfassen (OpenAI)
- Zusammenfassung per SMTP versenden
- Täglicher automatischer Lauf um 08:00 Uhr via PM2-Cron
- Multi-Arch-Docker-Image für amd64 (Mittwald) und arm64 (Raspberry Pi 4)

## Umgebungsvariablen

Kopiere `.env.example` nach `.env` und trage die Werte ein. **Keine Secrets ins Repository committen.**

| Variable | Beschreibung |
|----------|--------------|
| `EMAIL_USER` | IMAP-Benutzername |
| `EMAIL_PASSWORD` | IMAP-Passwort |
| `EMAIL_HOST` | IMAP-Server |
| `EMAIL_PORT` | IMAP-Port (Standard: `993`) |
| `EMAIL_TLS` | TLS aktivieren (`true`/`false`) |
| `OPENAI_API_KEY` | OpenAI API-Schlüssel |
| `SMTP_HOST` | SMTP-Server |
| `SMTP_PORT` | SMTP-Port (Standard: `587`) |
| `SMTP_SECURE` | SMTP TLS (`true`/`false`) |
| `SMTP_USER` | SMTP-Benutzername |
| `SMTP_PASS` | SMTP-Passwort |
| `SMTP_FROM` | Absender-Adresse |
| `MAILTO` | Empfänger der Zusammenfassung |
| `SUMMARY_PROMPT_PATH` | Pfad zur Prompt-Datei für die OpenAI-Zusammenfassung (optional; Standard: `./prompts/summary-prompt.txt` lokal bzw. `/app/prompts/summary-prompt.txt` im Container) |

## Deployment mit GHCR-Image

Das produktionsfertige Image wird bei jedem Push auf `main` automatisch nach GitHub Container Registry (GHCR) gebaut und veröffentlicht:

```text
ghcr.io/bernardteske/gpt-adminmail:latest
```

### Voraussetzungen

- Docker und Docker Compose auf dem Zielsystem
- Zugriff auf das GHCR-Image (öffentliches Package oder GitHub-Login für private Packages)
- `.env`-Datei mit allen Variablen aus `.env.example`
- `prompts/summary-prompt.txt` auf dem Host (beim Klonen des Repos enthalten; sonst aus dem Repository kopieren). Fehlt die Datei, legt Docker beim Mount ggf. ein leeres Verzeichnis an — der Container startet dann nicht korrekt.

### Mittwald-Server (linux/amd64)

1. Repository klonen oder nur `docker-compose.yml` und `.env.example` auf den Server kopieren
2. `.env` anlegen:

   ```bash
   cp .env.example .env
   # Werte in .env eintragen
   ```

3. Container starten:

   ```bash
   docker compose pull
   docker compose up -d
   ```

4. Logs prüfen:

   ```bash
   docker compose logs -f gpt-adminmail
   ```

Der Container läuft dauerhaft; PM2 startet `index.js` **täglich um 08:00 Uhr** (Europe/Berlin).

### Raspberry Pi 4 (linux/arm64)

Vorgehen identisch zum Mittwald-Server. Docker zieht automatisch das passende arm64-Image.

```bash
cp .env.example .env
# .env ausfüllen
docker compose pull
docker compose up -d
```

### Image manuell aktualisieren

```bash
docker compose pull
docker compose up -d
```

### Summarization-Prompt anpassen

Der OpenAI-Prompt für die E-Mail-Zusammenfassung liegt in `prompts/summary-prompt.txt`. `docker-compose.yml` mountet diese Datei read-only nach `/app/prompts/summary-prompt.txt` im Container — der Inhalt aus dem Image wird dabei überschrieben.

**Standard-Workflow (kein Image-Rebuild nötig):**

1. Prompt auf dem Host bearbeiten:

   ```bash
   nano prompts/summary-prompt.txt
   ```

2. Container neu starten, damit die App die geänderte Datei beim nächsten Lauf einliest:

   ```bash
   docker compose restart gpt-adminmail
   ```

Ohne Volume-Mount (z. B. bei `docker run` ohne `-v`) nutzt die App den im Image gebündelten Default unter `/app/prompts/summary-prompt.txt`.

**Eigener Prompt-Pfad auf dem Host**

Wenn die Prompt-Datei an einem anderen Ort liegt, passe den Volume-Mount in `docker-compose.yml` an:

```yaml
volumes:
  - /pfad/auf/dem/host/mein-prompt.txt:/app/prompts/summary-prompt.txt:ro
```

Alternativ kann ein anderer Container-Pfad über `SUMMARY_PROMPT_PATH` gesetzt werden (in `.env` oder unter `environment` in `docker-compose.yml`):

```yaml
environment:
  SUMMARY_PROMPT_PATH: /app/prompts/custom-prompt.txt
volumes:
  - /pfad/auf/dem/host/mein-prompt.txt:/app/prompts/custom-prompt.txt:ro
```

## Lokale Entwicklung

```bash
git clone https://github.com/BernardTeske/GPT-AdminMail.git
cd GPT-AdminMail
cp .env.example .env
# .env ausfüllen
yarn install
node index.js
```

Zum lokalen Image-Build (ohne GHCR):

```bash
docker build -t gpt-adminmail:local .
docker run --env-file .env gpt-adminmail:local
```

## CI/CD

Der Workflow `.github/workflows/docker-publish.yml` baut bei Push auf `main` ein Multi-Arch-Image (`linux/amd64`, `linux/arm64`) und pusht es nach `ghcr.io/bernardteske/gpt-adminmail:latest`. Authentifizierung erfolgt über `GITHUB_TOKEN` (`packages: write`).

## Abhängigkeiten

- **dotenv** — Umgebungsvariablen laden
- **imap-simple** — IMAP-Zugriff
- **mailparser** — E-Mail-Parsing
- **nodemailer** — SMTP-Versand
- **openai** — OpenAI API

Details siehe [package.json](./package.json).

## Lizenz

MIT — siehe [LICENSE](./LICENSE).
