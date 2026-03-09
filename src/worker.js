import { handlePublicGet } from './public.js';
import { handleOwnerGet, handleOwnerPatch, hashOwnerToken } from './owner.js';
import { handleReportCreate } from './report.js';
import { handleOwnerImageUpload } from './upload.js';

function textResponse(text, status = 200, contentType = 'text/plain; charset=utf-8') {
  return new Response(text, { status, headers: { 'content-type': contentType } });
}

function randomBase36(length) {
  const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);

  let out = '';
  for (let i = 0; i < length; i += 1) {
    out += alphabet[bytes[i] % 36];
  }
  return out;
}

function randomHex(length) {
  const bytes = new Uint8Array(Math.ceil(length / 2));
  crypto.getRandomValues(bytes);
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, length);
}

async function generateUniqueSlug(env) {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const slug = randomBase36(6);
    const existing = await env.DB.prepare('SELECT id FROM nodes WHERE public_slug = ?').bind(slug).first();
    if (!existing) return slug;
  }

  throw new Error('Could not generate unique slug');
}

function generatePublicIdentifier() {
  const num = Math.floor(Math.random() * 1000000);
  return `ID#${String(num).padStart(6, '0')}`;
}

async function serveAsset(env, path, requestUrl) {
  if (!env.ASSETS) return null;
  const assetUrl = new URL(path, requestUrl);
  return env.ASSETS.fetch(new Request(assetUrl.toString()));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;

    if (request.method === 'GET' && pathname.startsWith('/api/public/')) {
      const slug = decodeURIComponent(pathname.replace('/api/public/', ''));
      return handlePublicGet(slug, env);
    }

    if (request.method === 'GET' && pathname.startsWith('/api/owner/')) {
      const token = decodeURIComponent(pathname.replace('/api/owner/', ''));
      if (token.includes('/')) return textResponse('Not found', 404);
      return handleOwnerGet(token, env);
    }

    if (request.method === 'PATCH' && pathname.startsWith('/api/owner/')) {
      const token = decodeURIComponent(pathname.replace('/api/owner/', ''));
      if (token.includes('/')) return textResponse('Not found', 404);
      return handleOwnerPatch(token, request, env);
    }

    if (request.method === 'POST' && pathname.startsWith('/api/owner/') && pathname.endsWith('/image')) {
      const token = decodeURIComponent(pathname.replace('/api/owner/', '').replace('/image', '').replace(/\/$/, ''));
      return handleOwnerImageUpload(token, request, env);
    }

    if (request.method === 'POST' && pathname.startsWith('/api/report/')) {
      const slug = decodeURIComponent(pathname.replace('/api/report/', ''));
      return handleReportCreate(slug, request, env);
    }

    if (request.method === 'POST' && pathname === '/api/provision') {
      const id = crypto.randomUUID();
      const publicSlug = await generateUniqueSlug(env);
      const ownerToken = randomHex(32);
      const ownerTokenHash = await hashOwnerToken(ownerToken);
      const now = new Date().toISOString();
      const publicIdentifier = generatePublicIdentifier();

      await env.DB.prepare(`INSERT INTO nodes (
        id,node_type,status,public_slug,owner_token_hash,profile_name,profile_image_url,public_identifier,public_message,
        phone,email,whatsapp,last_recovery_lat,last_recovery_lng,last_recovery_label,
        show_profile_name,show_profile_image,show_identifier,show_message,show_phone,show_email,show_whatsapp,show_last_recovery_point,
        allow_anonymous_report,created_at,updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
        .bind(
          id,
          'pet',
          'active',
          publicSlug,
          ownerTokenHash,
          '',
          '',
          publicIdentifier,
          '',
          '',
          '',
          '',
          null,
          null,
          '',
          1,
          1,
          1,
          1,
          0,
          0,
          0,
          1,
          1,
          now,
          now
        )
        .run();

      return new Response(
        JSON.stringify({
          public_url: `/n/${publicSlug}`,
          owner_url: `/o/${ownerToken}`,
          identifier: publicIdentifier
        }),
        { headers: { 'content-type': 'application/json; charset=utf-8' } }
      );
    }

    if (request.method === 'GET' && pathname.startsWith('/n/')) {
      const response = await serveAsset(env, '/public.html', request.url);
      if (response) return response;
    }

    if (request.method === 'GET' && pathname.startsWith('/o/')) {
      const response = await serveAsset(env, '/owner.html', request.url);
      if (response) return response;
    }

    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return textResponse('Not found', 404);
  }
};
