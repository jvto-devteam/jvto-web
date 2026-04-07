# JVTO WhatsApp Gateway Runbook

This runbook covers the unofficial WhatsApp gateway for the JVTO number `6282244788833`.

## Architecture

- `jvto-web` remains the public website and the internal CMS.
- `services/wa-gateway` runs as a separate long-lived Node.js process on the VPS.
- Both services use the same PostgreSQL database.
- The gateway keeps the WhatsApp Business app active as a linked human device and only automates low-risk support flows.

## Environment

### Gateway service

Create a real environment file on the VPS, for example `/etc/jvto/wa-gateway.env`.

```env
WA_GATEWAY_PORT=4010
WA_GATEWAY_TOKEN=replace-with-a-long-random-internal-token
WA_SESSION_DIR=/var/lib/jvto-wa-gateway/session
DATABASE_URL=postgresql://app_user:replace-me@127.0.0.1:5432/jvto
WA_JVTO_NUMBER=6282244788833
WA_AUTO_REPLY_ENABLED=true
WA_AUTO_PAUSE_MINUTES=180
JVTO_PUBLIC_BASE_URL=https://javavolcano-touroperator.com
```

Optional:

```env
WA_RULESET_PATH=/app/jvto-web/docs/whatsapp-jvto-semi-chatbot-templates.json
```

### `jvto-web`

Add these variables to the app environment used by Next.js:

```env
WA_GATEWAY_BASE_URL=http://127.0.0.1:4010
WA_GATEWAY_TOKEN=the-same-internal-token-used-by-the-gateway
```

## First-time setup

1. Install gateway dependencies:

```bash
cd /app/jvto-web
npm --prefix services/wa-gateway install
```

2. Build the gateway:

```bash
cd /app/jvto-web
npm run wa:gateway:build
```

3. Create the session directory outside the repo:

```bash
mkdir -p /var/lib/jvto-wa-gateway/session
```

4. Start the gateway with `pm2` or `systemd`.

## Run with PM2

```bash
cd /app/jvto-web/services/wa-gateway
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

Useful commands:

```bash
pm2 status
pm2 logs jvto-wa-gateway
pm2 restart jvto-wa-gateway
```

## Run with systemd

1. Copy the unit file:

```bash
cp /app/jvto-web/services/wa-gateway/deploy/jvto-wa-gateway.service /etc/systemd/system/
```

2. Reload and enable:

```bash
systemctl daemon-reload
systemctl enable --now jvto-wa-gateway
```

Useful commands:

```bash
systemctl status jvto-wa-gateway
journalctl -u jvto-wa-gateway -n 200 --no-pager
systemctl restart jvto-wa-gateway
```

## Pairing flow

1. Start the gateway.
2. Open the CMS at `/cms/whatsapp`.
3. Confirm the gateway status card is reachable.
4. Open the QR section and scan it from the WhatsApp Business app on the JVTO phone.
5. Wait for the connection status to become `connected`.
6. Send one controlled test message from a non-admin number and verify:
   - the inbound message is stored
   - a supported intent gets one auto-reply
   - a human reply from the phone pauses the bot

## Deployment update sequence

When gateway code changes:

```bash
cd /app/jvto-web
git pull origin main
npm install
npm --prefix services/wa-gateway install
npm run build
npm run wa:gateway:build
pm2 restart jvto-web
pm2 restart jvto-wa-gateway
```

If using `systemd` for the gateway:

```bash
systemctl restart jvto-wa-gateway
```

## Operational rules

- Keep the WhatsApp Business phone online and linked.
- Do not use the gateway for bulk campaigns.
- Keep auto-replies limited to pre-booking and low-risk support.
- Let the bot hand off on medical-risk, complaint, payment dispute, refund, or booking-change requests.
- If an operator replies manually, keep the conversation in paused or handoff mode until the issue is resolved.

## Minimum verification checklist

- `GET /health` returns `ok`
- `GET /session/status` returns the correct JVTO number
- QR is visible before pairing and disappears after pairing
- A guest text creates rows in `wa_contacts`, `wa_conversations`, and `wa_messages`
- A supported intent creates a row in `wa_intent_events`
- Manual operator reply pauses automation for that conversation
- Manual send from `/cms/whatsapp` reaches the guest

## Recovery notes

If the gateway loses its session:

1. Check logs first.
2. Confirm `WA_SESSION_DIR` still exists and is writable.
3. Restart the service.
4. If the session is invalid, remove only the contents of the session directory and pair again.

If the CMS cannot reach the gateway:

1. Verify `WA_GATEWAY_BASE_URL` and `WA_GATEWAY_TOKEN` in the Next.js environment.
2. Call `curl -H "Authorization: Bearer ..."` against `http://127.0.0.1:4010/health` from the VPS.
3. Check firewall rules and whether the gateway is still listening on the configured port.
