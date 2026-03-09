const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });

async function sha256Hex(input) {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function findNodeByOwnerToken(env, token) {
  const tokenHash = await sha256Hex(token);
  return env.DB.prepare('SELECT * FROM nodes WHERE owner_token_hash = ?').bind(tokenHash).first();
}

export async function handleOwnerGet(token, env) {
  const node = await findNodeByOwnerToken(env, token);
  if (!node) {
    return json({ error: 'Invalid owner token' }, 404);
  }

  return json(node);
}

export async function handleOwnerPatch(token, request, env) {
  const node = await findNodeByOwnerToken(env, token);
  if (!node) {
    return json({ error: 'Invalid owner token' }, 404);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const allowedFields = [
    'node_type',
    'status',
    'profile_name',
    'public_identifier',
    'public_message',
    'phone',
    'email',
    'whatsapp',
    'last_recovery_lat',
    'last_recovery_lng',
    'last_recovery_label',
    'show_profile_name',
    'show_profile_image',
    'show_identifier',
    'show_message',
    'show_phone',
    'show_email',
    'show_whatsapp',
    'show_last_recovery_point',
    'allow_anonymous_report'
  ];

  const updates = [];
  const values = [];
  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      updates.push(`${field} = ?`);
      values.push(body[field]);
    }
  }

  if (updates.length === 0) {
    return json({ error: 'No valid fields to update' }, 400);
  }

  updates.push('updated_at = ?');
  values.push(new Date().toISOString());
  values.push(node.id);

  await env.DB.prepare(`UPDATE nodes SET ${updates.join(', ')} WHERE id = ?`).bind(...values).run();

  const updated = await env.DB.prepare('SELECT * FROM nodes WHERE id = ?').bind(node.id).first();
  return json(updated);
}

export async function hashOwnerToken(token) {
  return sha256Hex(token);
}
