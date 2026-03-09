const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });

export async function handleReportCreate(slug, request, env) {
  const node = await env.DB.prepare('SELECT id, allow_anonymous_report FROM nodes WHERE public_slug = ?').bind(slug).first();
  if (!node) {
    return json({ error: 'Node not found' }, 404);
  }

  if (!(node.allow_anonymous_report === 1 || node.allow_anonymous_report === true)) {
    return json({ error: 'Anonymous reports disabled' }, 403);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const message = body.message || '';
  const lat = body.lat ?? null;
  const lng = body.lng ?? null;
  const imageUrl = body.image_url || null;

  await env.DB.prepare(
    `INSERT INTO reports (id, node_id, message, lat, lng, image_url, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(id, node.id, message, lat, lng, imageUrl, createdAt)
    .run();

  return json({ ok: true, reportId: id, createdAt }, 201);
}
