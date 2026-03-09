import { findNodeByOwnerToken } from './owner.js';

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });

export async function handleOwnerImageUpload(token, request, env) {
  const node = await findNodeByOwnerToken(env, token);
  if (!node) {
    return json({ error: 'Invalid owner token' }, 404);
  }

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return json({ error: 'Expected multipart/form-data' }, 400);
  }

  const file = formData.get('image');
  if (!file || typeof file.arrayBuffer !== 'function') {
    return json({ error: 'Missing image file' }, 400);
  }

  const key = `nodes/${crypto.randomUUID()}.jpg`;
  const buffer = await file.arrayBuffer();

  await env.NODE_IMAGES.put(key, buffer, {
    httpMetadata: {
      contentType: file.type || 'image/jpeg'
    }
  });

  const imageUrl = `https://pub-${env.NODE_IMAGES.bucketName || 'liminall-node-images'}.r2.dev/${key}`;

  await env.DB.prepare('UPDATE nodes SET profile_image_url = ?, updated_at = ? WHERE id = ?')
    .bind(imageUrl, new Date().toISOString(), node.id)
    .run();

  return json({ ok: true, imageUrl });
}
