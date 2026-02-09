// script.js - static donation site (client-side cart + simulated checkout)
(() => {
  'use strict';
  const CART_KEY = 'qf_cart_v2';
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  function loadCart(){ try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch { return []; } }
  function saveCart(c){ localStorage.setItem(CART_KEY, JSON.stringify(c)); }
  function formatCurrency(n){ return '$' + Number(n).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2}); }
  function toast(msg, ms=2200){
    const container = document.getElementById('qf-toast') || (() => { const d=document.createElement('div'); d.id='qf-toast'; d.style.position='fixed'; d.style.top='1rem'; d.style.right='1rem'; d.style.zIndex=9999; document.body.appendChild(d); return d; })();
    const el=document.createElement('div'); el.textContent=msg; el.style.background='rgba(255,255,255,0.04)'; el.style.padding='0.6rem 0.9rem'; el.style.borderRadius='8px'; el.style.color='white'; el.style.marginTop='0.5rem'; container.appendChild(el);
    setTimeout(()=>{ el.remove(); }, ms);
  }

  function escapeHtml(s){ return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }

  function renderCart(){
    const cart = loadCart();
    const itemsEl = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    const headerCount = document.getElementById('header-cart-count');
    if(!itemsEl || !totalEl || !headerCount) return;
    itemsEl.innerHTML = '';
    if(!cart.length){ itemsEl.innerHTML = '<div class="small" style="padding:0.6rem 0">Your cart is empty.</div>'; }
    else {
      cart.forEach((it, idx) => {
        const row = document.createElement('div'); row.className='cart-item';
        row.innerHTML = `<div><div style="font-weight:700">${escapeHtml(it.title)}</div><div class="small">${it.custom? 'Custom donation':''}</div></div>
                         <div style="text-align:right"><div style="font-weight:800">${formatCurrency(it.price)}</div><div style="margin-top:6px"><button data-idx="${idx}" class="small remove-item" style="background:transparent;border:0;color:var(--muted);cursor:pointer">Remove</button></div></div>`;
        itemsEl.appendChild(row);
      });
    }
    const total = cart.reduce((s,i)=>s+Number(i.price||0),0);
    totalEl.textContent = formatCurrency(total);
    headerCount.textContent = String(cart.length);
  }

  function bindAddButtons(){
    $$('button.add-to-cart').forEach(btn => {
      if(btn.dataset.bound) return; btn.dataset.bound='1';
      btn.addEventListener('click', e => {
        e.preventDefault();
        const title = btn.dataset.title || (btn.closest('.card')?.querySelector('h3')?.textContent?.trim()) || 'Donation';
        const price = Number(btn.dataset.price || btn.closest('.card')?.querySelector('.price')?.textContent?.replace(/[^0-9.]/g,'') || 0);
        const cart = loadCart(); cart.push({title, price, addedAt: new Date().toISOString()}); saveCart(cart); renderCart(); toast('Added to cart: ' + title);
      });
    });
  }

  function bindCustom(){
    const input = document.getElementById('custom-amount'); const add = document.getElementById('custom-add');
    if(!input || !add) return;
    input.addEventListener('input', () => {
      const v = Number(input.value); if(Number.isFinite(v) && v>=1){ add.disabled=false; add.removeAttribute('aria-disabled'); } else { add.disabled=true; add.setAttribute('aria-disabled','true'); }
    });
    add.addEventListener('click', e => {
      e.preventDefault();
      const v = Number(input.value); if(!Number.isFinite(v) || v<1){ toast('Enter a valid amount (min $1)'); return; }
      const cart = loadCart(); cart.push({title:'Custom Donation', price: v, custom:true, addedAt: new Date().toISOString()}); saveCart(cart); renderCart(); toast('Custom donation added'); input.value=''; add.disabled=true;
    });
  }

  function bindCartInteractions(){
    const headerCart = document.getElementById('header-cart');
    if(headerCart){
      headerCart.addEventListener('click', () => {
        const modal = document.getElementById('cart-modal');
        if(modal) modal.classList.toggle('open');
      });
    }
    const clearBtn = document.getElementById('cart-clear');
    if(clearBtn) clearBtn.addEventListener('click', () => { if(!confirm('Clear cart?')) return; saveCart([]); renderCart(); toast('Cart cleared'); });
    const itemsEl = document.getElementById('cart-items');
    if(itemsEl) itemsEl.addEventListener('click', e => {
      const btn = e.target.closest('button.remove-item'); if(!btn) return;
      const idx = Number(btn.dataset.idx); const cart = loadCart(); if(idx>=0 && idx<cart.length){ cart.splice(idx,1); saveCart(cart); renderCart(); toast('Item removed'); }
    });
  }

  function bindCheckout(){
    const checkoutBtn = document.getElementById('checkout');
    if(checkoutBtn) checkoutBtn.addEventListener('click', () => {
      const cart = loadCart(); if(!cart.length){ toast('Your cart is empty'); return; }
      document.getElementById('modal-backdrop').classList.add('open');
    });
    const cancel = document.getElementById('cancel-checkout');
    if(cancel) cancel.addEventListener('click', () => { document.getElementById('modal-backdrop').classList.remove('open'); });
    const backdrop = document.getElementById('modal-backdrop');
    if(backdrop) backdrop.addEventListener('click', e => { if(e.target.id==='modal-backdrop') backdrop.classList.remove('open'); });

    $$('.pay-method').forEach(pm => pm.addEventListener('click', () => {
      $$('.pay-method').forEach(x=>x.classList.remove('active')); pm.classList.add('active');
      const method = pm.dataset.method;
      const details = document.getElementById('payment-details'); details.innerHTML='';
      if(method==='card'){ details.innerHTML = '<div class="form-row single"><label class="small">Card number</label><input id="card-number" type="text" placeholder="4242 4242 4242 4242" /></div>'; }
      else if(method==='bank'){ details.innerHTML = '<div class="small">Bank transfer instructions will appear here. Use reference: ' + Math.random().toString(36).slice(2,9).toUpperCase() + '</div>'; }
      else { details.innerHTML = '<div class="small">Mobile wallet instructions will appear here.</div>'; }
    }));

    const form = document.getElementById('checkout-form');
    if(form) form.addEventListener('submit', e => {
      e.preventDefault();
      const name = $('#payer-name')?.value?.trim(); const email = $('#payer-email')?.value?.trim();
      if(!name || !email){ toast('Please enter name and email'); return; }
      // Simulate processing
      $('#checkout-form').style.display='none'; $('#checkout-status').style.display='block'; $('#checkout-status').innerHTML='<div class="small">Processing payment…</div>';
      setTimeout(()=> {
        // Simulate success: create a local "order" and store last order for invoice demo
        const cart = loadCart();
        const total = cart.reduce((s,i)=>s+Number(i.price||0),0);
        const order = { id: 'QF-'+Math.random().toString(36).slice(2,9).toUpperCase(), items: cart, donor:{name,email}, total, status:'paid', createdAt: new Date().toISOString() };
        localStorage.setItem('qf_last_order', JSON.stringify(order));
        localStorage.removeItem(CART_KEY);
        renderCart();
        $('#checkout-status').innerHTML = '<div class="success" style="background:linear-gradient(90deg,#10b981,#06b6d4);color:#042;padding:0.6rem;border-radius:8px;font-weight:800">Payment successful — thank you.</div>';
        toast('Payment completed. Receipt saved locally.');
        setTimeout(()=> { document.getElementById('modal-backdrop').classList.remove('open'); $('#checkout-status').style.display='none'; $('#checkout-form').style.display=''; window.location.href = './thankyou.html'; }, 1400);
      }, 1400);
    });
  }

  function bindMobile(){
    const toggle = document.getElementById('mobile-toggle'); const menu = document.getElementById('mobile-menu');
    if(!toggle || !menu) return;
    toggle.addEventListener('click', e => { e.preventDefault(); const open = toggle.getAttribute('aria-expanded')==='true'; if(open){ menu.style.display='none'; toggle.setAttribute('aria-expanded','false'); } else { menu.style.display='block'; toggle.setAttribute('aria-expanded','true'); } });
    document.addEventListener('click', e => { if(!menu.contains(e.target) && !toggle.contains(e.target)){ menu.style.display='none'; toggle.setAttribute('aria-expanded','false'); } });
  }

  // small helper to query by id
  function $(s){ return document.getElementById(s); }

  // invoice page render
  function renderInvoicePage(){
    const el = document.getElementById('invoice-content');
    if(!el) return;
    const order = JSON.parse(localStorage.getItem('qf_last_order') || 'null');
    if(!order){ el.innerHTML = '<p class="small">No invoice found. Complete a donation to generate an invoice.</p>'; return; }
    const itemsHtml = order.items.map(it => `<div style="display:flex;justify-content:space-between;padding:6px 0"><div>${escapeHtml(it.title)}</div><div>${formatCurrency(it.price)}</div></div>`).join('');
    el.innerHTML = `<div style="display:flex;justify-content:space-between"><div><strong>Order ID:</strong> ${escapeHtml(order.id)}</div><div><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</div></div>
      <div style="margin-top:12px">${itemsHtml}</div>
      <div style="display:flex;justify-content:space-between;padding-top:12px;border-top:1px solid rgba(255,255,255,0.04)"><strong>Total</strong><strong>${formatCurrency(order.total)}</strong></div>
      <div style="margin-top:12px" class="small">Receipt sent to: ${escapeHtml(order.donor.email)}</div>`;
  }

  // tracing page demo
  function bindTracing(){
    const btn = document.getElementById('trace-btn');
    if(!btn) return;
    btn.addEventListener('click', () => {
      const q = document.getElementById('trace-input').value.trim();
      if(!q){ alert('Enter order id or email'); return; }
      const order = JSON.parse(localStorage.getItem('qf_last_order') || 'null');
      const out = document.getElementById('trace-result');
      if(!order){ out.innerHTML = '<div class="small">No orders found (demo). In production, query your backend with order id or email.</div>'; return; }
      if(q === order.id || q.toLowerCase() === order.donor.email.toLowerCase()){
        out.innerHTML = `<div><strong>Status:</strong> ${escapeHtml(order.status)}</div><div class="small">Order ID: ${escapeHtml(order.id)}</div>`;
      } else {
        out.innerHTML = '<div class="small">No matching order found in demo data.</div>';
      }
    });
  }

  // init
  function init(){
    renderCart();
    bindAddButtons();
    bindCustom();
    bindCartInteractions();
    bindCheckout();
    bindMobile();
    renderInvoicePage();
    bindTracing();
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
