const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });

function toAction(value) {
  return value === 1 || value === true;
}

export function buildPublicPayload(node) {
  const payload = {
    status: node.status || null,
    identifier: toAction(node.show_identifier) ? node.public_identifier || null : null,
    name: toAction(node.show_profile_name) ? node.profile_name || null : null,
    imageUrl: toAction(node.show_profile_image) ? node.profile_image_url || null : null,
    message: toAction(node.show_message) ? node.public_message || null : null,
    lastSeen: toAction(node.show_last_recovery_point)
      ? {
          lat: node.last_recovery_lat ?? null,
          lng: node.last_recovery_lng ?? null,
          label: node.last_recovery_label || null
        }
      : null,
    actions: {
      anonymousReport: toAction(node.allow_anonymous_report)
    }
  };

  if (toAction(node.show_phone) && node.phone) {
    payload.actions.call = `tel:${node.phone}`;
  }

  if (toAction(node.show_whatsapp) && node.whatsapp) {
    const wa = String(node.whatsapp).replace(/[^\d]/g, '');
    payload.actions.whatsapp = `https://wa.me/${wa}`;
  }

  if (toAction(node.show_email) && node.email) {
    payload.actions.email = `mailto:${node.email}`;
  }

  if (
    toAction(node.show_last_recovery_point) &&
    node.last_recovery_lat !== null &&
    node.last_recovery_lng !== null &&
    node.last_recovery_lat !== undefined &&
    node.last_recovery_lng !== undefined
  ) {
    payload.actions.map = `https://maps.google.com/?q=${node.last_recovery_lat},${node.last_recovery_lng}`;
  }

  return payload;
}

export async function handlePublicGet(slug, env) {
  const node = await env.DB.prepare('SELECT * FROM nodes WHERE public_slug = ?').bind(slug).first();
  if (!node) {
    return json({ error: 'Node not found' }, 404);
  }

  return json(buildPublicPayload(node));
}
