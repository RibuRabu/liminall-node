import { handlePublicGet } from './public.js';
import { handleOwnerGet, handleOwnerPatch, hashOwnerToken } from './owner.js';
import { handleReportCreate } from './report.js';
import { handleOwnerImageUpload } from './upload.js';

function textResponse(text, status = 200, contentType = 'text/plain; charset=utf-8') {
  return new Response(text, { status, headers: { 'content-type': contentType } });
}

function renderPublicPage(slug) {
  return `<!doctype html>
<html lang="fi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Tämä on tunniste</title><link rel="stylesheet" href="/style.css"></head>
<body><main class="card"><h1>Tämä on tunniste</h1><img id="node-image" alt="Node" class="hero" />
<p id="finder-message"></p><div id="actions" class="actions"></div><p><strong id="identifier"></strong></p>
<p id="last-seen"></p><a id="map-link" target="_blank" rel="noopener"></a></main>
<script>window.NODE_SLUG=${JSON.stringify(slug)}</script><script src="/public.js"></script></body></html>`;
}

function renderOwnerPage(token) {
  return `<!doctype html>
<html lang="fi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Owner</title><link rel="stylesheet" href="/style.css"></head>
<body><main class="card"><h1>Owner Control</h1><form id="owner-form">
<label>Nimi <input name="profile_name"></label><label>Viesti <textarea name="public_message"></textarea></label>
<label>Puhelin <input name="phone"></label><label>Sähköposti <input name="email"></label><label>WhatsApp <input name="whatsapp"></label>
<label>Status <select name="status"><option value="active">active</option><option value="lost">lost</option></select></label>
<label>Recovery label <input name="last_recovery_label"></label><label>Recovery lat <input name="last_recovery_lat" type="number" step="any"></label><label>Recovery lng <input name="last_recovery_lng" type="number" step="any"></label>
<fieldset><legend>Näkyvyys</legend>
<label><input type="checkbox" name="show_profile_name">show_profile_name</label>
<label><input type="checkbox" name="show_profile_image">show_profile_image</label>
<label><input type="checkbox" name="show_identifier">show_identifier</label>
<label><input type="checkbox" name="show_message">show_message</label>
<label><input type="checkbox" name="show_phone">show_phone</label>
<label><input type="checkbox" name="show_email">show_email</label>
<label><input type="checkbox" name="show_whatsapp">show_whatsapp</label>
<label><input type="checkbox" name="show_last_recovery_point">show_last_recovery_point</label>
<label><input type="checkbox" name="allow_anonymous_report">allow_anonymous_report</label>
</fieldset><button type="submit">Save</button></form>
<form id="image-form"><input type="file" name="image" accept="image/*"><button type="submit">Upload image</button></form>
<pre id="status-box"></pre></main>
<script>window.OWNER_TOKEN=${JSON.stringify(token)}</script><script src="/owner.js"></script></body></html>`;
}

const PUBLIC_JS = `async function load(){const res=await fetch('/api/public/'+encodeURIComponent(window.NODE_SLUG));const data=await res.json();
document.getElementById('node-image').src=data.imageUrl||'';document.getElementById('finder-message').textContent=data.message||'';
document.getElementById('identifier').textContent=data.identifier||'';document.getElementById('last-seen').textContent=data.lastSeen?.label||'';
const map=document.getElementById('map-link');if(data.actions?.map){map.href=data.actions.map;map.textContent='Avaa kartta';}
const actions=document.getElementById('actions');const links=[['call','📞 Soita puhelimella'],['whatsapp','💬 Lähetä WhatsApp'],['email','✉ Lähetä sähköpostia']];
for(const [k,t] of links){if(data.actions?.[k]){const a=document.createElement('a');a.href=data.actions[k];a.textContent=t;a.className='button';a.target='_blank';actions.appendChild(a);}}
if(data.actions?.anonymousReport){const a=document.createElement('a');a.href='#';a.textContent='📝 Ilmoita tästä tunnisteesta';a.className='button';a.onclick=async(e)=>{e.preventDefault();const message=prompt('Havainto');if(!message)return;await fetch('/api/report/'+encodeURIComponent(window.NODE_SLUG),{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({message})});alert('Ilmoitus lähetetty');};actions.appendChild(a);} }
load();`;

const OWNER_JS = `async function load(){const token=window.OWNER_TOKEN;const res=await fetch('/api/owner/'+encodeURIComponent(token));const data=await res.json();
const f=document.getElementById('owner-form');for(const [k,v] of Object.entries(data)){const el=f.elements[k];if(!el)continue;if(el.type==='checkbox')el.checked=v===1||v===true;else el.value=v??'';}
f.onsubmit=async(e)=>{e.preventDefault();const payload={};for(const el of f.elements){if(!el.name)continue;payload[el.name]=el.type==='checkbox'?(el.checked?1:0):el.value;}
['last_recovery_lat','last_recovery_lng'].forEach(k=>{if(payload[k]==='')payload[k]=null;else payload[k]=Number(payload[k]);});
const r=await fetch('/api/owner/'+encodeURIComponent(token),{method:'PATCH',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});document.getElementById('status-box').textContent=JSON.stringify(await r.json(),null,2);};
const img=document.getElementById('image-form');img.onsubmit=async(e)=>{e.preventDefault();const fd=new FormData(img);const r=await fetch('/api/owner/'+encodeURIComponent(token)+'/image',{method:'POST',body:fd});document.getElementById('status-box').textContent=JSON.stringify(await r.json(),null,2);};}
load();`;

const STYLE_CSS = `body{font-family:system-ui,sans-serif;background:#f4f6f8;margin:0;padding:2rem}.card{max-width:700px;margin:0 auto;background:#fff;padding:1.25rem;border-radius:14px}.hero{max-width:100%;height:auto;border-radius:12px}.actions{display:grid;gap:.6rem;margin:1rem 0}.button{display:block;padding:.7rem 1rem;background:#0f62fe;color:white;text-decoration:none;border-radius:10px}label{display:block;margin:.5rem 0}input,textarea,select{width:100%}`;

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
      const body = await request.json();
      const id = crypto.randomUUID();
      const publicSlug = crypto.randomUUID().slice(0, 8);
      const ownerToken = crypto.randomUUID().replace(/-/g, '');
      const ownerTokenHash = await hashOwnerToken(ownerToken);
      const now = new Date().toISOString();

      await env.DB.prepare(`INSERT INTO nodes (
        id,node_type,status,public_slug,owner_token_hash,profile_name,profile_image_url,public_identifier,public_message,
        phone,email,whatsapp,last_recovery_lat,last_recovery_lng,last_recovery_label,
        show_profile_name,show_profile_image,show_identifier,show_message,show_phone,show_email,show_whatsapp,show_last_recovery_point,
        allow_anonymous_report,created_at,updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
        .bind(
          id,
          body.node_type || 'default',
          body.status || 'active',
          publicSlug,
          ownerTokenHash,
          body.profile_name || '',
          null,
          body.public_identifier || id,
          body.public_message || '',
          body.phone || '',
          body.email || '',
          body.whatsapp || '',
          null,
          null,
          '',
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          now,
          now
        )
        .run();

      return new Response(
        JSON.stringify({
          id,
          publicSlug,
          ownerToken,
          publicUrl: `${url.origin}/n/${publicSlug}`,
          ownerUrl: `${url.origin}/o/${ownerToken}`
        }),
        { headers: { 'content-type': 'application/json; charset=utf-8' } }
      );
    }

    if (request.method === 'GET' && pathname.startsWith('/n/')) {
      const slug = decodeURIComponent(pathname.replace('/n/', ''));
      return textResponse(renderPublicPage(slug), 200, 'text/html; charset=utf-8');
    }

    if (request.method === 'GET' && pathname.startsWith('/o/')) {
      const token = decodeURIComponent(pathname.replace('/o/', ''));
      return textResponse(renderOwnerPage(token), 200, 'text/html; charset=utf-8');
    }

    if (request.method === 'GET' && pathname === '/public.js') return textResponse(PUBLIC_JS, 200, 'application/javascript; charset=utf-8');
    if (request.method === 'GET' && pathname === '/owner.js') return textResponse(OWNER_JS, 200, 'application/javascript; charset=utf-8');
    if (request.method === 'GET' && pathname === '/style.css') return textResponse(STYLE_CSS, 200, 'text/css; charset=utf-8');

    return textResponse('Not found', 404);
  }
};
