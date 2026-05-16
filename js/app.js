// ====================================================
// Thur Handmade — Logjika kryesore (shporta, faqet, porosia)
// ====================================================
(function () {
  'use strict';

  const CART_KEY   = 'thur_cart';
  const ORDERS_KEY = 'thur_orders';

  /* ── Order storage ───────────────────────────────── */

  function getOrders() {
    try { return JSON.parse(localStorage.getItem(ORDERS_KEY)) || []; }
    catch { return []; }
  }

  function saveOrderLocally(order) {
    const orders = getOrders();
    orders.unshift(order); // newest first
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }

  /* ── Validation helpers ──────────────────────────── */

  // Kosovo numbers: 04x/06x xxx xxx or +3834x / +3836x
  // Operators: 044/045/046/049 (IPKO), 043/047/048 (Vala), 060/061/062/063/066
  const KOSOVO_PHONE_RE = /^(\+3836[0-9]|06[0-9]|\+3834[3-9]|04[3-9])[0-9\s]{6,8}$/;

  function validatePhone(raw) {
    const clean = raw.replace(/[\s\-().]/g, '');
    return KOSOVO_PHONE_RE.test(clean);
  }

  function validateEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  }

  function showFieldError(id, msg) {
    const el = document.getElementById(id);
    if (el) { el.textContent = msg; el.style.display = msg ? 'block' : 'none'; }
  }

  function clearFieldError(id) { showFieldError(id, ''); }

  // Live-clear errors as user types
  function attachLiveValidation(inputId, errorId, validatorFn, errorMsg) {
    const el = document.getElementById(inputId);
    if (!el) return;
    el.addEventListener('input', () => {
      if (el.value && !validatorFn(el.value)) showFieldError(errorId, errorMsg);
      else clearFieldError(errorId);
    });
  }

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

    // live validation
    attachLiveValidation('phone', 'phone-error', validatePhone,
      '⚠ Numri duhet të jetë nga Kosova (p.sh. 044 123 456)');
    attachLiveValidation('email', 'email-error', validateEmail,
      '⚠ Shkruani një email adresë të vlefshme');

    // submit
    form.addEventListener('submit', e => {
      e.preventDefault();
      const fd = new FormData(form);
      const name    = fd.get('name').trim();
      const phone   = fd.get('phone').trim();
      const email   = fd.get('email').trim();
      const city    = fd.get('city');
      const address = fd.get('address').trim();
      const payment = fd.get('payment');
      const notes   = fd.get('notes') || '';

      // Validate
      let valid = true;
      if (!validatePhone(phone)) {
        showFieldError('phone-error', '⚠ Numri duhet të jetë nga Kosova (p.sh. 044 123 456)');
        valid = false;
      }
      if (!validateEmail(email)) {
        showFieldError('email-error', '⚠ Shkruani një email adresë të vlefshme');
        valid = false;
      }
      if (!valid) return;

      clearFieldError('phone-error');
      clearFieldError('email-error');

      const orderNo = 'TH-' + Date.now().toString(36).toUpperCase();

      // --- Message to OWNER (WhatsApp) ---
      let ownerTxt = '\u{1F6D2} POROSI E RE \u2014 ' + orderNo + '\\n\\n';
      ownerTxt += '\u{1F464} ' + name + '\\n\u{1F4DE} ' + phone + '\\n\u{1F4E7} ' + email + '\\n\u{1F4CD} ' + city + ', ' + address + '\\n';
      ownerTxt += '\u{1F4B3} ' + (payment === 'cod' ? 'Pags\u00ebr n\u00eb dor\u00ebzim' : 'Transfer bankar') + '\\n';
      if (notes) ownerTxt += '\u{1F4DD} ' + notes + '\\n';
      ownerTxt += '\\n--- Produktet ---\\n';
      cart.forEach(i => {
        const p = productById(i.id);
        if (p) ownerTxt += '\u2022 ' + p.name + ' \u00d7 ' + i.qty + ' = ' + (p.price * i.qty).toFixed(2) + '\u20ac\\n';
      });
      ownerTxt += '\\nTransporti: ' + (ship === 0 ? 'FALAS' : ship.toFixed(2) + '\u20ac');
      ownerTxt += '\\nTOTALI: ' + total.toFixed(2) + '\u20ac';

      const waUrl = 'https://wa.me/' + SITE.whatsapp + '?text=' + encodeURIComponent(ownerTxt);

      // --- Confirmation email to CUSTOMER ---
      let custTxt = 'P\u00ebrsh\u00ebndetje ' + name + ',\\n\\nFaleminder\u00ebt p\u00ebr porosin\u00eb tuaj! Sap\u00eb e kemi pranuar dhe do t\u2019ju kontaktojm\u00eb s\u00eb shpejti.\\n\\n';
      custTxt += 'Nr. i porosis\u00eb: ' + orderNo + '\\n\\n--- Produktet ---\\n';
      cart.forEach(i => {
        const p = productById(i.id);
        if (p) custTxt += '\u2022 ' + p.name + ' \u00d7 ' + i.qty + ' = ' + (p.price * i.qty).toFixed(2) + '\u20ac\\n';
      });
      custTxt += '\\nTransporti: ' + (ship === 0 ? 'FALAS' : ship.toFixed(2) + '\u20ac');
      custTxt += '\\nTOTALI: ' + total.toFixed(2) + '\u20ac';
      custTxt += '\\nAdresa e dor\u00ebzimit: ' + city + ', ' + address;
      custTxt += '\\nM\u00ebnyra e pag\u00ebs\u00ebs: ' + (payment === 'cod' ? 'Pags\u00ebr n\u00eb dor\u00ebzim' : 'Transfer bankar');
      if (payment === 'transfer') {
        custTxt += '\\n\\n-- Detajet bankare --\\nBanka: ' + SITE.bank.name + '\\nIBAN: ' + SITE.bank.iban + '\\nReference pagese: ' + orderNo;
      }
      custTxt += '\\n\\nMe dashuri,\\nThur Handmade';

      const mailToCustomer = 'mailto:' + email + '?subject=' + encodeURIComponent('Konfirmim i porosis\u00eb \u2014 ' + orderNo) + '&body=' + encodeURIComponent(custTxt);

      // save order locally in browser storage
      saveOrderLocally({
        no: orderNo,
        date: new Date().toISOString(),
        name, phone, email, city, address, payment, notes,
        items: cart.map(i => {
          const p = productById(i.id);
          return { id: i.id, name: p ? p.name : i.id, qty: i.qty, price: p ? p.price : 0 };
        }),
        shipping: ship,
        total
      });

      clearCart();

      // Fire both channels from the submit user-gesture so browsers allow them
      window.open(waUrl, '_blank', 'noopener');   // owner: WhatsApp in new tab
      window.location.href = mailToCustomer;       // customer: opens mail client (no navigation)

      showConfirmation(orderNo, payment);
    });
  }

  function showConfirmation(orderNo, payment) {
    document.querySelector('main').innerHTML = `
      <div class="confirmation">
        <div class="conf-icon">✓</div>
        <h1>Faleminderit për porosinë!</h1>
        <p class="conf-order">Numri i porosisë: <strong>${orderNo}</strong></p>
        <p>Porosia juaj u regjistrua me sukses.</p>
        <div class="conf-sent-status">
          <p>📱 <strong>WhatsApp</strong> u hap te dyqani ynë, dërgoni mesazhin për të konfirmuar.</p>
          <p>✉️ <strong>Email</strong> u hap në pajisjen tuaj, dërgoni për të marrë konfirmimin.</p>
        </div>
        ${payment === 'transfer' ? `
          <div class="conf-bank">
            <h3>Detajet e pagesës me transfer bankar</h3>
            <p><strong>Banka:</strong> ${SITE.bank.name}</p>
            <p><strong>IBAN:</strong> ${SITE.bank.iban}</p>
            <p><strong>Emri:</strong> ${SITE.bank.owner}</p>
            <p class="conf-ref">Shkruani <strong>${orderNo}</strong> si referencë të pagesës.</p>
          </div>` : '<p>Pagesa do të bëhet në dorëzim.</p>'}
        <a href="index.html" class="btn btn-outline" style="margin-top:1rem">&larr; Kthehu në faqen kryesore</a>
        <p class="conf-note">Do të kontaktoheni nga ekipi ynë për konfirmimin e porosisë.</p>
        <p class="conf-note" style="margin-top:.5rem;font-size:.8rem;color:var(--clr-text-light)">
          💾 Porosia u ruajt edhe në këtë pajisje.
          <button onclick="showOrderHistory()" style="background:none;border:none;color:var(--clr-primary);cursor:pointer;font-size:.8rem;text-decoration:underline">Shiko historikun e porosive</button>
        </p>
      </div>`;
  }

  window.showOrderHistory = function () {
    const orders = getOrders();
    if (!orders.length) { alert('Nuk ka porosi të ruajtura në këtë pajisje.'); return; }
    const rows = orders.map(o => {
      const d = new Date(o.date).toLocaleDateString('sq-AL', { day:'2-digit', month:'2-digit', year:'numeric' });
      const itemList = o.items.map(i => `${i.name} ×${i.qty}`).join(', ');
      return `<tr>
        <td><strong>${o.no}</strong></td>
        <td>${d}</td>
        <td>${o.name}</td>
        <td style="font-size:.85rem">${itemList}</td>
        <td><strong>${o.total.toFixed(2)}€</strong></td>
      </tr>`;
    }).join('');

    document.querySelector('main').innerHTML = `
      <div class="order-history" style="padding:2rem 0">
        <h1 style="margin-bottom:1.5rem">📋 Historiku i porosive</h1>
        <p style="font-size:.85rem;color:var(--clr-text-light);margin-bottom:1rem">Këto porosi janë ruajtur vetëm në këtë pajisje (browser).</p>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:.9rem">
            <thead>
              <tr style="border-bottom:2px solid var(--clr-primary);text-align:left">
                <th style="padding:.6rem .4rem">Nr. Porosisë</th>
                <th style="padding:.6rem .4rem">Data</th>
                <th style="padding:.6rem .4rem">Emri</th>
                <th style="padding:.6rem .4rem">Produktet</th>
                <th style="padding:.6rem .4rem">Totali</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
        <div style="margin-top:1.5rem;display:flex;gap:1rem;flex-wrap:wrap">
          <a href="index.html" class="btn btn-outline">&larr; Kryefaqja</a>
          <button onclick="if(confirm('Fshi të gjitha porositë e ruajtura?')){localStorage.removeItem('thur_orders');location.reload();}" class="btn btn-outline" style="color:#c0392b;border-color:#c0392b">🗑 Fshi historikun</button>
        </div>
      </div>`;
  };

  /* ── Custom Order Form ───────────────────────────── */

  function initCustomOrder() {
    const form = document.getElementById('custom-order-form');
    if (!form) return;

    attachLiveValidation('co-phone', 'co-phone-error', validatePhone,
      '⚠ Numri duhet të jetë nga Kosova (p.sh. 044 123 456)');
    attachLiveValidation('co-email', 'co-email-error', validateEmail,
      '⚠ Shkruani një email adresë të vlefshme');

    form.addEventListener('submit', e => {
      e.preventDefault();
      const fd = new FormData(form);
      const name   = fd.get('name').trim();
      const phone  = fd.get('phone').trim();
      const email  = fd.get('email').trim();
      const color  = fd.get('color') || 'Pa preferencë';
      const size   = fd.get('size');
      const type   = fd.get('type');
      const details = fd.get('details');

      let valid = true;
      if (!validatePhone(phone)) {
        showFieldError('co-phone-error', '⚠ Numri duhet të jetë nga Kosova (p.sh. 044 123 456)');
        valid = false;
      }
      if (!validateEmail(email)) {
        showFieldError('co-email-error', '⚠ Shkruani një email adresë të vlefshme');
        valid = false;
      }
      if (!valid) return;

      clearFieldError('co-phone-error');
      clearFieldError('co-email-error');

      let txt = `✨ POROSI SIPAS DËSHIRËS\n\n`;
      txt += `👤 ${name}\n📞 ${phone}\n📧 ${email}\n`;
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
