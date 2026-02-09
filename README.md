\### What you’ll get

A complete \*\*static\*\* site bundle you can publish to GitHub Pages at `https://mj-ahmad.github.io/qfd/`. It includes:



\- All frontend pages you asked for (donate, cart, checkout, payment, thank-you, invoice, tracing, crowdfunding).

\- A single \*\*style.css\*\* with a professional tech look.

\- A single \*\*script.js\*\* that implements cart, checkout simulation, invoice generation, tracing (client-side), and mobile menu.

\- A small `package.json` script to prepare a `docs/` folder for GitHub Pages.

\- Clear, step‑by‑step deployment instructions for GitHub Pages.



This is a \*\*static-only\*\* solution (no real payment provider keys or server). The checkout flow is simulated so you can test end-to-end on GitHub Pages. When you later add a backend (recommended for real payments), I’ll show exactly where to swap in API calls.



\---



\## 1 — Repo layout (what to create)

Create a repo `qfd` and add these files/folders:



```

qfd/

├─ package.json

├─ README.md

├─ .gitignore

├─ src/

│  ├─ css/style.css

│  ├─ js/script.js

│  └─ pages/

│     ├─ index.html

│     ├─ donate.html

│     ├─ cart.html

│     ├─ checkout.html

│     ├─ payment.html

│     ├─ thankyou.html

│     ├─ invoice.html

│     ├─ tracing.html

│     └─ crowdfunding.html

└─ public/

&#x20;  └─ images/hifz-students.jpg

```



> GitHub Pages will serve from the `docs/` folder. The `prepare:docs` script below copies `src/` into `docs/` for publishing.



\---



\## 2 — `package.json`

Save this at repo root.



```json

{

&#x20; "name": "qfd",

&#x20; "version": "1.0.0",

&#x20; "private": true,

&#x20; "scripts": {

&#x20;   "prepare:docs": "rm -rf docs \&\& mkdir -p docs/css docs/js \&\& cp -r src/pages/\* docs/ \&\& cp -r src/css/\* docs/css/ \&\& cp -r src/js/\* docs/js/ \&\& cp -r public docs/",

&#x20;   "serve:docs": "npx http-server docs -p 8080",

&#x20;   "start": "npm run prepare:docs \&\& npm run serve:docs"

&#x20; }

}

```



\---



\## 3 — `src/css/style.css`

Save as `src/css/style.css`. (Full professional styles used by all pages.)



```css

:root{

&#x20; --bg:#041025; --panel:#071428; --muted:#9aa7b8;

&#x20; --primary:#0ea5a4; --accent:#06b6d4; --fg:#e6eef6;

&#x20; --border: rgba(255,255,255,0.06); --radius:12px; --shadow: 0 12px 40px rgba(2,6,23,0.6);

&#x20; font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;

}

\*{box-sizing:border-box}

html,body{height:100%;margin:0;background:linear-gradient(180deg,#041025 0%, #071428 100%);color:var(--fg);-webkit-font-smoothing:antialiased}

a{color:inherit}

.container{max-width:1100px;margin:0 auto;padding:2rem}

header{position:sticky;top:0;background:linear-gradient(180deg, rgba(7,10,20,0.6), rgba(7,10,20,0.35));backdrop-filter: blur(8px);border-bottom:1px solid var(--border);z-index:60}

.nav{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:1rem}

.brand{display:flex;align-items:center;gap:0.75rem}

.logo{width:48px;height:48px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-weight:800;background:linear-gradient(135deg,var(--primary),var(--accent));color:#042;box-shadow:var(--shadow)}

.brand-title{font-weight:800}

.brand-sub{font-size:0.85rem;color:var(--muted)}

.nav-links{display:flex;gap:0.5rem;align-items:center}

.nav-link{padding:0.5rem 0.9rem;border-radius:10px;color:var(--fg);text-decoration:none;font-weight:700}

.nav-link:hover{background:rgba(255,255,255,0.02);color:var(--primary)}

.header-cart{display:flex;align-items:center;gap:0.6rem;background:linear-gradient(90deg,var(--primary),var(--accent));padding:0.45rem 0.7rem;border-radius:999px;color:#042;font-weight:800;cursor:pointer}

.cart-count{background:#10b981;padding:0.12rem 0.45rem;border-radius:999px;font-weight:800;font-size:0.85rem}

.hero{display:flex;align-items:center;justify-content:center;min-height:44vh;padding:3rem 1rem;border-bottom:1px solid var(--border)}

.kicker{display:inline-block;padding:0.35rem 0.8rem;border-radius:999px;background:rgba(6,182,212,0.06);border:1px solid rgba(6,182,212,0.08);color:var(--accent);font-weight:700;margin-bottom:0.75rem}

h1{font-size:2.25rem;margin:0 0 0.6rem 0}

.lead{color:var(--muted);max-width:760px;margin:0 auto}

.grid{display:grid;gap:1rem}

.grid.cols-3{grid-template-columns:repeat(3,1fr)}

.card{background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));border:1px solid var(--border);padding:1.1rem;border-radius:var(--radius);box-shadow:0 6px 18px rgba(2,6,23,0.45)}

.card h3{margin:0 0 0.5rem 0}

.muted{color:var(--muted)}

.impact{background:rgba(6,182,212,0.06);border:1px solid rgba(6,182,212,0.08);padding:0.6rem;border-radius:8px;margin-bottom:0.75rem;color:var(--fg)}

.price{font-size:1.6rem;font-weight:800;color:var(--primary);margin:0 0 0.6rem 0}

.full-btn{width:100%;display:inline-flex;align-items:center;justify-content:center;gap:0.6rem;padding:0.6rem;border-radius:10px;background:var(--primary);color:#042;border:none;cursor:pointer;font-weight:800}

input\[type="number"], input\[type="text"], input\[type="email"]{width:100%;padding:0.6rem;border-radius:8px;border:1px solid var(--border);background:transparent;color:var(--fg)}

footer{border-top:1px solid var(--border);padding:2rem 1rem;margin-top:2rem;background:linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.005))}

.footer-inner{max-width:1100px;margin:0 auto;display:flex;justify-content:space-between;gap:1rem;align-items:center}

.cart-modal{position:fixed;right:1rem;bottom:4.6rem;width:360px;max-height:70vh;background:linear-gradient(180deg,#071428,#041025);border:1px solid var(--border);border-radius:12px;padding:0.8rem;box-shadow:0 20px 60px rgba(2,6,23,0.6);overflow:auto;z-index:140;display:none}

.cart-modal.open{display:block}

.cart-item{display:flex;justify-content:space-between;align-items:center;padding:0.6rem;border-bottom:1px dashed rgba(255,255,255,0.03)}

.cart-footer{display:flex;justify-content:space-between;align-items:center;padding-top:0.6rem;gap:0.5rem}

.modal-backdrop{position:fixed;inset:0;background:rgba(2,6,23,0.6);display:none;align-items:center;justify-content:center;z-index:160}

.modal-backdrop.open{display:flex}

.modal{width:100%;max-width:720px;background:linear-gradient(180deg,#071428,#041025);border-radius:12px;padding:1.2rem;border:1px solid var(--border);box-shadow:var(--shadow)}

.small{font-size:0.9rem;color:var(--muted)}

@media (max-width:1024px){.nav-links{display:none}}

@media (max-width:640px){.grid.cols-3{grid-template-columns:1fr}}

```



\---



\## 4 — `src/js/script.js`

Save as `src/js/script.js`. This is the \*\*static-only\*\* script: cart stored in `localStorage`, simulated checkout, invoice generation, tracing, mobile menu.



```javascript

// script.js - static donation site (client-side cart + simulated checkout)

(() => {

&#x20; 'use strict';

&#x20; const CART\_KEY = 'qf\_cart\_v2';

&#x20; const $ = (s, r=document) => r.querySelector(s);

&#x20; const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));



&#x20; function loadCart(){ try { return JSON.parse(localStorage.getItem(CART\_KEY) || '\[]'); } catch { return \[]; } }

&#x20; function saveCart(c){ localStorage.setItem(CART\_KEY, JSON.stringify(c)); }

&#x20; function formatCurrency(n){ return '$' + Number(n).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2}); }

&#x20; function toast(msg, ms=2200){

&#x20;   const container = document.getElementById('qf-toast') || (() => { const d=document.createElement('div'); d.id='qf-toast'; d.style.position='fixed'; d.style.top='1rem'; d.style.right='1rem'; d.style.zIndex=9999; document.body.appendChild(d); return d; })();

&#x20;   const el=document.createElement('div'); el.textContent=msg; el.style.background='rgba(255,255,255,0.04)'; el.style.padding='0.6rem 0.9rem'; el.style.borderRadius='8px'; el.style.color='white'; el.style.marginTop='0.5rem'; container.appendChild(el);

&#x20;   setTimeout(()=>{ el.remove(); }, ms);

&#x20; }



&#x20; function escapeHtml(s){ return String(s).replace(/\[\&<>"']/g, m => ({'\&':'\&amp;','<':'\&lt;','>':'\&gt;','"':'\&quot;',"'":'\&#39;'}\[m])); }



&#x20; function renderCart(){

&#x20;   const cart = loadCart();

&#x20;   const itemsEl = document.getElementById('cart-items');

&#x20;   const totalEl = document.getElementById('cart-total');

&#x20;   const headerCount = document.getElementById('header-cart-count');

&#x20;   if(!itemsEl || !totalEl || !headerCount) return;

&#x20;   itemsEl.innerHTML = '';

&#x20;   if(!cart.length){ itemsEl.innerHTML = '<div class="small" style="padding:0.6rem 0">Your cart is empty.</div>'; }

&#x20;   else {

&#x20;     cart.forEach((it, idx) => {

&#x20;       const row = document.createElement('div'); row.className='cart-item';

&#x20;       row.innerHTML = `<div><div style="font-weight:700">${escapeHtml(it.title)}</div><div class="small">${it.custom? 'Custom donation':''}</div></div>

&#x20;                        <div style="text-align:right"><div style="font-weight:800">${formatCurrency(it.price)}</div><div style="margin-top:6px"><button data-idx="${idx}" class="small remove-item" style="background:transparent;border:0;color:var(--muted);cursor:pointer">Remove</button></div></div>`;

&#x20;       itemsEl.appendChild(row);

&#x20;     });

&#x20;   }

&#x20;   const total = cart.reduce((s,i)=>s+Number(i.price||0),0);

&#x20;   totalEl.textContent = formatCurrency(total);

&#x20;   headerCount.textContent = String(cart.length);

&#x20; }



&#x20; function bindAddButtons(){

&#x20;   $$('button.add-to-cart').forEach(btn => {

&#x20;     if(btn.dataset.bound) return; btn.dataset.bound='1';

&#x20;     btn.addEventListener('click', e => {

&#x20;       e.preventDefault();

&#x20;       const title = btn.dataset.title || (btn.closest('.card')?.querySelector('h3')?.textContent?.trim()) || 'Donation';

&#x20;       const price = Number(btn.dataset.price || btn.closest('.card')?.querySelector('.price')?.textContent?.replace(/\[^0-9.]/g,'') || 0);

&#x20;       const cart = loadCart(); cart.push({title, price, addedAt: new Date().toISOString()}); saveCart(cart); renderCart(); toast('Added to cart: ' + title);

&#x20;     });

&#x20;   });

&#x20; }



&#x20; function bindCustom(){

&#x20;   const input = document.getElementById('custom-amount'); const add = document.getElementById('custom-add');

&#x20;   if(!input || !add) return;

&#x20;   input.addEventListener('input', () => {

&#x20;     const v = Number(input.value); if(Number.isFinite(v) \&\& v>=1){ add.disabled=false; add.removeAttribute('aria-disabled'); } else { add.disabled=true; add.setAttribute('aria-disabled','true'); }

&#x20;   });

&#x20;   add.addEventListener('click', e => {

&#x20;     e.preventDefault();

&#x20;     const v = Number(input.value); if(!Number.isFinite(v) || v<1){ toast('Enter a valid amount (min $1)'); return; }

&#x20;     const cart = loadCart(); cart.push({title:'Custom Donation', price: v, custom:true, addedAt: new Date().toISOString()}); saveCart(cart); renderCart(); toast('Custom donation added'); input.value=''; add.disabled=true;

&#x20;   });

&#x20; }



&#x20; function bindCartInteractions(){

&#x20;   const headerCart = document.getElementById('header-cart');

&#x20;   if(headerCart){

&#x20;     headerCart.addEventListener('click', () => {

&#x20;       const modal = document.getElementById('cart-modal');

&#x20;       if(modal) modal.classList.toggle('open');

&#x20;     });

&#x20;   }

&#x20;   const clearBtn = document.getElementById('cart-clear');

&#x20;   if(clearBtn) clearBtn.addEventListener('click', () => { if(!confirm('Clear cart?')) return; saveCart(\[]); renderCart(); toast('Cart cleared'); });

&#x20;   const itemsEl = document.getElementById('cart-items');

&#x20;   if(itemsEl) itemsEl.addEventListener('click', e => {

&#x20;     const btn = e.target.closest('button.remove-item'); if(!btn) return;

&#x20;     const idx = Number(btn.dataset.idx); const cart = loadCart(); if(idx>=0 \&\& idx<cart.length){ cart.splice(idx,1); saveCart(cart); renderCart(); toast('Item removed'); }

&#x20;   });

&#x20; }



&#x20; function bindCheckout(){

&#x20;   const checkoutBtn = document.getElementById('checkout');

&#x20;   if(checkoutBtn) checkoutBtn.addEventListener('click', () => {

&#x20;     const cart = loadCart(); if(!cart.length){ toast('Your cart is empty'); return; }

&#x20;     document.getElementById('modal-backdrop').classList.add('open');

&#x20;   });

&#x20;   const cancel = document.getElementById('cancel-checkout');

&#x20;   if(cancel) cancel.addEventListener('click', () => { document.getElementById('modal-backdrop').classList.remove('open'); });

&#x20;   const backdrop = document.getElementById('modal-backdrop');

&#x20;   if(backdrop) backdrop.addEventListener('click', e => { if(e.target.id==='modal-backdrop') backdrop.classList.remove('open'); });



&#x20;   $$('.pay-method').forEach(pm => pm.addEventListener('click', () => {

&#x20;     $$('.pay-method').forEach(x=>x.classList.remove('active')); pm.classList.add('active');

&#x20;     const method = pm.dataset.method;

&#x20;     const details = document.getElementById('payment-details'); details.innerHTML='';

&#x20;     if(method==='card'){ details.innerHTML = '<div class="form-row single"><label class="small">Card number</label><input id="card-number" type="text" placeholder="4242 4242 4242 4242" /></div>'; }

&#x20;     else if(method==='bank'){ details.innerHTML = '<div class="small">Bank transfer instructions will appear here. Use reference: ' + Math.random().toString(36).slice(2,9).toUpperCase() + '</div>'; }

&#x20;     else { details.innerHTML = '<div class="small">Mobile wallet instructions will appear here.</div>'; }

&#x20;   }));



&#x20;   const form = document.getElementById('checkout-form');

&#x20;   if(form) form.addEventListener('submit', e => {

&#x20;     e.preventDefault();

&#x20;     const name = $('#payer-name')?.value?.trim(); const email = $('#payer-email')?.value?.trim();

&#x20;     if(!name || !email){ toast('Please enter name and email'); return; }

&#x20;     // Simulate processing

&#x20;     $('#checkout-form').style.display='none'; $('#checkout-status').style.display='block'; $('#checkout-status').innerHTML='<div class="small">Processing payment…</div>';

&#x20;     setTimeout(()=> {

&#x20;       // Simulate success: create a local "order" and store last order for invoice demo

&#x20;       const cart = loadCart();

&#x20;       const total = cart.reduce((s,i)=>s+Number(i.price||0),0);

&#x20;       const order = { id: 'QF-'+Math.random().toString(36).slice(2,9).toUpperCase(), items: cart, donor:{name,email}, total, status:'paid', createdAt: new Date().toISOString() };

&#x20;       localStorage.setItem('qf\_last\_order', JSON.stringify(order));

&#x20;       localStorage.removeItem(CART\_KEY);

&#x20;       renderCart();

&#x20;       $('#checkout-status').innerHTML = '<div class="success" style="background:linear-gradient(90deg,#10b981,#06b6d4);color:#042;padding:0.6rem;border-radius:8px;font-weight:800">Payment successful — thank you.</div>';

&#x20;       toast('Payment completed. Receipt saved locally.');

&#x20;       setTimeout(()=> { document.getElementById('modal-backdrop').classList.remove('open'); $('#checkout-status').style.display='none'; $('#checkout-form').style.display=''; window.location.href = './thankyou.html'; }, 1400);

&#x20;     }, 1400);

&#x20;   });

&#x20; }



&#x20; function bindMobile(){

&#x20;   const toggle = document.getElementById('mobile-toggle'); const menu = document.getElementById('mobile-menu');

&#x20;   if(!toggle || !menu) return;

&#x20;   toggle.addEventListener('click', e => { e.preventDefault(); const open = toggle.getAttribute('aria-expanded')==='true'; if(open){ menu.style.display='none'; toggle.setAttribute('aria-expanded','false'); } else { menu.style.display='block'; toggle.setAttribute('aria-expanded','true'); } });

&#x20;   document.addEventListener('click', e => { if(!menu.contains(e.target) \&\& !toggle.contains(e.target)){ menu.style.display='none'; toggle.setAttribute('aria-expanded','false'); } });

&#x20; }



&#x20; // small helper to query by id

&#x20; function $(s){ return document.getElementById(s); }



&#x20; // invoice page render

&#x20; function renderInvoicePage(){

&#x20;   const el = document.getElementById('invoice-content');

&#x20;   if(!el) return;

&#x20;   const order = JSON.parse(localStorage.getItem('qf\_last\_order') || 'null');

&#x20;   if(!order){ el.innerHTML = '<p class="small">No invoice found. Complete a donation to generate an invoice.</p>'; return; }

&#x20;   const itemsHtml = order.items.map(it => `<div style="display:flex;justify-content:space-between;padding:6px 0"><div>${escapeHtml(it.title)}</div><div>${formatCurrency(it.price)}</div></div>`).join('');

&#x20;   el.innerHTML = `<div style="display:flex;justify-content:space-between"><div><strong>Order ID:</strong> ${escapeHtml(order.id)}</div><div><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</div></div>

&#x20;     <div style="margin-top:12px">${itemsHtml}</div>

&#x20;     <div style="display:flex;justify-content:space-between;padding-top:12px;border-top:1px solid rgba(255,255,255,0.04)"><strong>Total</strong><strong>${formatCurrency(order.total)}</strong></div>

&#x20;     <div style="margin-top:12px" class="small">Receipt sent to: ${escapeHtml(order.donor.email)}</div>`;

&#x20; }



&#x20; // tracing page demo

&#x20; function bindTracing(){

&#x20;   const btn = document.getElementById('trace-btn');

&#x20;   if(!btn) return;

&#x20;   btn.addEventListener('click', () => {

&#x20;     const q = document.getElementById('trace-input').value.trim();

&#x20;     if(!q){ alert('Enter order id or email'); return; }

&#x20;     const order = JSON.parse(localStorage.getItem('qf\_last\_order') || 'null');

&#x20;     const out = document.getElementById('trace-result');

&#x20;     if(!order){ out.innerHTML = '<div class="small">No orders found (demo). In production, query your backend with order id or email.</div>'; return; }

&#x20;     if(q === order.id || q.toLowerCase() === order.donor.email.toLowerCase()){

&#x20;       out.innerHTML = `<div><strong>Status:</strong> ${escapeHtml(order.status)}</div><div class="small">Order ID: ${escapeHtml(order.id)}</div>`;

&#x20;     } else {

&#x20;       out.innerHTML = '<div class="small">No matching order found in demo data.</div>';

&#x20;     }

&#x20;   });

&#x20; }



&#x20; // init

&#x20; function init(){

&#x20;   renderCart();

&#x20;   bindAddButtons();

&#x20;   bindCustom();

&#x20;   bindCartInteractions();

&#x20;   bindCheckout();

&#x20;   bindMobile();

&#x20;   renderInvoicePage();

&#x20;   bindTracing();

&#x20; }



&#x20; if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

})();

```



\---



\## 5 — Pages (save under `src/pages/`)



Below are the \*\*ready-to-save\*\* HTML files. Each uses \*\*relative\*\* paths (`./css/style.css` and `./js/script.js`) so they work under `docs/` or GitHub Pages root `/qfd/`.



> Save each file exactly as named.



\### `src/pages/index.html`

```html

<!doctype html>

<html lang="en">

<head>

&#x20; <meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>

&#x20; <title>Quraner Fariwala</title>

&#x20; <link rel="stylesheet" href="./css/style.css"/>

</head>

<body>

&#x20; <header>

&#x20;   <div class="nav">

&#x20;     <a class="brand" href="./index.html">

&#x20;       <div class="logo">ق</div>

&#x20;       <div>

&#x20;         <div class="brand-title">Quraner Fariwala</div>

&#x20;         <div class="brand-sub">Research • Printing • Distribution</div>

&#x20;       </div>

&#x20;     </a>

&#x20;     <nav class="nav-links">

&#x20;       <a class="nav-link" href="./index.html">Home</a>

&#x20;       <a class="nav-link" href="./donate.html">Donate</a>

&#x20;       <a class="nav-link" href="./tracing.html">Contact</a>

&#x20;     </nav>

&#x20;     <div id="header-cart" class="header-cart" role="button" aria-label="Open cart" tabindex="0">

&#x20;       <div style="font-weight:800;color:#042">Cart</div>

&#x20;       <div id="header-cart-count" class="cart-count">0</div>

&#x20;     </div>

&#x20;   </div>

&#x20; </header>



&#x20; <main class="container">

&#x20;   <section class="hero">

&#x20;     <div>

&#x20;       <div class="kicker">Ramadhan-2026 Campaign</div>

&#x20;       <h1>Transform Lives Through <span style="background:linear-gradient(90deg,var(--primary),var(--accent));-webkit-background-clip:text;background-clip:text;color:transparent">Giving</span></h1>

&#x20;       <p class="lead">Join our mission to print and distribute 40,000 memorization-optimized Qurans. Visit the Donate page to contribute.</p>

&#x20;       <div style="margin-top:1rem"><a class="full-btn" href="./donate.html">Donate Now</a></div>

&#x20;     </div>

&#x20;   </section>

&#x20; </main>



&#x20; <footer>

&#x20;   <div class="footer-inner">

&#x20;     <div>

&#x20;       <div style="font-weight:800">Quraner Fariwala Ltd</div>

&#x20;       <div class="small">© 2026 Quraner Fariwala — All rights reserved</div>

&#x20;     </div>

&#x20;     <div class="small">Contact: <a href="mailto:quranerfariwala@gmail.com">quranerfariwala@gmail.com</a></div>

&#x20;   </div>

&#x20; </footer>



&#x20; <div id="qf-toast" aria-hidden="true"></div>

&#x20; <script src="./js/script.js"></script>

</body>

</html>

```



\---



\### `src/pages/donate.html`

(Use the donate page content from earlier; ensure links are `./css/style.css` and `./js/script.js`.)



\_Save the donate page content you already have into `src/pages/donate.html`.\_  

(If you want, I can paste the full donate.html here again — say “paste donate.html”.)



\---



\### `src/pages/cart.html`

```html

<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Cart</title><link rel="stylesheet" href="./css/style.css"/></head><body>

<header>

&#x20; <div class="nav">

&#x20;   <a class="brand" href="./index.html"><div class="logo">ق</div><div><div class="brand-title">Quraner Fariwala</div></div></a>

&#x20;   <nav class="nav-links"><a class="nav-link" href="./index.html">Home</a><a class="nav-link" href="./donate.html">Donate</a><a class="nav-link" href="./tracing.html">Contact</a></nav>

&#x20;   <div id="header-cart" class="header-cart"><div style="font-weight:800;color:#042">Cart</div><div id="header-cart-count" class="cart-count">0</div></div>

&#x20; </div>

</header>



<main class="container">

&#x20; <h2>Your Cart</h2>

&#x20; <div id="cart-items"></div>

&#x20; <div style="margin-top:1rem"><strong>Total:</strong> <span id="cart-total">$0.00</span></div>

&#x20; <div style="margin-top:1rem"><button id="checkout" class="full-btn">Proceed to Checkout</button></div>

</main>



<div id="qf-toast" aria-hidden="true"></div>

<script src="./js/script.js"></script>

</body></html>

```



\---



\### `src/pages/checkout.html`

```html

<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Checkout</title><link rel="stylesheet" href="./css/style.css"/></head><body>

<header>

&#x20; <div class="nav">

&#x20;   <a class="brand" href="./index.html"><div class="logo">ق</div><div><div class="brand-title">Quraner Fariwala</div></div></a>

&#x20;   <nav class="nav-links"><a class="nav-link" href="./index.html">Home</a><a class="nav-link" href="./donate.html">Donate</a></nav>

&#x20;   <div id="header-cart" class="header-cart"><div style="font-weight:800;color:#042">Cart</div><div id="header-cart-count" class="cart-count">0</div></div>

&#x20; </div>

</header>



<main class="container">

&#x20; <h2>Checkout</h2>

&#x20; <form id="checkout-form" novalidate>

&#x20;   <label class="small">Full name</label><input id="payer-name" name="name" type="text" required/>

&#x20;   <label class="small">Email</label><input id="payer-email" name="email" type="email" required/>

&#x20;   <div class="pay-methods" style="margin-top:0.6rem">

&#x20;     <div class="pay-method active" data-method="card">Card</div>

&#x20;     <div class="pay-method" data-method="bank">Bank Transfer</div>

&#x20;     <div class="pay-method" data-method="mobile">Mobile Wallet</div>

&#x20;   </div>

&#x20;   <div id="payment-details" style="margin-top:0.6rem"></div>

&#x20;   <div style="margin-top:1rem"><button type="submit" class="full-btn">Pay Now</button></div>

&#x20; </form>

&#x20; <div id="checkout-status" style="display:none;margin-top:0.6rem"></div>

</main>



<div id="qf-toast" aria-hidden="true"></div>

<script src="./js/script.js"></script>

</body></html>

```



\---



\### `src/pages/payment.html`

```html

<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Processing Payment</title><link rel="stylesheet" href="./css/style.css"/></head><body>

<main class="container" style="text-align:center;padding:6rem 1rem">

&#x20; <h2>Processing Payment</h2>

&#x20; <p class="muted">This is a static demo. In production you will be redirected to a secure payment provider.</p>

&#x20; <div style="margin-top:1.2rem"><a class="full-btn" href="./thankyou.html">Simulate Success</a></div>

</main>

</body></html>

```



\---



\### `src/pages/thankyou.html`

```html

<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Thank you</title><link rel="stylesheet" href="./css/style.css"/></head><body>

<main class="container" style="text-align:center;padding:4rem 1rem">

&#x20; <h2>Thank you for your donation</h2>

&#x20; <p class="muted">A receipt has been saved locally (demo). You can view your invoice or track your donation.</p>

&#x20; <div style="margin-top:1rem"><a class="full-btn" href="./invoice.html">View Invoice</a></div>

&#x20; <div style="margin-top:0.6rem"><a class="full-btn" href="./tracing.html" style="background:transparent;border:1px solid var(--border);color:var(--fg)">Track Donation</a></div>

</main>

</body></html>

```



\---



\### `src/pages/invoice.html`

```html

<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Invoice</title><link rel="stylesheet" href="./css/style.css"/></head><body>

<main class="container" style="background:var(--panel);padding:1.2rem;border-radius:12px">

&#x20; <h2>Invoice</h2>

&#x20; <div id="invoice-content">

&#x20;   <p class="small">This invoice is generated from demo data stored locally. In production, invoices are generated server-side.</p>

&#x20; </div>

&#x20; <div style="margin-top:1rem"><button onclick="window.print()" class="full-btn">Print / Save PDF</button></div>

</main>

<script src="./js/script.js"></script>

</body></html>

```



\---



\### `src/pages/tracing.html`

```html

<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Track Donation</title><link rel="stylesheet" href="./css/style.css"/></head><body>

<main class="container">

&#x20; <h2>Track your donation</h2>

&#x20; <p class="small">Enter your order ID or email to view status (demo uses local data).</p>

&#x20; <input id="trace-input" type="text" placeholder="Order ID or email" />

&#x20; <div style="margin-top:0.6rem"><button id="trace-btn" class="full-btn">Check Status</button></div>

&#x20; <div id="trace-result" style="margin-top:1rem"></div>

</main>

<script src="./js/script.js"></script>

</body></html>

```



\---



\### `src/pages/crowdfunding.html`

```html

<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Crowdfunding</title><link rel="stylesheet" href="./css/style.css"/></head><body>

<main class="container">

&#x20; <h2>Campaigns</h2>

&#x20; <p class="small">Active campaigns and progress (demo).</p>

&#x20; <div class="card" style="margin-top:1rem">

&#x20;   <h3>Ramadhan-2026: 40,000 Qurans</h3>

&#x20;   <div style="height:12px;background:rgba(255,255,255,0.03);border-radius:8px;margin:0.6rem 0;overflow:hidden">

&#x20;     <div style="width:30%;height:100%;background:linear-gradient(90deg,var(--primary),var(--accent))"></div>

&#x20;   </div>

&#x20;   <div class="small">Raised: $12,000 of $40,000</div>

&#x20;   <div style="margin-top:0.6rem"><a class="full-btn" href="./donate.html">Donate to Campaign</a></div>

&#x20; </div>

</main>

</body></html>

```



\---



\## 6 — `public/images/hifz-students.jpg`

Place your hero image at `public/images/hifz-students.jpg`. If you don’t have one, use a placeholder image named the same.



\---



\## 7 — Prepare `docs/` and publish to GitHub Pages

1\. Commit all files to `main` branch.

2\. Run locally to prepare `docs/`:

&#x20;  ```bash

&#x20;  npm install

&#x20;  npm run prepare:docs

&#x20;  ```

&#x20;  This copies `src/pages`, `src/css`, `src/js`, and `public` into `docs/`.

3\. Test locally:

&#x20;  ```bash

&#x20;  npx http-server docs -p 8080

&#x20;  # open http://localhost:8080/donate.html

&#x20;  ```

4\. Push to GitHub.

5\. In GitHub repo \*\*Settings → Pages\*\*:

&#x20;  - Source: \*\*Branch\*\* `main` / folder `/docs`.

&#x20;  - Save. GitHub Pages will publish to `https://mj-ahmad.github.io/qfd/` (allow a minute).



\---



\## 8 — After publishing: test the flow

\- Open `https://mj-ahmad.github.io/qfd/donate.html`.

\- Add items to cart, open cart, click \*\*Checkout\*\*.

\- Fill name/email and \*\*Pay Now\*\* — the flow is simulated and will redirect to `thankyou.html` and store a demo invoice in `localStorage`.

\- Visit `invoice.html` and `tracing.html` to see demo data.



\---



\## 9 — When you’re ready to accept real payments

This static site is ready to be wired to a backend. When you want to accept real payments:



1\. Deploy the backend (Express, serverless) to a secure host (Render, Railway, Vercel, etc.).

2\. Implement `/api/orders` and `/api/payments/create-checkout` (Stripe Checkout recommended).

3\. Update frontend to POST order data to your backend and redirect to the returned Stripe session URL.

4\. Configure Stripe webhooks on the backend to update order status and generate invoices server-side.

5\. Replace the simulated checkout in `script.js` with calls to your backend (I can provide the exact code snippet).



\---



\## 10 — Want me to do the next step for you?

I can now:

\- \*\*A.\*\* Paste the full `donate.html` content (complete) into this chat if you want the exact file now.  

\- \*\*B.\*\* Create the GitHub Actions workflow file that runs `npm run prepare:docs` automatically on push (so `docs/` is always up to date).  

\- \*\*C.\*\* Provide the exact code snippet to swap the simulated checkout for a real Stripe Checkout call (ready to drop into `script.js`) and a minimal Express backend example.



Tell me which of \*\*A\*\*, \*\*B\*\*, or \*\*C\*\* you want next and I’ll produce the exact file or workflow. If you want everything at once, say \*\*“All”\*\* and I’ll paste the remaining donate.html, the Actions workflow, and the backend snippet.

