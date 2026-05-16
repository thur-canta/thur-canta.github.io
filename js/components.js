// ============================================================
// Thur Handmade — Header & Footer (ndryshoni vetëm SITE në data.js)
// ============================================================
// Ky skedar gjeneron header-in dhe footer-in automatikisht
// nga konfigurimi SITE. Nuk ka nevojë të ndryshoni asgjë këtu.
// ============================================================

(function () {
  const page = document.body.dataset.page;
  const p = page === 'home' ? '' : 'index.html'; // prefix for cross-page anchors

  function active(target) {
    return page === target ? ' class="active"' : '';
  }

  /* ── Header ──────────────────────────────────────── */
  const header = `
  <div class="announce-bar">🚚 Transport falas për porosi mbi ${SITE.freeShippingOver}${SITE.currency} në gjithë Kosovën</div>
  <nav class="navbar">
    <div class="container">
      <a href="index.html" class="nav-logo">${SITE.name.split(' ')[0]}<small>${SITE.name.split(' ')[1] || ''}</small></a>
      <div class="nav-links">
        <a href="index.html"${active('home')}>Ballina</a>
        <a href="dyqani.html"${active('shop')}>Dyqani</a>
        <a href="${p}#story">Rreth nesh</a>
        <a href="${p}#custom-order">Porosi sipas dëshirës</a>
        <a href="${p}#footer-contact">Kontakt</a>
        <a href="shporta.html" class="cart-link${page === 'cart' ? ' active' : ''}">
          <span class="cart-icon">🛒</span>
          Shporta
          <span class="cart-badge">0</span>
        </a>
      </div>
      <a href="shporta.html" class="mobile-cart" aria-label="Shporta">
        🛒<span class="cart-badge">0</span>
      </a>
      <button class="menu-toggle" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>`;

  /* ── Footer ──────────────────────────────────────── */
  const footer = `
  <footer class="site-footer" id="footer-contact">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col">
          <h3>${SITE.name}</h3>
          <p>${SITE.tagline}</p>
        </div>
        <div class="footer-col">
          <h3>Dyqani</h3>
          <a href="dyqani.html">Të gjitha çantat</a>
          <a href="shporta.html">Shporta</a>
          <a href="${p}#custom-order">Porosi sipas dëshirës</a>
        </div>
        <div class="footer-col">
          <h3>Kontakt</h3>
          <a href="mailto:${SITE.email}">${SITE.email}</a>
          <a href="https://instagram.com/${SITE.instagram}" target="_blank" rel="noopener">📸 @${SITE.instagram}</a>
          <a href="tel:${SITE.phone.replace(/\s/g, '')}">${SITE.phone}</a>
        </div>
        <div class="footer-col">
          <h3>Informata</h3>
          <p>${SITE.address}</p>
          <p>Transport në gjithë Kosovën</p>
          <p>Pagesë në dorëzim ose transfer</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; ${new Date().getFullYear()} ${SITE.name}. Të gjitha të drejtat e rezervuara.</p>
      </div>
    </div>
  </footer>`;

  /* ── Inject ──────────────────────────────────────── */
  const h = document.getElementById('site-header');
  const f = document.getElementById('site-footer');
  if (h) h.outerHTML = header;
  if (f) f.outerHTML = footer;
})();
