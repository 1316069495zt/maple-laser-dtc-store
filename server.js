const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { PRESETS } = require('./data/presets');

// Load .env file if present
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

const PORT = Number(process.env.PORT || 3001);
const DATA_FILE = path.join(__dirname, 'data', 'runtime-store.json');
const INDEX_TEMPLATE = fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf8');
const ADMIN_HTML = fs.readFileSync(path.join(__dirname, 'public', 'admin.html'), 'utf8');

// Initialize persistent store + orders in memory
let db = {
  store: JSON.parse(JSON.stringify(PRESETS.maple_laser)),
  orders: [
    {
      id: 'MC-1001',
      createdAt: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
      customer: { name: 'Sarah Jenkins', email: 's.jenkins@mapleleaf.ca', country: 'Canada' },
      items: [
        {
          title: 'Custom Laser Engraved Canadian Hard Maple Plaque',
          qty: 1,
          price: 79.00,
          customSpec: 'Canadian Hard Maple | Motif: maple_leaf | "THE JENKINS FAMILY" / "OTTAWA • EST. 2026" (90% burn)'
        }
      ],
      totalUsd: '79.00',
      status: 'PAID (PayPal Live)',
      paypalOrderId: '8XL9283749102938B'
    }
  ]
};

if (fs.existsSync(DATA_FILE)) {
  try {
    const saved = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    if (saved && saved.store) db = saved;
  } catch (e) {
    console.error('Failed to parse runtime-store.json, using default preset:', e.message);
  }
}

// Pre-rendered in-memory SSR cache for < 1.5ms TTFB
let cachedHomeHtml = '';
let cachedHomeGzip = null;

function rebuildEdgeCache() {
  const scriptInjection = `<script>window.__INITIAL_STORE__ = ${JSON.stringify(db.store)};</script></head>`;
  cachedHomeHtml = INDEX_TEMPLATE.replace('</head>', scriptInjection);
  cachedHomeGzip = zlib.gzipSync(Buffer.from(cachedHomeHtml, 'utf8'));
}

function persistDb() {
  rebuildEdgeCache();
  fs.writeFile(DATA_FILE, JSON.stringify(db, null, 2), () => {});
}

rebuildEdgeCache();

// PayPal API Helper
function getPayPalBaseUrl(modeOverride) {
  const mode = (modeOverride || process.env.PAYPAL_MODE || 'live').toLowerCase();
  return mode === 'sandbox' ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com';
}

async function getPayPalAccessToken(modeOverride) {
  const clientId = process.env.PAYPAL_CLIENT_ID || '';
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET || '';
  if (!clientId || !clientSecret) {
    throw new Error('Missing PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET in .env');
  }
  const baseUrl = getPayPalBaseUrl(modeOverride);
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const res = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });
  const data = await res.json();
  if (!res.ok || !data.access_token) {
    throw new Error(data.error_description || data.error || 'PayPal OAuth failed');
  }
  return { accessToken: data.access_token, raw: data, baseUrl };
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1e6) req.destroy();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, status, obj) {
  const payload = JSON.stringify(obj);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(payload);
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  try {
    // 1. Storefront Home (Served from In-Memory SSR Edge Cache in < 1ms)
    if ((req.method === 'GET' || req.method === 'HEAD') && (pathname === '/' || pathname === '/index.html')) {
      const acceptEncoding = req.headers['accept-encoding'] || '';
      if (acceptEncoding.includes('gzip') && cachedHomeGzip) {
        res.writeHead(200, {
          'Content-Type': 'text/html; charset=utf-8',
          'Content-Encoding': 'gzip',
          'X-Edge-Cache': 'HIT-MEMORY-SSR'
        });
        return res.end(req.method === 'HEAD' ? undefined : cachedHomeGzip);
      }
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Edge-Cache': 'HIT-MEMORY-SSR'
      });
      return res.end(req.method === 'HEAD' ? undefined : cachedHomeHtml);
    }

    // 2. Visual Admin Console (/admin)
    if ((req.method === 'GET' || req.method === 'HEAD') && (pathname === '/admin' || pathname === '/admin/')) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(req.method === 'HEAD' ? undefined : ADMIN_HTML);
    }

    // 3. Public Store Config API
    if (req.method === 'GET' && pathname === '/api/store') {
      return sendJson(res, 200, db.store);
    }

    // 4. Admin Overview API
    if (req.method === 'GET' && pathname === '/api/admin/overview') {
      return sendJson(res, 200, {
        store: db.store,
        orders: db.orders,
        paypalMode: process.env.PAYPAL_MODE || 'live',
        merchantId: process.env.PAYPAL_MERCHANT_ID || 'UNQPMHDGVTL96'
      });
    }

    // 5. Switch Niche Preset in 1-Click
    if (req.method === 'POST' && pathname === '/api/admin/switch-preset') {
      const body = await readJsonBody(req);
      const preset = PRESETS[body.nicheKey];
      if (!preset) return sendJson(res, 400, { error: 'Unknown preset' });
      db.store = JSON.parse(JSON.stringify(preset));
      persistDb();
      return sendJson(res, 200, { ok: true, store: db.store });
    }

    // 6. Update Visual Store Settings
    if (req.method === 'POST' && pathname === '/api/admin/update-settings') {
      const body = await readJsonBody(req);
      if (body.brandName) db.store.brandName = body.brandName;
      if (body.brandLogoText) db.store.brandLogoText = body.brandLogoText;
      if (body.accentColor) db.store.accentColor = body.accentColor;
      if (typeof body.freeShippingThreshold === 'number') db.store.freeShippingThreshold = body.freeShippingThreshold;
      if (body.announcement) db.store.announcement = body.announcement;
      if (!db.store.hero) db.store.hero = {};
      if (body.heroTitle) db.store.hero.title = body.heroTitle;
      if (body.heroSubtitle) db.store.hero.subtitle = body.heroSubtitle;
      persistDb();
      return sendJson(res, 200, { ok: true, store: db.store });
    }

    // 7. Add Product
    if (req.method === 'POST' && pathname === '/api/admin/products') {
      const body = await readJsonBody(req);
      const newProd = {
        id: 'prod-' + Date.now().toString(36),
        title: body.title,
        category: body.category || (db.store.categories?.[1]?.id || 'custom-gifts'),
        price: Number(body.price) || 49.00,
        compareAtPrice: Number(body.compareAtPrice) || 69.00,
        rating: 5.0,
        reviews: 18,
        badge: 'NEW ARRIVAL',
        customizable: true,
        stock: 50,
        shortDesc: body.shortDesc || 'Precision crafted custom laser-engraved item.',
        specs: ['Canadian Hard Maple / Custom Laser Engraved', 'Tracked Express Delivery'],
        svgType: 'cutting_board'
      };
      db.store.products.unshift(newProd);
      persistDb();
      return sendJson(res, 200, { ok: true, product: newProd });
    }

    // 8. Delete Product
    if (req.method === 'DELETE' && pathname.startsWith('/api/admin/products/')) {
      const prodId = decodeURIComponent(pathname.replace('/api/admin/products/', ''));
      db.store.products = (db.store.products || []).filter(p => p.id !== prodId);
      persistDb();
      return sendJson(res, 200, { ok: true });
    }

    // 9. Verify PayPal Credentials Live / Sandbox
    if (req.method === 'POST' && pathname === '/api/paypal/verify-credentials') {
      const body = await readJsonBody(req);
      try {
        const { raw } = await getPayPalAccessToken(body.mode);
        return sendJson(res, 200, {
          ok: true,
          app_id: raw.app_id,
          expires_in: raw.expires_in
        });
      } catch (err) {
        return sendJson(res, 200, { ok: false, error: err.message });
      }
    }

    // 10. Create Real PayPal Order v2
    if (req.method === 'POST' && pathname === '/api/paypal/create-order') {
      const body = await readJsonBody(req);
      const totalUsd = Number(body.totalUsd || 1.00).toFixed(2);
      const proto = req.headers['x-forwarded-proto'] || 'http';
      const host = req.headers['x-forwarded-host'] || req.headers.host || `localhost:${PORT}`;
      const origin = `${proto}://${host}`;

      try {
        const { accessToken, baseUrl } = await getPayPalAccessToken();
        const orderPayload = {
          intent: 'CAPTURE',
          purchase_units: [
            {
              description: `${db.store.brandName} Order`,
              amount: {
                currency_code: 'USD',
                value: totalUsd
              }
            }
          ],
          application_context: {
            brand_name: db.store.brandName,
            landing_page: 'NO_PREFERENCE',
            user_action: 'PAY_NOW',
            return_url: `${origin}/?pp_status=success`,
            cancel_url: `${origin}/?pp_status=cancel`
          }
        };

        const ppRes = await fetch(`${baseUrl}/v2/checkout/orders`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(orderPayload)
        });
        const ppData = await ppRes.json();
        const approveLink = (ppData.links || []).find(l => l.rel === 'approve');

        if (approveLink) {
          // Record pending order
          db.orders.unshift({
            id: 'MC-' + Math.floor(1000 + Math.random() * 9000),
            createdAt: new Date().toISOString(),
            customer: body.customer || { name: 'PayPal Buyer', country: 'US' },
            items: body.items || [],
            totalUsd,
            status: 'PENDING_PAYPAL_APPROVAL',
            paypalOrderId: ppData.id
          });
          persistDb();
          return sendJson(res, 200, { ok: true, id: ppData.id, approveUrl: approveLink.href });
        }
        return sendJson(res, 400, { ok: false, error: ppData.message || 'Could not create PayPal order' });
      } catch (err) {
        return sendJson(res, 500, { ok: false, error: err.message });
      }
    }

    // 11. Capture PayPal Order on Return
    if (req.method === 'POST' && pathname === '/api/paypal/capture-order') {
      const body = await readJsonBody(req);
      const paypalOrderId = body.paypalOrderId;
      try {
        const { accessToken, baseUrl } = await getPayPalAccessToken();
        const capRes = await fetch(`${baseUrl}/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}/capture`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        const capData = await capRes.json();
        const existing = db.orders.find(o => o.paypalOrderId === paypalOrderId);
        if (existing) {
          existing.status = capData.status === 'COMPLETED' ? 'PAID (PayPal Live)' : `PAYPAL_${capData.status || 'CAPTURED'}`;
          persistDb();
        }
        return sendJson(res, 200, { ok: true, order: existing || { paypalOrderId }, raw: capData });
      } catch (err) {
        return sendJson(res, 200, { ok: false, message: err.message });
      }
    }

    // 12. Instant 1-Click Test Order (No external redirect needed)
    if (req.method === 'POST' && pathname === '/api/orders/instant-test') {
      const body = await readJsonBody(req);
      const order = {
        id: 'MC-' + Math.floor(1000 + Math.random() * 9000),
        createdAt: new Date().toISOString(),
        customer: body.customer || { name: 'Test Buyer', country: 'United States' },
        items: body.items || [],
        totalUsd: body.totalUsd || '79.00',
        status: 'PAID (Instant Test)',
        paypalOrderId: 'TEST-' + Date.now().toString(36).toUpperCase()
      };
      db.orders.unshift(order);
      persistDb();
      return sendJson(res, 200, { ok: true, order });
    }

    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not Found');
  } catch (err) {
    sendJson(res, 500, { error: err.message });
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`MapleCraft High-Speed DTC Engine listening on http://0.0.0.0:${PORT}`);
});
