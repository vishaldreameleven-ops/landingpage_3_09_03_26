/**
 * Meta Conversions API (CAPI) — Cloudflare Pages Function
 *
 * Required environment variables (set in Cloudflare Pages dashboard):
 *   META_PIXEL_ID      — your 15-16 digit Pixel ID
 *   META_ACCESS_TOKEN  — your Meta System User access token
 */

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  const PIXEL_ID     = env.META_PIXEL_ID;
  const ACCESS_TOKEN = env.META_ACCESS_TOKEN;

  if (!PIXEL_ID || !ACCESS_TOKEN) {
    return new Response('Server config error', { status: 500 });
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return new Response('Invalid JSON', { status: 400 });
  }

  const { eventName, eventID, fbp, fbc, sourceUrl, userAgent } = body;

  if (!eventName || !eventID) {
    return new Response('Missing eventName or eventID', { status: 400 });
  }

  const rawIp = request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip') || '';
  const clientIp = rawIp.split(',')[0].trim() || undefined;

  const capiPayload = {
    data: [
      {
        event_name:       eventName,
        event_time:       Math.floor(Date.now() / 1000),
        event_id:         eventID,
        event_source_url: sourceUrl || '',
        action_source:    'website',
        ...(eventName === 'Subscribe' ? {
          custom_data: { currency: 'INR', value: 0 }
        } : {}),
        user_data: {
          client_ip_address: clientIp,
          client_user_agent: userAgent || request.headers.get('user-agent') || '',
          fbp: fbp  || undefined,
          fbc: fbc  || undefined
        }
      }
    ]
  };

  const apiUrl = `https://graph.facebook.com/v20.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`;

  try {
    const response = await fetch(apiUrl, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(capiPayload)
    });

    const result = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify({ error: result }), {
        status: 502,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: true, events_received: result.events_received }), {
      status: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }
    });
  }
}
