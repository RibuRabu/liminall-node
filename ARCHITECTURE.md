# AGENTS.md

## Project

Liminall Node is a lightweight NFC-based lost-and-found and contact system.

Each physical Node redirects to a public web page where a finder can contact the owner.

The system is built with a minimal serverless architecture.

---

## Stack

Frontend
- static HTML / CSS / JS

Backend
- Cloudflare Workers

Database
- Cloudflare D1

Deployment
- Wrangler

---

## Routes

Public node page

/n/{slug}

This page is accessed when someone scans the NFC tag.

Owner dashboard

/o/{token}

Used by the owner to manage the node.

API

/api/*

Used by the frontend to update node settings.

---

## Key Files

worker.js  
Cloudflare Worker backend handling API requests.

public.html  
Public node page seen by the finder.

owner.html  
Owner dashboard.

style.css  
Shared styling.

---

## Database

Cloudflare D1

Node records include fields such as:

slug  
token  
name / label  
phone  
sms  
show_sms  
preferred_contact  
location

---

## Important Logic

SMS visibility:

SMS should only appear on the public page when:

- sms value exists
- show_sms is true

SMS must not appear if show_sms is false.

---

## Development Rules

Agents must follow these rules:

- prefer minimal changes
- modify only one file at a time
- avoid unnecessary refactoring
- preserve existing routes
- do not change database schema unless explicitly asked
- avoid adding dependencies

---

## Testing Changes

Typical verification steps:

1. run Wrangler dev server
2. open public node page
3. verify UI behavior
4. test owner dashboard updates

---

## Deployment

Deploy using Wrangler.

Agents should not modify deployment configuration unless explicitly requested.

---

## Agent Behavior

Before implementing any change:

1. understand the current architecture
2. propose the smallest safe fix
3. implement only after confirmation

Prefer reviewing and explaining code before modifying it.
