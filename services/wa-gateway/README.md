# JVTO WA Gateway

Unofficial WhatsApp gateway for JVTO built on `Baileys`.

## What it does

- Maintains the WhatsApp Web multi-device session for the JVTO number.
- Stores contacts, conversations, messages, intent events, and gateway events in PostgreSQL.
- Runs the rules-first English semi-chatbot for foreign tourist support.
- Exposes authenticated internal endpoints for QR, health, manual send, pause/resume, and booking linking.

## Runtime constraints

- Run this as a long-lived VPS service. Do not deploy it to Vercel.
- Keep the WhatsApp Business phone active as a linked human device.
- Session files must be stored outside the repo in `WA_SESSION_DIR`.

## Start

```bash
npm install
npm run build
npm start
```

From the repo root:

```bash
npm run wa:gateway:build
npm run wa:gateway:start
```

## Recommended process manager

Use `pm2` or `systemd`. Example with `pm2`:

```bash
pm2 start dist/index.js --name jvto-wa-gateway --cwd /app/jvto-web/services/wa-gateway
```

Project files:

- `ecosystem.config.cjs`
- `deploy/jvto-wa-gateway.service`
- `../../docs/whatsapp-gateway-runbook.md`

## Required environment variables

- `WA_GATEWAY_PORT`
- `WA_GATEWAY_TOKEN`
- `WA_SESSION_DIR`
- `DATABASE_URL`
- `WA_JVTO_NUMBER`
- `WA_AUTO_REPLY_ENABLED`
- `WA_AUTO_PAUSE_MINUTES`
- `JVTO_PUBLIC_BASE_URL`

## Risk note

This is an unofficial WhatsApp automation stack. Account stability depends on disciplined message volume, human-like operating patterns, and careful handoff controls. Do not use this service for bulk campaigns or high-frequency blasting.
