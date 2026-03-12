# Liminall Node Engine – Agent Rules

## Core rule

Do not rebuild this project from scratch.
Do not replace working functionality with placeholders.
Do not simplify implemented features into dummy versions.

## Editing rule

When changing a file:
- rewrite the full file
- do not give partial patches
- do not remove existing working logic unless explicitly asked
- preserve existing working routes, bindings, and database usage

## Project architecture

This project uses:

- Cloudflare Workers
- D1 database
- R2 bucket
- Wrangler
- static assets in `/public`

Current routing model:

- `/n/{slug}` = public node page
- `/o/{token}` = owner dashboard
- `/api/public/{slug}` = public payload
- `/api/owner/{token}` = owner read/update
- `/api/owner/{token}/image` = image upload
- `/api/report/{slug}` = anonymous report
- `/api/provision` = create new node

Do not change this route structure unless explicitly asked.

## Data model rules

The `nodes` table is already defined.
Do not change schema unless explicitly asked.

Important fields already exist and must be preserved:

- id
- node_type
- status
- public_slug
- owner_token_hash
- profile_name
- profile_image_url
- public_identifier
- public_message
- phone
- email
- whatsapp
- last_recovery_lat
- last_recovery_lng
- last_recovery_label
- show_profile_name
- show_profile_image
- show_identifier
- show_message
- show_phone
- show_email
- show_whatsapp
- show_last_recovery_point
- allow_anonymous_report
- created_at
- updated_at

The `reports` table also already exists.
Do not replace or remove it.

## Public vs Owner Payloads

Public API responses must only contain fields explicitly allowed for public visibility.

Owner-only fields must never be returned by the public API.

Visibility flags must be enforced on the backend before assembling the response payload.
## Visibility Logic

Contact fields and profile data must only appear when:

- the value exists
- the corresponding visibility flag is enabled

Example:

show_phone = true AND phone exists → display phone
show_phone = false → phone must not appear in public payload
## Security rules

Never store owner tokens in plaintext.
Always store only `owner_token_hash`.

Public API must never expose hidden owner fields.
Public payload must be built separately from owner payload.

Do not rely on frontend-only hiding for sensitive fields.

## Worker rules

Use module worker syntax only.

Use:

```js
export default {
  async fetch(request, env, ctx) {
  }
}

Do not use addEventListener("fetch", ...).

Use D1 only through:

env.DB

Use R2 only through:

env.NODE_IMAGES

Do not call R2 via HTTP APIs.

Static assets rules

Static files live in /public.

Do not remove or replace working public UI files with placeholders.

## API Routes

Public API

/api/public/{slug}

Owner API

/api/owner/{token}

Owner image upload

/api/owner/{token}/image

Anonymous report endpoint

/api/report/{slug}

Provision new node

/api/provision

Important:

public/public.html must remain a working public page

public/owner.html must remain a working owner dashboard

do not replace real UI with “placeholder” text

UI rules

Owner dashboard is a real control surface, not a placeholder.
Do not remove forms, fields, toggles, image upload, or save logic unless explicitly asked.

Public page must stay aligned with the Liminall ecosystem and dual-anchor model.

Product logic rules

An NFC tag is only a carrier.
The product is the Node identity system.

A Node must survive carrier replacement.

Do not model the system as a single static NFC link.
Preserve the provisioning-based architecture:

Create Node

Generate public slug

Generate owner token

Store owner token hash

Bind carrier to Node

Allow carrier replacement without replacing the Node

Output rules

When asked to change code:

provide complete file contents

keep changes minimal and targeted

prefer fixing the current implementation over rewriting unrelated parts

Do not introduce new frameworks.
Do not move the project to another stack.
Do not change existing naming unless explicitly asked.

Priority rule

Protect working functionality first.
Then extend.
Never downgrade the project.
