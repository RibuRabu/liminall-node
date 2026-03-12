export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === "GET" && path === "/public") {
      const slug = (url.searchParams.get("slug") || "").trim();

      if (slug) {
        const redirectUrl = new URL(`/n/${encodeURIComponent(slug)}`, request.url);
        return Response.redirect(redirectUrl.toString(), 302);
      }
    }

    if (request.method === "GET" && path.startsWith("/images/")) {
      return serveNodeImage(request, env, path);
    }

    if (request.method === "GET" && path.startsWith("/n/")) {
      return servePublicPage(request, env);
    }

    if (request.method === "GET" && path.startsWith("/o/")) {
      return serveOwnerPage(request, env);
    }

    if (request.method === "POST" && path === "/api/provision") {
      return provisionNode(request, env);
    }

    if (request.method === "POST" && path === "/api/admin/reissue-owner") {
      return reissueOwnerToken(request, env);
    }

    if (request.method === "GET" && path.startsWith("/api/admin/node/")) {
      const slug = path.split("/").pop();
      return getAdminNodeInspector(request, env, slug);
    }

    if (request.method === "GET" && path.startsWith("/api/public/")) {
      const slug = path.split("/").pop();
      return getPublicNode(env, slug);
    }

    if (
      request.method === "GET" &&
      path.startsWith("/api/owner/") &&
      path.endsWith("/events")
    ) {
      const parts = path.split("/");
      const token = parts[3];
      return getOwnerNodeEvents(env, token);
    }

    if (
      request.method === "POST" &&
      path.startsWith("/api/owner/") &&
      path.endsWith("/carrier")
    ) {
      const parts = path.split("/");
      const token = parts[3];
      return replaceCarrier(request, env, token);
    }

    if (
      request.method === "POST" &&
      path.startsWith("/api/owner/") &&
      path.endsWith("/image")
    ) {
      const parts = path.split("/");
      const token = parts[3];
      return uploadOwnerNodeImage(request, env, token);
    }

    if (
      request.method === "DELETE" &&
      path.startsWith("/api/owner/") &&
      path.endsWith("/image")
    ) {
      const parts = path.split("/");
      const token = parts[3];
      return deleteOwnerNodeImage(request, env, token);
    }

    if (request.method === "GET" && path.startsWith("/api/owner/")) {
      const token = path.split("/").pop();
      return getOwnerNode(env, token);
    }

    if (request.method === "POST" && path.startsWith("/api/owner/")) {
      const token = path.split("/").pop();
      return updateOwnerNode(request, env, token);
    }

    if (request.method === "POST" && path.startsWith("/api/report/")) {
      const slug = path.split("/").pop();
      return createAnonymousReport(request, env, slug);
    }

    if (request.method === "GET" && path === "/") {
      return new Response("Liminall Node Engine", { status: 200 });
    }

    if (request.method === "GET") {
      return env.ASSETS.fetch(request);
    }

    return new Response("Not found", { status: 404 });
  }
};

async function servePublicPage(request, env) {
  return fetchInternalHtmlAsset(request, env, "/public.html");
}

async function serveOwnerPage(request, env) {
  return fetchInternalHtmlAsset(request, env, "/owner.html");
}

async function fetchInternalHtmlAsset(request, env, assetPath) {
  const assetUrl = new URL(assetPath, request.url);

  const headers = new Headers();
  const accept = request.headers.get("accept");
  const userAgent = request.headers.get("user-agent");
  const acceptLanguage = request.headers.get("accept-language");

  if (accept) headers.set("accept", accept);
  if (userAgent) headers.set("user-agent", userAgent);
  if (acceptLanguage) headers.set("accept-language", acceptLanguage);

  const assetRequest = new Request(assetUrl.toString(), {
    method: "GET",
    headers,
    redirect: "follow"
  });

  return env.ASSETS.fetch(assetRequest);
}

async function serveNodeImage(request, env, path) {
  const key = path.replace(/^\/images\//, "").trim();

  if (!key) {
    return new Response("Image not found", { status: 404 });
  }

  const object = await env.NODE_IMAGES.get(key);

  if (!object) {
    return new Response("Image not found", { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("cache-control", "public, max-age=31536000, immutable");

  return new Response(object.body, {
    status: 200,
    headers
  });
}

async function provisionNode(request, env) {
  const adminKey = request.headers.get("x-admin-key");

  if (!env.PROVISION_ADMIN_KEY || adminKey !== env.PROVISION_ADMIN_KEY) {
    return new Response("Forbidden", { status: 403 });
  }

  const nodeId = crypto.randomUUID();
  const slug = await generateUniqueSlug(env);
  const ownerToken = generateToken();
  const ownerTokenHash = await sha256(ownerToken);
  const identifier = generateIdentifier();
  const now = new Date().toISOString();

  const defaultProfileName = "Node";
  const defaultPublicMessage = "This tag is linked to a persistent digital identity object.";
  const defaultPreferredContact = "none";

  await env.DB.prepare(`
    INSERT INTO nodes (
      id,
      node_type,
      status,
      public_slug,
      owner_token_hash,
      profile_name,
      public_identifier,
      public_message,
      preferred_contact,
      show_profile_name,
      show_identifier,
      show_message,
      allow_anonymous_report,
      created_at,
      updated_at
    )
    VALUES (?, 'generic', 'active', ?, ?, ?, ?, ?, ?, 1, 1, 1, 1, ?, ?)
  `)
    .bind(
      nodeId,
      slug,
      ownerTokenHash,
      defaultProfileName,
      identifier,
      defaultPublicMessage,
      defaultPreferredContact,
      now,
      now
    )
    .run();

  await insertNodeEvent(env, {
    nodeId,
    eventType: "NODE_CREATED",
    actorType: "system",
    actorRef: null,
    payload: {
      node_type: "generic",
      status: "active",
      public_slug: slug,
      public_identifier: identifier,
      profile_name: defaultProfileName,
      public_message: defaultPublicMessage,
      preferred_contact: defaultPreferredContact,
      show_profile_name: 1,
      show_identifier: 1,
      show_message: 1,
      allow_anonymous_report: 1
    },
    createdAt: now
  });

  return Response.json({
    public_url: `/n/${slug}`,
    owner_url: `/o/${ownerToken}`,
    identifier
  });
}

async function reissueOwnerToken(request, env) {
  const adminKey = request.headers.get("x-admin-key");

  if (!env.PROVISION_ADMIN_KEY || adminKey !== env.PROVISION_ADMIN_KEY) {
    return new Response("Forbidden", { status: 403 });
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const publicSlug = sanitizeRequiredString(body.public_slug, 255);
  const reason = sanitizeNullableString(body.reason, null, 255);

  if (!publicSlug) {
    return new Response("public_slug is required", { status: 400 });
  }

  const node = await env.DB.prepare(`
    SELECT
      id,
      public_slug,
      public_identifier
    FROM nodes
    WHERE public_slug = ?
    LIMIT 1
  `)
    .bind(publicSlug)
    .first();

  if (!node) {
    return new Response("Node not found", { status: 404 });
  }

  const newOwnerToken = generateToken();
  const newOwnerTokenHash = await sha256(newOwnerToken);
  const now = new Date().toISOString();

  await env.DB.prepare(`
    UPDATE nodes
    SET
      owner_token_hash = ?,
      updated_at = ?
    WHERE id = ?
  `)
    .bind(
      newOwnerTokenHash,
      now,
      node.id
    )
    .run();

  await insertNodeEvent(env, {
    nodeId: node.id,
    eventType: "OWNER_TOKEN_REISSUED",
    actorType: "admin",
    actorRef: null,
    payload: {
      public_slug: node.public_slug,
      public_identifier: node.public_identifier,
      reason: reason || "admin_reissue",
      token_format: "base64url_128bit"
    },
    createdAt: now
  });

  return Response.json({
    ok: true,
    public_slug: node.public_slug,
    public_identifier: node.public_identifier,
    owner_url: `/o/${newOwnerToken}`,
    created_at: now
  });
}

async function getAdminNodeInspector(request, env, slug) {
  const adminKey = request.headers.get("x-admin-key");

  if (!env.PROVISION_ADMIN_KEY || adminKey !== env.PROVISION_ADMIN_KEY) {
    return new Response("Forbidden", { status: 403 });
  }

  const node = await env.DB.prepare(`
    SELECT
      id,
      node_type,
      status,
      public_slug,
      public_identifier,
      profile_name,
      profile_image_url,
      public_message,
      phone,
      sms,
      email,
      whatsapp,
      preferred_contact,
      last_recovery_lat,
      last_recovery_lng,
      last_recovery_label,
      show_profile_name,
      show_profile_image,
      show_identifier,
      show_message,
      show_phone,
      show_sms,
      show_email,
      show_whatsapp,
      show_last_recovery_point,
      allow_anonymous_report,
      created_at,
      updated_at
    FROM nodes
    WHERE public_slug = ?
    LIMIT 1
  `)
    .bind(slug)
    .first();

  if (!node) {
    return new Response("Node not found", { status: 404 });
  }

  const eventsResult = await env.DB.prepare(`
    SELECT
      id,
      event_type,
      actor_type,
      actor_ref,
      payload_json,
      created_at
    FROM node_events
    WHERE node_id = ?
    ORDER BY created_at DESC
  `)
    .bind(node.id)
    .all();

  const reportsResult = await env.DB.prepare(`
    SELECT
      id,
      message,
      image_url,
      location,
      created_at
    FROM reports
    WHERE node_id = ?
    ORDER BY created_at DESC
  `)
    .bind(node.id)
    .all();

  const events = (eventsResult.results || []).map((row) => ({
    id: row.id,
    event_type: row.event_type,
    actor_type: row.actor_type,
    actor_ref: row.actor_ref,
    payload: safeParseJson(row.payload_json),
    created_at: row.created_at
  }));

  const reports = reportsResult.results || [];

  return Response.json({
    node,
    events,
    reports
  });
}

async function getPublicNode(env, slug) {
  const row = await env.DB.prepare(`
    SELECT
      public_slug,
      profile_name,
      profile_image_url,
      public_message,
      public_identifier,
      phone,
      sms,
      email,
      whatsapp,
      preferred_contact,
      last_recovery_lat,
      last_recovery_lng,
      last_recovery_label,
      show_profile_name,
      show_profile_image,
      show_identifier,
      show_message,
      show_phone,
      show_sms,
      show_email,
      show_whatsapp,
      show_last_recovery_point,
      allow_anonymous_report,
      status
    FROM nodes
    WHERE public_slug = ?
    LIMIT 1
  `)
    .bind(slug)
    .first();

  if (!row) {
    return new Response("Node not found", { status: 404 });
  }

  const publicData = {
    slug: row.public_slug || "",
    name: resolveVisibilityFlag(row.show_profile_name, 1) ? (row.profile_name || "") : "",
    image_url: resolveVisibilityFlag(row.show_profile_image, 1) ? (row.profile_image_url || "") : "",
    identifier: resolveVisibilityFlag(row.show_identifier, 1) ? (row.public_identifier || "") : "",
    message: resolveVisibilityFlag(row.show_message, 1) ? (row.public_message || "") : "",
    contact_phone: resolveVisibilityFlag(row.show_phone, 0) ? (row.phone || "") : "",
    contact_sms: resolveVisibilityFlag(row.show_sms, 0) ? (row.sms || "") : "",
    contact_email: resolveVisibilityFlag(row.show_email, 0) ? (row.email || "") : "",
    contact_whatsapp: resolveVisibilityFlag(row.show_whatsapp, 0) ? (row.whatsapp || "") : "",
    preferred_contact: sanitizePreferredContact(row.preferred_contact, "none"),
    location_label: resolveVisibilityFlag(row.show_last_recovery_point, 0) ? (row.last_recovery_label || "") : "",
    location_city: resolveVisibilityFlag(row.show_last_recovery_point, 0) ? extractLocationCity(row.last_recovery_label) : "",
    location_country: resolveVisibilityFlag(row.show_last_recovery_point, 0) ? extractLocationCountry(row.last_recovery_label) : "",
    location_address: "",
    location_lat: resolveVisibilityFlag(row.show_last_recovery_point, 0) ? row.last_recovery_lat : null,
    location_lon: resolveVisibilityFlag(row.show_last_recovery_point, 0) ? row.last_recovery_lng : null,
    allow_anonymous_report: resolveVisibilityFlag(row.allow_anonymous_report, 1),
    status: row.status || ""
  };

  return Response.json(publicData);
}

async function getOwnerNode(env, token) {
  const tokenHash = await sha256(token);

  const row = await env.DB.prepare(`
    SELECT
      id,
      node_type,
      status,
      public_slug,
      public_identifier,
      profile_name,
      profile_image_url,
      public_message,
      phone,
      sms,
      email,
      whatsapp,
      preferred_contact,
      last_recovery_lat,
      last_recovery_lng,
      last_recovery_label,
      show_profile_name,
      show_profile_image,
      show_identifier,
      show_message,
      show_phone,
      show_sms,
      show_email,
      show_whatsapp,
      show_last_recovery_point,
      allow_anonymous_report,
      created_at,
      updated_at
    FROM nodes
    WHERE owner_token_hash = ?
    LIMIT 1
  `)
    .bind(tokenHash)
    .first();

  if (!row) {
    return new Response("Owner token invalid", { status: 404 });
  }

  return Response.json(row);
}

async function getOwnerNodeEvents(env, token) {
  const tokenHash = await sha256(token);

  const node = await env.DB.prepare(`
    SELECT
      id,
      public_slug,
      public_identifier
    FROM nodes
    WHERE owner_token_hash = ?
    LIMIT 1
  `)
    .bind(tokenHash)
    .first();

  if (!node) {
    return new Response("Owner token invalid", { status: 404 });
  }

  const rows = await env.DB.prepare(`
    SELECT
      id,
      event_type,
      actor_type,
      actor_ref,
      payload_json,
      created_at
    FROM node_events
    WHERE node_id = ?
    ORDER BY created_at DESC
  `)
    .bind(node.id)
    .all();

  const events = (rows.results || []).map((row) => ({
    id: row.id,
    event_type: row.event_type,
    actor_type: row.actor_type,
    actor_ref: row.actor_ref,
    payload: safeParseJson(row.payload_json),
    created_at: row.created_at
  }));

  return Response.json({
    node_id: node.id,
    public_slug: node.public_slug,
    public_identifier: node.public_identifier,
    events
  });
}

async function replaceCarrier(request, env, token) {
  const tokenHash = await sha256(token);

  const node = await env.DB.prepare(`
    SELECT
      id,
      public_slug,
      public_identifier,
      status
    FROM nodes
    WHERE owner_token_hash = ?
    LIMIT 1
  `)
    .bind(tokenHash)
    .first();

  if (!node) {
    return new Response("Owner token invalid", { status: 404 });
  }

  let body = {};

  try {
    if (request.headers.get("content-type")?.includes("application/json")) {
      body = await request.json();
    }
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const reason = sanitizeNullableString(body.reason, null, 255);
  const notes = sanitizeNullableString(body.notes, null, 1000);
  const now = new Date().toISOString();

  await insertNodeEvent(env, {
    nodeId: node.id,
    eventType: "CARRIER_REPLACED",
    actorType: "owner",
    actorRef: null,
    payload: {
      public_slug: node.public_slug,
      public_identifier: node.public_identifier,
      replacement_mode: "same-node-same-public-url",
      reason,
      notes
    },
    createdAt: now
  });

  return Response.json({
    ok: true,
    message: "Carrier replacement recorded",
    node_id: node.id,
    public_slug: node.public_slug,
    public_identifier: node.public_identifier,
    public_url: `/n/${node.public_slug}`,
    event_type: "CARRIER_REPLACED",
    created_at: now
  });
}

async function uploadOwnerNodeImage(request, env, token) {
  const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
  const ALLOWED_IMAGE_TYPES = new Set([
    "image/png",
    "image/jpeg",
    "image/webp",
    "image/gif"
  ]);

  const tokenHash = await sha256(token);

  const existing = await env.DB.prepare(`
    SELECT
      id,
      public_slug,
      public_identifier,
      profile_image_url
    FROM nodes
    WHERE owner_token_hash = ?
    LIMIT 1
  `)
    .bind(tokenHash)
    .first();

  if (!existing) {
    return new Response("Owner token invalid", { status: 404 });
  }

  let formData;

  try {
    formData = await request.formData();
  } catch {
    return new Response("Invalid form data", { status: 400 });
  }

  const file = formData.get("image");

  if (!file || typeof file === "string") {
    return new Response("Image file is required", { status: 400 });
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return new Response("Invalid image type", { status: 400 });
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return new Response("Image too large", { status: 400 });
  }

  const extension = getImageExtensionFromMimeType(file.type);
  const imageKey = `nodes/${existing.id}/${crypto.randomUUID()}.${extension}`;

  const previousImageKey = getImageKeyFromUrl(existing.profile_image_url);

  await env.NODE_IMAGES.put(imageKey, file.stream(), {
    httpMetadata: {
      contentType: file.type
    }
  });

  const imageUrl = `/images/${imageKey}`;
  const now = new Date().toISOString();

  await env.DB.prepare(`
    UPDATE nodes
    SET
      profile_image_url = ?,
      updated_at = ?
    WHERE id = ?
  `)
    .bind(
      imageUrl,
      now,
      existing.id
    )
    .run();

  if (previousImageKey) {
    await env.NODE_IMAGES.delete(previousImageKey);
  }

  await insertNodeEvent(env, {
    nodeId: existing.id,
    eventType: "PROFILE_UPDATED",
    actorType: "owner",
    actorRef: null,
    payload: {
      profile_image_url: {
        from: existing.profile_image_url,
        to: imageUrl
      }
    },
    createdAt: now
  });

  const updated = await env.DB.prepare(`
    SELECT
      id,
      node_type,
      status,
      public_slug,
      public_identifier,
      profile_name,
      profile_image_url,
      public_message,
      phone,
      sms,
      email,
      whatsapp,
      preferred_contact,
      last_recovery_lat,
      last_recovery_lng,
      last_recovery_label,
      show_profile_name,
      show_profile_image,
      show_identifier,
      show_message,
      show_phone,
      show_sms,
      show_email,
      show_whatsapp,
      show_last_recovery_point,
      allow_anonymous_report,
      created_at,
      updated_at
    FROM nodes
    WHERE id = ?
    LIMIT 1
  `)
    .bind(existing.id)
    .first();

  return Response.json(updated);
}

async function deleteOwnerNodeImage(request, env, token) {
  const tokenHash = await sha256(token);

  const existing = await env.DB.prepare(`
    SELECT
      id,
      public_slug,
      public_identifier,
      profile_image_url
    FROM nodes
    WHERE owner_token_hash = ?
    LIMIT 1
  `)
    .bind(tokenHash)
    .first();

  if (!existing) {
    return new Response("Owner token invalid", { status: 404 });
  }

  const previousImageUrl = existing.profile_image_url;
  const previousImageKey = getImageKeyFromUrl(previousImageUrl);
  const now = new Date().toISOString();

  if (previousImageKey) {
    await env.NODE_IMAGES.delete(previousImageKey);
  }

  await env.DB.prepare(`
    UPDATE nodes
    SET
      profile_image_url = NULL,
      updated_at = ?
    WHERE id = ?
  `)
    .bind(
      now,
      existing.id
    )
    .run();

  await insertNodeEvent(env, {
    nodeId: existing.id,
    eventType: "PROFILE_UPDATED",
    actorType: "owner",
    actorRef: null,
    payload: {
      profile_image_url: {
        from: previousImageUrl,
        to: null
      }
    },
    createdAt: now
  });

  const updated = await env.DB.prepare(`
    SELECT
      id,
      node_type,
      status,
      public_slug,
      public_identifier,
      profile_name,
      profile_image_url,
      public_message,
      phone,
      sms,
      email,
      whatsapp,
      preferred_contact,
      last_recovery_lat,
      last_recovery_lng,
      last_recovery_label,
      show_profile_name,
      show_profile_image,
      show_identifier,
      show_message,
      show_phone,
      show_sms,
      show_email,
      show_whatsapp,
      show_last_recovery_point,
      allow_anonymous_report,
      created_at,
      updated_at
    FROM nodes
    WHERE id = ?
    LIMIT 1
  `)
    .bind(existing.id)
    .first();

  return Response.json(updated);
}

async function updateOwnerNode(request, env, token) {
  const tokenHash = await sha256(token);

  const existing = await env.DB.prepare(`
    SELECT
      id,
      node_type,
      status,
      public_slug,
      public_identifier,
      profile_name,
      profile_image_url,
      public_message,
      phone,
      sms,
      email,
      whatsapp,
      preferred_contact,
      last_recovery_lat,
      last_recovery_lng,
      last_recovery_label,
      show_profile_name,
      show_profile_image,
      show_identifier,
      show_message,
      show_phone,
      show_sms,
      show_email,
      show_whatsapp,
      show_last_recovery_point,
      allow_anonymous_report,
      created_at,
      updated_at
    FROM nodes
    WHERE owner_token_hash = ?
    LIMIT 1
  `)
    .bind(tokenHash)
    .first();

  if (!existing) {
    return new Response("Owner token invalid", { status: 404 });
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const next = {
    status: sanitizeStatus(body.status, existing.status),
    profile_name: sanitizeNullableString(body.profile_name, existing.profile_name, 120),
    profile_image_url: sanitizeNullableString(body.profile_image_url, existing.profile_image_url, 1000),
    public_message: sanitizeNullableString(body.public_message, existing.public_message, 2000),
    phone: sanitizeNullableString(body.phone, existing.phone, 100),
    sms: sanitizeNullableString(body.sms, existing.sms, 100),
    email: sanitizeNullableString(body.email, existing.email, 255),
    whatsapp: sanitizeNullableString(body.whatsapp, existing.whatsapp, 100),
    preferred_contact: sanitizePreferredContact(body.preferred_contact, existing.preferred_contact),
    last_recovery_lat: sanitizeNullableNumber(body.last_recovery_lat, existing.last_recovery_lat),
    last_recovery_lng: sanitizeNullableNumber(body.last_recovery_lng, existing.last_recovery_lng),
    last_recovery_label: sanitizeNullableString(body.last_recovery_label, existing.last_recovery_label, 255),
    show_profile_name: sanitizeBooleanLike(body.show_profile_name, existing.show_profile_name),
    show_profile_image: sanitizeBooleanLike(body.show_profile_image, existing.show_profile_image),
    show_identifier: sanitizeBooleanLike(body.show_identifier, existing.show_identifier),
    show_message: sanitizeBooleanLike(body.show_message, existing.show_message),
    show_phone: sanitizeBooleanLike(body.show_phone, existing.show_phone),
    show_sms: sanitizeBooleanLike(body.show_sms, existing.show_sms),
    show_email: sanitizeBooleanLike(body.show_email, existing.show_email),
    show_whatsapp: sanitizeBooleanLike(body.show_whatsapp, existing.show_whatsapp),
    show_last_recovery_point: sanitizeBooleanLike(body.show_last_recovery_point, existing.show_last_recovery_point),
    allow_anonymous_report: sanitizeBooleanLike(body.allow_anonymous_report, existing.allow_anonymous_report)
  };

  const now = new Date().toISOString();

  await env.DB.prepare(`
    UPDATE nodes
    SET
      status = ?,
      profile_name = ?,
      profile_image_url = ?,
      public_message = ?,
      phone = ?,
      sms = ?,
      email = ?,
      whatsapp = ?,
      preferred_contact = ?,
      last_recovery_lat = ?,
      last_recovery_lng = ?,
      last_recovery_label = ?,
      show_profile_name = ?,
      show_profile_image = ?,
      show_identifier = ?,
      show_message = ?,
      show_phone = ?,
      show_sms = ?,
      show_email = ?,
      show_whatsapp = ?,
      show_last_recovery_point = ?,
      allow_anonymous_report = ?,
      updated_at = ?
    WHERE id = ?
  `)
    .bind(
      next.status,
      next.profile_name,
      next.profile_image_url,
      next.public_message,
      next.phone,
      next.sms,
      next.email,
      next.whatsapp,
      next.preferred_contact,
      next.last_recovery_lat,
      next.last_recovery_lng,
      next.last_recovery_label,
      next.show_profile_name,
      next.show_profile_image,
      next.show_identifier,
      next.show_message,
      next.show_phone,
      next.show_sms,
      next.show_email,
      next.show_whatsapp,
      next.show_last_recovery_point,
      next.allow_anonymous_report,
      now,
      existing.id
    )
    .run();

  const changeSet = buildChangeSet(existing, next);

  if (Object.keys(changeSet).length > 0) {
    await insertNodeEvent(env, {
      nodeId: existing.id,
      eventType: deriveOwnerUpdateEventType(changeSet),
      actorType: "owner",
      actorRef: null,
      payload: changeSet,
      createdAt: now
    });
  }

  const updated = await env.DB.prepare(`
    SELECT
      id,
      node_type,
      status,
      public_slug,
      public_identifier,
      profile_name,
      profile_image_url,
      public_message,
      phone,
      sms,
      email,
      whatsapp,
      preferred_contact,
      last_recovery_lat,
      last_recovery_lng,
      last_recovery_label,
      show_profile_name,
      show_profile_image,
      show_identifier,
      show_message,
      show_phone,
      show_sms,
      show_email,
      show_whatsapp,
      show_last_recovery_point,
      allow_anonymous_report,
      created_at,
      updated_at
    FROM nodes
    WHERE id = ?
    LIMIT 1
  `)
    .bind(existing.id)
    .first();

  return Response.json(updated);
}

async function createAnonymousReport(request, env, slug) {
  const node = await env.DB.prepare(`
    SELECT
      id,
      public_slug,
      allow_anonymous_report,
      status
    FROM nodes
    WHERE public_slug = ?
    LIMIT 1
  `)
    .bind(slug)
    .first();

  if (!node) {
    return new Response("Node not found", { status: 404 });
  }

  if (!isTruthyDbValue(node.allow_anonymous_report)) {
    return new Response("Anonymous reporting disabled", { status: 403 });
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const finderName = sanitizeNullableString(body.name, null, 255);
  const finderContact = sanitizeNullableString(body.contact, null, 255);
  const message = sanitizeRequiredString(body.message, 2000);
  const location = sanitizeNullableString(body.location, null, 255);

  if (!message) {
    return new Response("Message is required", { status: 400 });
  }

  const reportId = crypto.randomUUID();
  const now = new Date().toISOString();

  await env.DB.prepare(`
    INSERT INTO reports (
      id,
      node_id,
      message,
      location,
      created_at
    )
    VALUES (?, ?, ?, ?, ?)
  `)
    .bind(
      reportId,
      node.id,
      message,
      location,
      now
    )
    .run();

  await insertNodeEvent(env, {
    nodeId: node.id,
    eventType: "ANONYMOUS_REPORT_CREATED",
    actorType: "finder",
    actorRef: finderContact || finderName || null,
    payload: {
      report_id: reportId,
      finder_name: finderName,
      finder_contact: finderContact,
      message,
      location
    },
    createdAt: now
  });

  return Response.json({
    ok: true,
    report_id: reportId,
    finder_name: finderName,
    finder_contact: finderContact,
    message: "Report submitted"
  });
}

async function insertNodeEvent(env, { nodeId, eventType, actorType, actorRef, payload, createdAt }) {
  const eventId = crypto.randomUUID();
  const payloadJson = payload ? JSON.stringify(payload) : null;

  await env.DB.prepare(`
    INSERT INTO node_events (
      id,
      node_id,
      event_type,
      actor_type,
      actor_ref,
      payload_json,
      created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)
    .bind(
      eventId,
      nodeId,
      eventType,
      actorType,
      actorRef,
      payloadJson,
      createdAt
    )
    .run();
}

function buildChangeSet(existing, next) {
  const fields = [
    "status",
    "profile_name",
    "profile_image_url",
    "public_message",
    "phone",
    "sms",
    "email",
    "whatsapp",
    "preferred_contact",
    "last_recovery_lat",
    "last_recovery_lng",
    "last_recovery_label",
    "show_profile_name",
    "show_profile_image",
    "show_identifier",
    "show_message",
    "show_phone",
    "show_sms",
    "show_email",
    "show_whatsapp",
    "show_last_recovery_point",
    "allow_anonymous_report"
  ];

  const changes = {};

  for (const field of fields) {
    const before = normalizeCompareValue(existing[field]);
    const after = normalizeCompareValue(next[field]);

    if (before !== after) {
      changes[field] = {
        from: existing[field],
        to: next[field]
      };
    }
  }

  return changes;
}

function deriveOwnerUpdateEventType(changeSet) {
  const keys = Object.keys(changeSet);

  if (keys.length === 1 && keys[0] === "status") {
    return "STATUS_CHANGED";
  }

  if (
    keys.length > 0 &&
    keys.every((key) =>
      [
        "show_profile_name",
        "show_profile_image",
        "show_identifier",
        "show_message",
        "show_phone",
        "show_sms",
        "show_email",
        "show_whatsapp",
        "show_last_recovery_point",
        "allow_anonymous_report"
      ].includes(key)
    )
  ) {
    return "VISIBILITY_UPDATED";
  }

  if (
    keys.length > 0 &&
    keys.every((key) =>
      ["last_recovery_lat", "last_recovery_lng", "last_recovery_label"].includes(key)
    )
  ) {
    return "RECOVERY_LOCATION_UPDATED";
  }

  return "PROFILE_UPDATED";
}

async function generateUniqueSlug(env) {
  for (let i = 0; i < 10; i++) {
    const slug = generateSlug();

    const existing = await env.DB.prepare(`
      SELECT id
      FROM nodes
      WHERE public_slug = ?
      LIMIT 1
    `)
      .bind(slug)
      .first();

    if (!existing) {
      return slug;
    }
  }

  throw new Error("Failed to generate unique slug");
}

function generateSlug() {
  const part = Math.random().toString(36).substring(2, 8);
  return `node-${part}`;
}

function generateToken() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return bytesToBase64Url(bytes);
}

function bytesToBase64Url(bytes) {
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function generateIdentifier() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let id = "";

  for (let i = 0; i < 6; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }

  return `ID#${id}`;
}

async function sha256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  const bytes = Array.from(new Uint8Array(hash));

  return bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function sanitizeStatus(value, fallback) {
  if (typeof value !== "string") {
    return fallback;
  }

  const normalized = value.trim().toLowerCase();

  if (normalized === "active" || normalized === "lost") {
    return normalized;
  }

  return fallback;
}

function sanitizePreferredContact(value, fallback) {
  if (value === undefined) {
    return fallback;
  }

  if (value === null) {
    return "none";
  }

  if (typeof value !== "string") {
    return fallback;
  }

  const normalized = value.trim().toLowerCase();

  if (
    normalized === "phone" ||
    normalized === "sms" ||
    normalized === "whatsapp" ||
    normalized === "email" ||
    normalized === "none"
  ) {
    return normalized;
  }

  return fallback;
}

function sanitizeNullableString(value, fallback, maxLength) {
  if (value === undefined) {
    return fallback;
  }

  if (value === null) {
    return null;
  }

  if (typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim();

  if (trimmed === "") {
    return null;
  }

  return trimmed.slice(0, maxLength);
}

function sanitizeRequiredString(value, maxLength) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  if (trimmed === "") {
    return null;
  }

  return trimmed.slice(0, maxLength);
}

function sanitizeNullableNumber(value, fallback) {
  if (value === undefined) {
    return fallback;
  }

  if (value === null || value === "") {
    return null;
  }

  const num = Number(value);

  if (!Number.isFinite(num)) {
    return fallback;
  }

  return num;
}

function sanitizeBooleanLike(value, fallback) {
  if (value === undefined) {
    return fallback;
  }

  if (value === null) {
    return null;
  }

  if (typeof value === "boolean") {
    return value ? 1 : 0;
  }

  if (value === 1 || value === "1" || value === "true") {
    return 1;
  }

  if (value === 0 || value === "0" || value === "false") {
    return 0;
  }

  return fallback;
}

function normalizeCompareValue(value) {
  if (value === null || value === undefined) {
    return null;
  }

  return String(value);
}

function isTruthyDbValue(value) {
  return value === 1 || value === true || value === "1";
}

function resolveVisibilityFlag(value, fallback) {
  if (value === null || value === undefined) {
    return fallback === 1;
  }

  return isTruthyDbValue(value);
}

function safeParseJson(value) {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function extractLocationCity(label) {
  if (!label || typeof label !== "string") {
    return "";
  }

  const parts = label
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 0) {
    return "";
  }

  if (parts.length === 1) {
    return parts[0];
  }

  return parts[parts.length - 1];
}

function extractLocationCountry(label) {
  if (!label || typeof label !== "string") {
    return "";
  }

  const lower = label.toLowerCase();

  if (lower.includes("finland")) {
    return "Finland";
  }

  if (lower.includes("suomi")) {
    return "Finland";
  }

  return "";
}

function getImageExtensionFromMimeType(mimeType) {
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/jpeg") return "jpg";
  if (mimeType === "image/webp") return "webp";
  if (mimeType === "image/gif") return "gif";
  return "bin";
}

function getImageKeyFromUrl(imageUrl) {
  if (!imageUrl || typeof imageUrl !== "string") {
    return null;
  }

  if (!imageUrl.startsWith("/images/")) {
    return null;
  }

  const key = imageUrl.replace("/images/", "").trim();
  return key || null;
}