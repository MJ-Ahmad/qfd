// script.js
// Shared cart logic for donate.html and cart.html
// - localStorage key: 'qf_cart_v2'
// - Exposes window.qfCart for debugging

(function () {
  'use strict';

  const CART_KEY = 'qf_cart_v2';

  // Helpers
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from((root || document).querySelectorAll(sel));
  const id = (n) => document.getElementById(n);

  function safeParse(v, fallback = []) {
    try { return JSON.parse(v); } catch { return fallback; }
  }

  function loadCart() {
    return safeParse(localStorage.getItem(CART_KEY), []);
  }

  function saveCart(cart) {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) { console.warn('saveCart failed', e); }
    renderHeaderCount();
  }

  function formatCurrency(n) {
    const num = Number(n || 0);
    if (!Number.isFinite(num)) return '$0.00';
    return '$' + num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }

  // Core actions
  function addToCart(item) {
    const cart = loadCart();
    cart.push({
      id: 'i_' + Date.now().toString(36) + Math.random().toString(36).slice(2,6),
      title: item.title || 'Donation',
      price: Number(item.price || 0),
      note: item.note || '',
      addedAt: new Date().toISOString()
    });
    saveCart(cart);
    showToast(`Added to cart: ${item.title}`);
  }

  function removeFromCart(index) {
    const cart = loadCart();
    if (index >= 0 && index < cart.length) {
      const removed = cart.splice(index, 1);
      saveCart(cart);
      showToast(`Removed: ${removed[0].title}`);
    }
  }

  function clearCart() {
    localStorage.removeItem(CART_KEY);
    renderHeaderCount();
    // notify pages via storage event fallback
    try { localStorage.setItem('__qf_cart_cleared', Date.now().toString()); localStorage.removeItem('__qf_cart_cleared'); } catch {}
    showToast('Cart cleared');
  }

  // UI: header count
  function renderHeaderCount() {
    const headerCount = id('header-cart-count');
    if (!headerCount) return;
    const cart = loadCart();
    headerCount.textContent = String(cart.length);
  }

  // Toast
  function showToast(msg, ms = 1800) {
    try {
      let container = id('qf-toast');
      if (!container) {
        container = document.createElement('div');
        container.id = 'qf-toast';
        container.style.position = 'fixed';
        container.style.top = '1rem';
        container.style.right = '1rem';
        container.style.zIndex = '9999';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '0.5rem';
        document.body.appendChild(container);
      }
      const el = document.createElement('div');
      el.textContent = msg;
      el.style.background = 'rgba(2,6,23,0.06)';
      el.style.color = '#042028';
      el.style.padding = '0.6rem 0.9rem';
      el.style.borderRadius = '8px';
      el.style.boxShadow = '0 8px 24px rgba(2,6,23,0.06)';
      el.style.transition = 'opacity 180ms ease';
      container.appendChild(el);
      setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 220); }, ms);
    } catch (e) { console.warn('toast error', e); }
  }

  // Bind add-to-cart buttons on donate page
  function bindAddToCartButtons(root = document) {
    const buttons = $$('.add-to-cart', root);
    buttons.forEach(btn => {
      if (btn.dataset.bound === 'true') return;
      btn.dataset.bound = 'true';
      btn.addEventListener('click', (ev) => {
        ev.preventDefault();
        const title = btn.getAttribute('data-title') || (btn.closest('.card')?.querySelector('h3')?.textContent?.trim()) || 'Donation';
        const priceRaw = btn.getAttribute('data-price') || btn.closest('.card')?.querySelector('.price')?.textContent || '0';
        const price = Number(String(priceRaw).replace(/[^0-9.]/g, '')) || 0;
        addToCart({ title: title.trim(), price });
      });
    });

    // custom donation button (if present)
    const customAdd = id('custom-add');
    const customInput = id('custom-amount');
    if (customAdd && customInput && !customAdd.dataset.bound) {
      customAdd.dataset.bound = 'true';
      customAdd.addEventListener('click', (e) => {
        e.preventDefault();
        const v = Number(customInput.value);
        if (!Number.isFinite(v) || v < 1) { showToast('Enter a valid amount (minimum $1)'); return; }
        addToCart({ title: 'Custom Donation', price: v });
        customInput.value = '';
        customAdd.disabled = true;
      });
      customInput.addEventListener('input', () => {
        const v = Number(customInput.value);
        if (Number.isFinite(v) && v >= 1) { customAdd.disabled = false; } else { customAdd.disabled = true; }
      });
    }
  }

  // Cart page rendering & interactions
  function renderCartPage() {
    const cartListEl = id('cart-list');
    const cartTotalEl = id('cart-total');
    const cartEmptyEl = id('cart-empty');
    if (!cartListEl || !cartTotalEl) return;

    const cart = loadCart();
    cartListEl.innerHTML = '';
    if (!cart.length) {
      if (cartEmptyEl) cartEmptyEl.style.display = 'block';
      cartTotalEl.textContent = formatCurrency(0);
      return;
    }
    if (cartEmptyEl) cartEmptyEl.style.display = 'none';

    cart.forEach((it, idx) => {
      const row = document.createElement('div');
      row.className = 'cart-item';
      row.innerHTML = `
        <div class="meta">
          <div style="font-weight:700">${escapeHtml(it.title)}</div>
          <div class="muted">${escapeHtml(it.note || '')}</div>
        </div>
        <div style="text-align:right">
          <div style="font-weight:800">${formatCurrency(it.price)}</div>
          <div style="margin-top:6px">
            <button data-idx="${idx}" class="remove-btn" style="background:transparent;border:0;color:var(--muted);cursor:pointer">Remove</button>
          </div>
        </div>
      `;
      cartListEl.appendChild(row);
    });

    const total = cart.reduce((s, i) => s + Number(i.price || 0), 0);
    cartTotalEl.textContent = formatCurrency(total);
  }

  function bindCartPageInteractions() {
    const cartListEl = id('cart-list');
    const clearBtn = id('cart-clear');
    const checkoutBtn = id('go-checkout') || id('checkout');

    if (cartListEl) {
      cartListEl.addEventListener('click', (e) => {
        const btn = e.target.closest('button.remove-btn');
        if (!btn) return;
        const idx = Number(btn.dataset.idx);
        removeFromCart(idx);
        renderCartPage();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!confirm('Clear all items from cart?')) return;
        clearCart();
        renderCartPage();
      });
    }

    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', (e) => {
        // allow default navigation to checkout page; ensure cart saved
        // no extra logic here
      });
    }
  }

  // Keep header count in sync across tabs (storage event)
  window.addEventListener('storage', (e) => {
    if (!e.key) return;
    if (e.key === CART_KEY || e.key === '__qf_cart_cleared') {
      renderHeaderCount();
      // If on cart page, re-render
      if (document.getElementById('cart-list')) renderCartPage();
    }
  });

  // Mobile menu toggle (shared)
  function bindMobileToggle() {
    const toggle = id('mobile-toggle');
    const mobileMenu = id('mobile-menu');
    if (!toggle || !mobileMenu) return;
    function setToggle() {
      toggle.style.display = window.innerWidth <= 768 ? 'inline-flex' : 'none';
    }
    setToggle();
    window.addEventListener('resize', setToggle);

    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      if (!expanded) {
        mobileMenu.style.display = 'block';
        mobileMenu.setAttribute('aria-hidden', 'false');
        const first = mobileMenu.querySelector('a');
        if (first) first.focus();
      } else {
        mobileMenu.style.display = 'none';
        mobileMenu.setAttribute('aria-hidden', 'true');
      }
    });

    document.addEventListener('click', (e) => {
      if (window.innerWidth > 768) return;
      if (!mobileMenu || !toggle) return;
      const inside = mobileMenu.contains(e.target) || toggle.contains(e.target);
      if (!inside) {
        mobileMenu.style.display = 'none';
        mobileMenu.setAttribute('aria-hidden', 'true');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (mobileMenu && mobileMenu.getAttribute('aria-hidden') === 'false') {
          mobileMenu.style.display = 'none';
          mobileMenu.setAttribute('aria-hidden', 'true');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.focus();
        }
      }
    });
  }

  // Initialize on DOM ready
  function init() {
    renderHeaderCount();
    bindAddToCartButtons(document);
    bindMobileToggle();

    // If cart page present
    if (id('cart-list')) {
      renderCartPage();
      bindCartPageInteractions();
    }

    // If donate page present, ensure add buttons bound (in case dynamic)
    if ($$('.add-to-cart').length) bindAddToCartButtons(document);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

  // Expose for debugging
  window.qfCart = {
    loadCart,
    saveCart,
    addToCart,
    removeFromCart,
    clearCart,
    renderCartPage,
    renderHeaderCount
  };
})();
