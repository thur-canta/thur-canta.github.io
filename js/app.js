// ====================================================
// Thur Handmade — Logjika kryesore (shporta, faqet, porosia)
// ====================================================
(function () {
  'use strict';

  const CART_KEY = 'thur_cart';

  /* ── Cart helpers ────────────────────────────────── */

  function getCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch { return []; }
  }
  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartBadge();
  }
  function addToCart(productId, qty) {
    qty = parseInt(qty, 10) || 1;
    const cart = getCart();
    const item = cart.find(i => i.id === productId);
    if (item) { item.qty += qty; } else { cart.push({ id: productId, qty }); }
    saveCart(cart);
  }
  function removeFromCart(productId) {
    saveCart(getCart().filter(i => i.id !== productId));
  }
  function updateQty(productId, qty) {
    const cart = getCart();
    const item = cart.find(i => i.id === productId);
    if (item) item.qty = Math.max(1, qty);
    saveCart(cart);
  }
  function clearCart() {
    localStorage.removeItem(CART_KEY);
    updateCartBadge();
  }
  function cartSubtotal() {
    return getCart().reduce((s, i) => {
      const p = productById(i.id);
      return s + (p ? p.price * i.qty : 0);
    }, 0);
  }
  function cartCount() {
    return getCart().reduce((s, i) => s + i.qty, 0);
  }
  function productById(id) {
    return PRODUCTS.find(p => p.id === id);
  }
  function fmt(n) { return n.toFixed(2) + SITE.currency; }

  /* ── UI: cart badge ─────────────────────────────── */

  function updateCartBadge() {
    document.querySelectorAll('.cart-badge').forEach(el => {
      const c = cartCount();
      el.textContent = c;
      el.style.display = c > 0 ? 'flex' : 'none';
    });
  }

  /* ── UI: mobile menu ────────────────────────────── */

  function initMobileMenu() {
    const btn = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav-links');
    if (!btn || !nav) return;
    btn.addEventListener('click', () => {
      nav.classList.toggle('open');
      btn.classList.toggle('open');
    });
    nav.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        nav.classList.remove('open');
        btn.classList.remove('open');
      })
    );
  }

  /* ── Render: product grid ───────────────────────── */

  function renderGrid(id, list) {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = list.map(p => `
      <a href="produkt.html?id=${encodeURIComponent(p.id)}" class="product-card">
        <div class="product-img-wrap">
          <img src="${p.images[0]}" alt="${p.name}" loading="lazy">
        </div>
        <div class="product-card-body">
          <h3>${p.name}</h3>
          <p class="price">${fmt(p.price)}</p>
        </div>
      </a>`).join('');
  }

  /* ── Page: product detail ───────────────────────── */

  function initProduct() {
    const id = new URLSearchParams(location.search).get('id');
    const p = id && productById(id);
    if (!p) {
      const el = document.querySelector('.product-detail');
      if (el) el.innerHTML = '<p class="empty-msg">Produkti nuk u gjet.</p>';
      return;
    }
    document.title = p.name + ' – Thur Handmade';

    const mainImg = document.getElementById('main-image');
    mainImg.src = p.images[0]; mainImg.alt = p.name;

    const thumbs = document.getElementById('thumbs');
    thumbs.innerHTML = p.images.map((src, i) =>
      `<img src="${src}" alt="${p.name}" class="thumb${i === 0 ? ' active' : ''}" loading="lazy">`
    ).join('');
    thumbs.querySelectorAll('.thumb').forEach(t =>
      t.addEventListener('click', () => {
        mainImg.src = t.src;
        thumbs.querySelectorAll('.thumb').forEach(x => x.classList.remove('active'));
        t.classList.add('active');
      })
    );

    document.getElementById('p-name').textContent = p.name;
    document.getElementById('p-price').textContent = fmt(p.price);
    document.getElementById('p-desc').textContent = p.description;
    document.getElementById('p-details').textContent = p.details;

    const addBtn = document.getElementById('add-to-cart');
    addBtn.addEventListener('click', () => {
      addToCart(id);
      addBtn.textContent = '✓ U shtua në shportë!';
      addBtn.classList.add('added');
      setTimeout(() => { addBtn.textContent = 'Shto në shportë'; addBtn.classList.remove('added'); }, 2000);
    });

    renderGrid('related-products', PRODUCTS.filter(x => x.id !== id).slice(0, 4));
  }

  /* ── Page: cart ─────────────────────────────────── */

  function initCart() {
    const wrap = document.getElementById('cart-items');
    const empty = document.getElementById('cart-empty');
    const content = document.getElementById('cart-content');
    if (!wrap) return;

    function render() {
      const cart = getCart();
      if (!cart.length) {
        empty.style.display = 'block'; content.style.display = 'none'; return;
      }
      empty.style.display = 'none'; content.style.display = 'block';
      wrap.innerHTML = cart.map(item => {
        const p = productById(item.id);
        if (!p) return '';
        return `
          <div class="cart-row">
            <img src="${p.images[0]}" alt="${p.name}">
            <div class="cart-row-info">
              <h3><a href="produkt.html?id=${encodeURIComponent(p.id)}">${p.name}</a></h3>
              <span class="cart-row-price">${fmt(p.price)}</span>
            </div>
            <div class="cart-row-qty">
              <button class="qty-btn" data-id="${p.id}" data-d="-1">−</button>
              <span>${item.qty}</span>
              <button class="qty-btn" data-id="${p.id}" data-d="1">+</button>
            </div>
            <div class="cart-row-total">${fmt(p.price * item.qty)}</div>
            <button class="cart-row-rm" data-id="${p.id}" aria-label="Largo">×</button>
          </div>`;
      }).join('');

      wrap.querySelectorAll('.qty-btn').forEach(b => b.addEventListener('click', () => {
        const cid = b.dataset.id, d = parseInt(b.dataset.d, 10);
        const ci = getCart().find(x => x.id === cid);
        if (ci) { if (ci.qty + d < 1) removeFromCart(cid); else updateQty(cid, ci.qty + d); }
        render();
      }));
      wrap.querySelectorAll('.cart-row-rm').forEach(b => b.addEventListener('click', () => {
        removeFromCart(b.dataset.id); render();
      }));

      const sub = cartSubtotal();
      const ship = sub >= SITE.freeShippingOver ? 0 : SITE.shipping;
      document.getElementById('c-subtotal').textContent = fmt(sub);
      document.getElementById('c-shipping').textContent = ship === 0 ? 'FALAS' : fmt(ship);
      document.getElementById('c-total').textContent = fmt(sub + ship);
    }
    render();
  }

  /* ── Page: checkout ─────────────────────────────── */

  function initCheckout() {
    const form = document.getElementById('checkout-form');
    const summaryWrap = document.getElementById('order-items');
    const bankBox = document.getElementById('bank-details');
    if (!form) return;

    // redirect if cart empty
    if (!getCart().length) { location.href = 'shporta.html'; return; }

    // cities
    const sel = document.getElementById('city');
    CITIES.forEach(c => { const o = document.createElement('option'); o.value = c; o.textContent = c; sel.appendChild(o); });

    // bank info
    const bi = document.getElementById('bank-info');
    if (bi) bi.innerHTML =
      `<p><strong>Banka:</strong> ${SITE.bank.name}</p>
       <p><strong>IBAN:</strong> ${SITE.bank.iban}</p>
       <p><strong>Emri:</strong> ${SITE.bank.owner}</p>
       <p><strong>SWIFT:</strong> ${SITE.bank.swift}</p>`;

    // order summary
    const cart = getCart();
    const sub = cartSubtotal();
    const ship = sub >= SITE.freeShippingOver ? 0 : SITE.shipping;
    const total = sub + ship;
    summaryWrap.innerHTML = cart.map(i => {
      const p = productById(i.id);
      return p ? `<div class="sum-row"><span>${p.name} × ${i.qty}</span><span>${fmt(p.price * i.qty)}</span></div>` : '';
    }).join('') +
      `<div class="sum-row muted"><span>Transporti</span><span>${ship === 0 ? 'FALAS' : fmt(ship)}</span></div>`;
    document.getElementById('s-total').textContent = fmt(total);

    // toggle bank details
    form.querySelectorAll('input[name="payment"]').forEach(r =>
      r.addEventListener('change', () => { bankBox.style.display = r.value === 'transfer' ? 'block' : 'none'; })
    );

    // submit
    form.addEventListener('submit', e => {
      e.preventDefault();
      const fd = new FormData(form);
      const name = fd.get('name');
      const phone = fd.get('phone');
      const city = fd.get('city');
      const address = fd.get('address');
      const payment = fd.get('payment');
      const notes = fd.get('notes') || '';
      const orderNo = 'TH-' + Date.now().toString(36).toUpperCase();

      let txt = `🛒 POROSI E RE — ${orderNo}\n\n`;
      txt += `👤 ${name}\n📞 ${phone}\n📍 ${city}, ${address}\n`;
      txt += `💳 ${payment === 'cod' ? 'Pagesë në dorëzim' : 'Transfer bankar'}\n`;
      if (notes) txt += `📝 ${notes}\n`;
      txt += '\n--- Produktet ---\n';
      cart.forEach(i => {
        const p = productById(i.id);
        if (p) txt += `• ${p.name} × ${i.qty} = ${(p.price * i.qty).toFixed(2)}€\n`;
      });
      txt += `\nTransporti: ${ship === 0 ? 'FALAS' : ship.toFixed(2) + '€'}`;
      txt += `\nTOTALI: ${total.toFixed(2)}€`;

      const waUrl = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(txt)}`;

      // email fallback
      const mailUrl = `mailto:${SITE.email}?subject=${encodeURIComponent('Porosi ' + orderNo)}&body=${encodeURIComponent(txt)}`;

      clearCart();
      showConfirmation(orderNo, payment, waUrl, mailUrl);
    });
  }

  function showConfirmation(orderNo, payment, waUrl, mailUrl) {
    document.querySelector('main').innerHTML = `
      <div class="confirmation">
        <div class="conf-icon">✓</div>
        <h1>Faleminderit për porosinë!</h1>
        <p class="conf-order">Numri i porosisë: <strong>${orderNo}</strong></p>
        <p>Porosia juaj u regjistrua me sukses.</p>
        ${payment === 'transfer' ? `
          <div class="conf-bank">
            <h3>Detajet e pagesës me transfer bankar</h3>
            <p><strong>Banka:</strong> ${SITE.bank.name}</p>
            <p><strong>IBAN:</strong> ${SITE.bank.iban}</p>
            <p><strong>Emri:</strong> ${SITE.bank.owner}</p>
            <p class="conf-ref">Shkruani <strong>${orderNo}</strong> si referencë të pagesës.</p>
          </div>` : '<p>Pagesa do të bëhet në dorëzim.</p>'}
        <div class="conf-actions">
          <a href="${waUrl}" target="_blank" rel="noopener" class="btn btn-whatsapp">📱 Dërgo në WhatsApp</a>
          <a href="${mailUrl}" class="btn btn-outline">✉️ Dërgo me Email</a>
        </div>
        <a href="index.html" class="btn btn-outline" style="margin-top:1rem">← Kthehu në faqen kryesore</a>
        <p class="conf-note">Do të kontaktoheni nga ekipi ynë për konfirmimin e porosisë.</p>
      </div>`;
  }

  /* ── Custom Order Form ───────────────────────────── */

  function initCustomOrder() {
    const form = document.getElementById('custom-order-form');
    if (!form) return;

    form.addEventListener('submit', e => {
      e.preventDefault();
      const fd = new FormData(form);
      const name = fd.get('name');
      const phone = fd.get('phone');
      const color = fd.get('color') || 'Pa preferencë';
      const size = fd.get('size');
      const type = fd.get('type');
      const details = fd.get('details');

      let txt = `✨ POROSI SIPAS DËSHIRËS\n\n`;
      txt += `👤 ${name}\n📞 ${phone}\n`;
      txt += `🎨 Ngjyra: ${color}\n📐 Madhësia: ${size}\n👜 Tipi: ${type}\n`;
      txt += `📝 Përshkrimi:\n${details}`;

      const waUrl = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(txt)}`;
      window.open(waUrl, '_blank');

      form.style.display = 'none';
      const success = document.getElementById('co-success');
      if (success) success.classList.add('show');
    });
  }

  /* ── Init ────────────────────────────────────────── */

  document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    initMobileMenu();
    initCustomOrder();

    switch (document.body.dataset.page) {
      case 'home':
        renderGrid('featured-products', PRODUCTS.filter(p => p.featured));
        break;
      case 'shop':
        renderGrid('all-products', PRODUCTS);
        break;
      case 'product':
        initProduct();
        break;
      case 'cart':
        initCart();
        break;
      case 'checkout':
        initCheckout();
        break;
    }
  });

  window.THUR = { addToCart, removeFromCart, getCart, clearCart };
})();
