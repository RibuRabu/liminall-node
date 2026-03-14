# Liminall Node Engine – Agent Rules

## Core rule

Do not rebuild this project from scratch.
Do not replace working functionality with placeholders.
Do not simplify implemented features into dummy versions.

## Priority rule

Protect working functionality first.
Then extend.
Never downgrade the project.

## Editing rule

When changing a file:

* rewrite the full file
* do not give partial patches
* do not remove existing working logic unless explicitly asked
* preserve existing working routes, bindings, and database usage

## Change workflow

Changes must follow this order:

1. modify one file
2. test
3. commit
4. deploy

Do not mix authentication changes and UI changes in the same step unless explicitly asked.

## Project architecture

This project uses:

* Cloudflare Workers
* D1 database
* R2 bucket
* Wrangler
* static assets in `/public`

## Runtime rules

Use module worker syntax only.

Example:

```
export default {
  async fetch(request, env, ctx) {
  }
}
```

Do not use `addEventListener("fetch", ...)`.

Use D1 only through:

```
env.DB
```

Use R2 only through:

```
env.NODE_IMAGES
```

Do not call R2 via HTTP APIs.

## Static assets rules

Static files live in `/public`.

Important public files that must remain working:

* `public/public.html`
* `public/owner.html`

Do not replace working UI with placeholders.

## Routing model

Public page:

```
/n/{slug}
```

Bootstrap entry:

```
/o/{token}
```

Owner dashboard:

```
/owner
```

Public API:

```
/api/public/{slug}
```

Session owner API:

```
/api/owner
/api/owner/events
/api/owner/change-pin
/api/owner/logout
```

Legacy bootstrap endpoints still exist:

```
/api/owner/{token}
/api/owner/{token}/events
/api/owner/{token}/image
```

Other endpoints:

```
/api/report/{slug}
/api/provision
```

Do not change route structure unless explicitly asked.

## Authentication model

Owner access uses bootstrap token + session authentication.

Bootstrap flow:

1. user opens `/o/{token}`
2. user verifies access with PIN
3. worker issues signed `owner_session` cookie
4. redirect to `/owner`

Dashboard flow:

```
/owner
```

Uses the session cookie.

Token is only used during bootstrap.

Session payload contains:

* node_id
* token_hash
* session_version
* exp

## Session invalidation rules

Database column:

```
nodes.owner_session_version
```

PIN change must:

* increment session version
* invalidate old sessions
* issue a new session cookie

Session verification must ensure:

```
payload.session_version == owner_session_version
```

## Data model rules

The `nodes` table already exists.
Do not modify schema unless explicitly asked.

Important fields include:

* id
* node_type
* status
* public_slug
* owner_token_hash
* owner_session_version
* profile_name
* profile_image_url
* public_identifier
* public_message
* phone
* email
* whatsapp
* sms
* preferred_contact
* show_sms
* last_recovery_lat
* last_recovery_lng
* last_recovery_label
* show_profile_name
* show_profile_image
* show_identifier
* show_message
* show_phone
* show_email
* show_whatsapp
* show_last_recovery_point
* allow_anonymous_report
* created_at
* updated_at

The `reports` table also exists and must not be removed.

## Public vs Owner payload rules

Public API must only include fields allowed for public visibility.

Owner-only fields must never appear in public API responses.

Public payload must be constructed separately from owner payload.

Do not rely on frontend-only hiding.

## Visibility logic

Data appears only when:

* value exists
* corresponding visibility flag is enabled

Examples:

```
show_phone = true AND phone exists -> show phone
show_phone = false -> phone must not appear
show_sms = true AND sms exists -> show sms
show_sms = false -> sms must not appear
```

Do not infer SMS from phone automatically.

## Security rules

Never store owner tokens in plaintext.

Store only:

```
owner_token_hash
```

Public APIs must never expose hidden owner fields.

Do not weaken:

* PIN verification
* session signing
* session expiration
* session invalidation

## Owner dashboard rules

Owner dashboard is a real control interface.

Do not remove:

* forms
* toggles
* timeline/history
* image upload
* save logic
* PIN change
* logout

unless explicitly asked.

## Timeline rules

Timeline/history is a real feature.

Preserve:

* event loading
* collapse / expand behaviour
* month filtering
* event rendering logic

Do not replace with placeholder UI.

## Product logic rules

An NFC tag is only a carrier.

The product is the Node identity system.

A Node must survive carrier replacement.

Provisioning architecture must remain:

1. create node
2. generate public slug
3. generate owner token
4. store token hash
5. bind carrier
6. allow carrier replacement

## Deployment rules

Deployment command:

```
cmd /c npx wrangler deploy
```

Do not modify Wrangler configuration unless explicitly asked.

## Repository hygiene

Keep commits narrowly scoped.

Rules:

* do not use `git add .` unless explicitly requested
* stage only intended files
* do not commit `.wrangler/`
* do not commit cache files
* do not commit local state
* do not commit backup files
* do not commit temporary debug files

## Output rules

When changing code:

* provide full file contents
* keep changes minimal
* prefer fixing current implementation

Do not introduce new frameworks.
Do not move the project to another stack.
Do not rename components unless explicitly asked.
