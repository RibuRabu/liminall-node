# Liminall Node Engine

Liminall Node Engine is a Cloudflare Worker system for digital identities of physical Nodes. NFC tags are only carriers that point to a stable Node identity.

## Run locally

```bash
wrangler dev
```

## Run migrations

```bash
wrangler d1 migrations apply liminall-node --local
wrangler d1 migrations apply liminall-node --remote
```

## Deploy

```bash
wrangler deploy
```

## Create first node

```bash
curl -X POST http://127.0.0.1:8787/api/provision \
  -H 'content-type: application/json' \
  -d '{"node_type":"default","profile_name":"First Node","public_identifier":"NODE-001"}'
```

Response includes:
- `publicSlug` and `publicUrl`
- `ownerToken` and `ownerUrl`

Use `publicUrl` in NFC carrier content. Replacing the carrier does not change the Node identity.
