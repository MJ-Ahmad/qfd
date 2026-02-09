// src/js/script.js
// Robust client-side cart + simulated checkout for static GitHub Pages site
// - Stores cart in localStorage under key 'qf_cart_v2'
// - Defensive checks so missing DOM elements won't break execution
// - Helpful console logs for debugging in DevTools
// - Simulated checkout that stores a demo order in localStorage for invoice/tracing pages

(() => {
  'use strict';

  /* ---------- Configuration ---------- */
  const CART_KEY = 'qf_cart_v2';
  const LAST_ORDER_KEY = 'qf_last_order';
  const DEBUG = true; // set false to reduce console noise

  /* ---------- Small helpers ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const id = (name) => document.getElementById(name);

  function log(...args) { if (DEBUG) console.log('[qf]', ...args); }
  function warn(...args) { if (DEBUG) console.warn('[qf]', ...args); }

  function safeJSONParse(v, fallback = null) {
    try { return JSON.parse(v); } catch { return fallback; }
  }

  function loadCart() {
    try {
      return safeJSONParse(localStorage.getItem(CART_KEY), []) || [];
    } catch (e) {
      warn('loadCart error', e);
      return [];
    }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (e) {
      warn('saveCart error', e);
    }
  }

  function formatCurrency(n) {
    const num = Number(n || 0);
    if (!Number.isFinite(num)) return '$0.00';
    return '$' + num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }

  /* ---------- Toast (simple) ---------- */
  function showToast(msg, ms = 2200) {
    try {
      let container = id('qf-toast');
      if (!container) {
        container = document.createElement('div');
        container.id = 'qf-toast';
        container.style.position = 'fixed';
        container.style.top = '1rem';
        container.style.right = '1rem';
        container.style.zIndex = '9999';
        document.body.appendChild(container);
      }
      const el = document.createElement('div');
      el.textContent = msg;
      el.style.background = 'rgba(255,255,255,0.04)';
      el.style.color = 'var(--fg, #fff)';
      el.style.padding = '0.6rem 0.9rem';
      el.style.borderRadius = '8px';
      el.style.boxShadow = '0 8px 24px rgba(2,6,23,0.6)';
      el.style.marginTop = '0.5rem';
      el.style.transition = 'opacity 180ms ease, transform 180ms ease';
      el.style.opacity = '0';
      el.style.transform = 'translateY(-6px)';
      container.appendChild(el);
      requestAnimationFrame(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; });
      setTimeout(() => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(-6px)';
        setTimeout(() => el.remove(), 220);
      }, ms);
    } catch (e) {
      // silent
      log('toast error', e);
    }
  }

  /* ---------- Render cart UI ---------- */
  function renderCart() {
    try {
      const cart = loadCart();
      const cartItemsEl = id('cart-items');
      const cartTotalEl = id('cart-total');
      const headerCountEl = id('header-cart-count');

      if (!cartItemsEl || !cartTotalEl || !headerCountEl) {
        warn('renderCart: missing DOM elements', { cartItemsEl: !!cartItemsEl, cartTotalEl: !!cartTotalEl, headerCountEl: !!headerCountEl });
        return;
      }

      cartItemsEl.innerHTML = '';
      if (!cart.length) {
        cartItemsEl.innerHTML = '<div class="small" style="padding:0.6rem 0">Your cart is empty.</div>';
      } else {
        cart.forEach((it, idx) => {
          const row = document.createElement('div');
          row.className = 'cart-item';
          const left = document.createElement('div');
          left.innerHTML = `<div style="font-weight:700">${escapeHtml(it.title)}</div><div class="small">${it.custom ? 'Custom donation' : ''}</div>`;
          const right = document.createElement('div');
          right.style.textAlign = 'right';
          right.innerHTML = `<div style="font-weight:800">${formatCurrency(it.price)}</div>
                             <div style="margin-top:6px"><button data-idx="${idx}" class="small remove-item" style="background:transparent;border:0;color:var(--muted);cursor:pointer">Remove</button></div>`;
          row.appendChild(left);
          row.appendChild(right);
          cartItemsEl.appendChild(row);
        });
      }

      const total = cart.reduce((s, i) => s + Number(i.price || 0), 0);
      cartTotalEl.textContent = formatCurrency(total);
      headerCountEl.textContent = String(cart.length);
      log('renderCart done', { count: cart.length, total });
    } catch (e) {
      warn('renderCart error', e);
    }
  }

  /* ---------- Add to cart binding ---------- */
  function bindAddButtons() {
    try {
      const buttons = $$('.add-to-cart');
      if (!buttons.length) {
        warn('bindAddButtons: no .add-to-cart buttons found');
      }
      buttons.forEach(btn => {
        if (btn.dataset.bound === 'true') return;
        btn.dataset.bound = 'true';
        btn.addEventListener('click', (ev) => {
          ev.preventDefault();
          try {
            const title = btn.getAttribute('data-title') || (btn.closest('.card')?.querySelector('h3')?.textContent?.trim()) || 'Donation';
            const priceRaw = btn.getAttribute('data-price') || btn.closest('.card')?.querySelector('.price')?.textContent || '0';
            const price = Number(String(priceRaw).replace(/[^0-9.]/g, '')) || 0;
            const cart = loadCart();
            cart.push({ title: title.trim(), price: Number(price), addedAt: new Date().toISOString() });
            saveCart(cart);
            renderCart();
            showToast(`Added to cart: ${title}`);
            log('item added', { title, price, cartLength: cart.length });
          } catch (err) {
            warn('add-to-cart handler error', err);
            showToast('Could not add item to cart');
          }
        });
      });
    } catch (e) {
      warn('bindAddButtons error', e);
    }
  }

  /* ---------- Custom donation ---------- */
  function bindCustomDonation() {
    try {
      const input = id('custom-amount');
      const addBtn = id('custom-add');
      if (!input || !addBtn) {
        log('bindCustomDonation: elements not present (skipping)');
        return;
      }
      input.addEventListener('input', () => {
        const v = Number(input.value);
        if (Number.isFinite(v) && v >= 1) {
          addBtn.disabled = false;
          addBtn.removeAttribute('aria-disabled');
        } else {
          addBtn.disabled = true;
          addBtn.setAttribute('aria-disabled', 'true');
        }
      });
      addBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const v = Number(input.value);
        if (!Number.isFinite(v) || v < 1) {
          showToast('Enter a valid amount (minimum $1)');
          return;
        }
        const cart = loadCart();
        cart.push({ title: 'Custom Donation', price: Number(v), custom: true, addedAt: new Date().toISOString() });
        saveCart(cart);
        renderCart();
        showToast('Custom donation added');
        input.value = '';
        addBtn.disabled = true;
      });
    } catch (e) {
      warn('bindCustomDonation error', e);
    }
  }

  /* ---------- Cart interactions (remove, clear, open) ---------- */
  function bindCartInteractions() {
    try {
      const headerCart = id('header-cart');
      const cartModal = id('cart-modal');
      const cartClear = id('cart-clear');
      const cartItems = id('cart-items');

      if (headerCart && cartModal) {
        headerCart.addEventListener('click', () => {
          cartModal.classList.toggle('open');
          cartModal.setAttribute('aria-hidden', cartModal.classList.contains('open') ? 'false' : 'true');
        });
      }

      if (cartClear) {
        cartClear.addEventListener('click', () => {
          if (!confirm('Clear all items from cart?')) return;
          saveCart([]);
          renderCart();
          showToast('Cart cleared');
        });
      }

      if (cartItems) {
        cartItems.addEventListener('click', (e) => {
          const btn = e.target.closest('button.remove-item');
          if (!btn) return;
          const idx = Number(btn.getAttribute('data-idx'));
          const cart = loadCart();
          if (Number.isInteger(idx) && idx >= 0 && idx < cart.length) {
            cart.splice(idx, 1);
            saveCart(cart);
            renderCart();
            showToast('Item removed');
          } else {
            warn('remove-item: invalid index', idx);
          }
        });
      }
    } catch (e) {
      warn('bindCartInteractions error', e);
    }
  }

  /* ---------- Checkout (simulated) ---------- */
  function bindCheckout() {
    try {
      const checkoutBtn = id('checkout');
      const modalBackdrop = id('modal-backdrop');
      const checkoutForm = id('checkout-form');
      const checkoutStatus = id('checkout-status');
      const cancelBtn = id('cancel-checkout');
      const payNowBtn = id('pay-now');

      if (checkoutBtn && modalBackdrop) {
        checkoutBtn.addEventListener('click', () => {
          const cart = loadCart();
          if (!cart.length) {
            showToast('Your cart is empty');
            return;
          }
          modalBackdrop.classList.add('open');
          modalBackdrop.setAttribute('aria-hidden', 'false');
        });
      }

      if (cancelBtn && modalBackdrop) {
        cancelBtn.addEventListener('click', () => {
          modalBackdrop.classList.remove('open');
          modalBackdrop.setAttribute('aria-hidden', 'true');
        });
      }

      if (modalBackdrop) {
        modalBackdrop.addEventListener('click', (e) => {
          if (e.target === modalBackdrop) {
            modalBackdrop.classList.remove('open');
            modalBackdrop.setAttribute('aria-hidden', 'true');
          }
        });
      }

      // Payment method selection
      const payMethods = $$('.pay-method');
      if (payMethods && payMethods.length) {
        payMethods.forEach(pm => {
          pm.addEventListener('click', () => {
            payMethods.forEach(x => x.classList.remove('active'));
            pm.classList.add('active');
            const method = pm.dataset.method;
            const paymentDetails = id('payment-details');
            if (!paymentDetails) return;
            if (method === 'card') {
              paymentDetails.innerHTML = '<div class="form-row single"><label class="small" for="card-number">Card number</label><input id="card-number" name="card" type="text" inputmode="numeric" placeholder="4242 4242 4242 4242" /></div>';
            } else if (method === 'bank') {
              paymentDetails.innerHTML = `<div class="form-row single"><label class="small">Bank transfer instructions</label><div class="small">Use reference: <strong>${Math.random().toString(36).slice(2,9).toUpperCase()}</strong></div></div>`;
            } else {
              paymentDetails.innerHTML = '<div class="form-row single"><label class="small">Mobile wallet</label><div class="small">Enter mobile number at payment step</div></div>';
            }
          });
        });
      }

      if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
          e.preventDefault();
          try {
            const nameEl = id('payer-name');
            const emailEl = id('payer-email');
            const name = nameEl ? nameEl.value.trim() : '';
            const email = emailEl ? emailEl.value.trim() : '';
            if (!name || !email) {
              showToast('Please provide name and email');
              return;
            }

            // Simulate processing
            if (checkoutForm) checkoutForm.style.display = 'none';
            if (checkoutStatus) {
              checkoutStatus.style.display = '';
              checkoutStatus.innerHTML = '<div class="small">Processing payment…</div>';
            }

            setTimeout(() => {
              // Create demo order and save locally for invoice/tracing pages
              const cart = loadCart();
              const total = cart.reduce((s, i) => s + Number(i.price || 0), 0);
              const order = {
                id: 'QF-' + Math.random().toString(36).slice(2, 9).toUpperCase(),
                items: cart,
                donor: { name, email },
                total: Number(total),
                status: 'paid',
                createdAt: new Date().toISOString()
              };
              try { localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order)); } catch (err) { warn('saving last order failed', err); }

              // Clear cart
              saveCart([]);
              renderCart();

              if (checkoutStatus) checkoutStatus.innerHTML = '<div class="success" style="background:linear-gradient(90deg,#10b981,#06b6d4);color:#042;padding:0.6rem;border-radius:8px;font-weight:800">Payment successful — thank you.</div>';
              showToast('Payment completed. Receipt saved locally.');

              setTimeout(() => {
                if (modalBackdrop) {
                  modalBackdrop.classList.remove('open');
                  modalBackdrop.setAttribute('aria-hidden', 'true');
                }
                if (checkoutStatus) checkoutStatus.style.display = 'none';
                if (checkoutForm) checkoutForm.style.display = '';
                // Redirect to thank you page if present
                if (location.pathname.endsWith('/donate.html') || location.pathname.endsWith('/')) {
                  location.href = './thankyou.html';
                }
              }, 1200);
            }, 1200);
          } catch (err) {
            warn('checkout submit error', err);
            showToast('Payment failed (demo). Try again.');
            if (checkoutForm) checkoutForm.style.display = '';
            if (checkoutStatus) checkoutStatus.style.display = 'none';
          }
        });
      }
    } catch (e) {
      warn('bindCheckout error', e);
    }
  }

  /* ---------- Mobile menu toggle ---------- */
  function bindMobileMenu() {
    try {
      const toggle = id('mobile-toggle');
      const menu = id('mobile-menu');
      if (!toggle || !menu) {
        log('bindMobileMenu: mobile elements not present (skipping)');
        return;
      }
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const open = toggle.getAttribute('aria-expanded') === 'true';
        if (open) {
          menu.style.display = 'none';
          toggle.setAttribute('aria-expanded', 'false');
        } else {
          menu.style.display = 'block';
          toggle.setAttribute('aria-expanded', 'true');
        }
      });
      document.addEventListener('click', (ev) => {
        if (!menu.contains(ev.target) && !toggle.contains(ev.target)) {
          menu.style.display = 'none';
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    } catch (e) {
      warn('bindMobileMenu error', e);
    }
  }

  /* ---------- Invoice rendering (invoice.html) ---------- */
  function renderInvoicePage() {
    try {
      const el = id('invoice-content');
      if (!el) return;
      const order = safeJSONParse(localStorage.getItem(LAST_ORDER_KEY), null);
      if (!order) {
        el.innerHTML = '<p class="small">No invoice found. Complete a donation to generate an invoice.</p>';
        return;
      }
      const itemsHtml = (order.items || []).map(it => `<div style="display:flex;justify-content:space-between;padding:6px 0"><div>${escapeHtml(it.title)}</div><div>${formatCurrency(it.price)}</div></div>`).join('');
      el.innerHTML = `
        <div style="display:flex;justify-content:space-between">
          <div><strong>Order ID:</strong> ${escapeHtml(order.id)}</div>
          <div><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</div>
        </div>
        <div style="margin-top:12px">${itemsHtml}</div>
        <div style="display:flex;justify-content:space-between;padding-top:12px;border-top:1px solid rgba(255,255,255,0.04)"><strong>Total</strong><strong>${formatCurrency(order.total)}</strong></div>
        <div style="margin-top:12px" class="small">Receipt saved for: ${escapeHtml(order.donor?.email || '')}</div>
      `;
    } catch (e) {
      warn('renderInvoicePage error', e);
    }
  }

  /* ---------- Tracing (tracing.html) ---------- */
  function bindTracing() {
    try {
      const btn = id('trace-btn');
      if (!btn) return;
      btn.addEventListener('click', () => {
        const q = (id('trace-input')?.value || '').trim();
        const out = id('trace-result');
        if (!out) return;
        if (!q) { out.innerHTML = '<div class="small">Enter order id or email</div>'; return; }
        const order = safeJSONParse(localStorage.getItem(LAST_ORDER_KEY), null);
        if (!order) {
          out.innerHTML = '<div class="small">No orders found (demo). In production, query your backend.</div>';
          return;
        }
        if (q === order.id || q.toLowerCase() === (order.donor?.email || '').toLowerCase()) {
          out.innerHTML = `<div><strong>Status:</strong> ${escapeHtml(order.status)}</div><div class="small">Order ID: ${escapeHtml(order.id)}</div>`;
        } else {
          out.innerHTML = '<div class="small">No matching order found in demo data.</div>';
        }
      });
    } catch (e) {
      warn('bindTracing error', e);
    }
  }

  /* ---------- Diagnostic helper (run in console) ---------- */
  function diagnosticLog() {
    try {
      log('Diagnostic: DOM elements presence', {
        addToCartButtons: $$('.add-to-cart').length,
        headerCart: !!id('header-cart'),
        headerCartCount: !!id('header-cart-count'),
        cartModal: !!id('cart-modal'),
        cartItems: !!id('cart-items'),
        cartTotal: !!id('cart-total'),
        checkout: !!id('checkout'),
        customAmount: !!id('custom-amount'),
        customAdd: !!id('custom-add'),
        checkoutForm: !!id('checkout-form')
      });
    } catch (e) {
      warn('diagnosticLog error', e);
    }
  }

  /* ---------- Init ---------- */
  function init() {
    try {
      log('Initializing qf script');
      bindAddButtons();
      bindCustomDonation();
      bindCartInteractions();
      bindCheckout();
      bindMobileMenu();
      renderCart();
      renderInvoicePage();
      bindTracing();
      diagnosticLog();
    } catch (e) {
      warn('init error', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
