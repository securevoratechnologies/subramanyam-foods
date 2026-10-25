/* ============================================================
   SUBRAMANYAM FOODS — Vanilla JavaScript
   ============================================================ */

(function () {
  'use strict';

  const header = document.getElementById('siteHeader');
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const navLinks = document.querySelectorAll('.nav-link');
  const copyrightYear = document.getElementById('copyrightYear');

  const reserveButtons = [
    document.getElementById('reserveHeaderBtn'),
    document.getElementById('reserveMobileBtn'),
    document.getElementById('reserveHeroBtn'),
    document.getElementById('reserveContactBtn')
  ].filter(Boolean);

  const directionsBtn = document.getElementById('directionsBtn');
  const callBtn = document.getElementById('callBtn');

  const toast = document.getElementById('reservationToast');
  const toastClose = document.getElementById('toastClose');

  /* --- CONFIGURATION --- 
     Update these with real links to make buttons functional.
     Leaving empty strings ('') will trigger the graceful toast popup. 
  */
  const CONFIG = {
    reservationUrl: '', // e.g., 'https://wa.me/919876543210' or a booking link
    directionsUrl: '',  // e.g., 'https://maps.google.com/?q=Hebbal+Bangalore'
    phoneUrl: 'tel:+919876543210' // Replace with actual number to make 'Call Us' work
  };

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- HEADER SCROLL --- */
  function updateHeaderState() {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', updateHeaderState, { passive: true });
  updateHeaderState();

  /* --- MOBILE MENU --- */
  function openMenu() {
    mobileNav.classList.add('open');
    mobileNav.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Close menu');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
  }

  function toggleMenu() {
    if (mobileNav.classList.contains('open')) { closeMenu(); } else { openMenu(); }
  }

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', toggleMenu);
    mobileNavLinks.forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        closeMenu();
        menuToggle.focus();
      }
    });
    mobileNav.addEventListener('click', (e) => {
      if (e.target === mobileNav) closeMenu();
    });
  }

  /* --- SMOOTH SCROLLING --- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const headerOffset = header ? header.offsetHeight : 0;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset;

      window.scrollTo({
        top: targetTop,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    });
  });

  /* --- ACTIVE NAV HIGHLIGHT --- */
  const sections = document.querySelectorAll('main section[id]');
  if ('IntersectionObserver' in window && sections.length) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(section => navObserver.observe(section));
  }

  /* --- REVEAL ON SCROLL --- */
  const revealTargets = document.querySelectorAll('.section-header, .dish-card, .story-image-wrap, .story-content, .contact-info, .contact-visual');
  if (!prefersReducedMotion && 'IntersectionObserver' in window && revealTargets.length) {
    revealTargets.forEach(el => el.classList.add('reveal'));
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealTargets.forEach(el => revealObserver.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('is-visible'));
  }

  /* --- DYNAMIC COPYRIGHT YEAR --- */
  if (copyrightYear) {
    copyrightYear.textContent = new Date().getFullYear();
  }

  /* --- TOAST POPUP --- */
  let toastTimer = null;
  function showToast(message) {
    if (!toast) return;
    const messageEl = toast.querySelector('.toast-message');
    if (messageEl && message) messageEl.textContent = message;

    toast.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 5500);
  }

  function hideToast() {
    if (!toast) return;
    toast.classList.remove('show');
    if (toastTimer) clearTimeout(toastTimer);
  }

  if (toastClose) toastClose.addEventListener('click', hideToast);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') hideToast(); });

  /* --- BUTTON ACTIONS --- */
  function handleReservation(e) {
    e.preventDefault();
    if (CONFIG.reservationUrl) {
      window.open(CONFIG.reservationUrl, '_blank', 'noopener,noreferrer');
    } else {
      // Popup requested for the reserve menu
      showToast('To reserve a table online, please set up your booking link in script.js or call us directly.');
    }
  }
  reserveButtons.forEach(btn => btn.addEventListener('click', handleReservation));

  if (directionsBtn) {
    directionsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (CONFIG.directionsUrl) window.open(CONFIG.directionsUrl, '_blank', 'noopener,noreferrer');
      else showToast('Directions are not configured. Please update the link in script.js.');
    });
  }

  if (callBtn) {
    callBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (CONFIG.phoneUrl) window.location.href = CONFIG.phoneUrl;
      else showToast('Phone number is not configured yet.');
    });
  }

  /* --- IMAGE FALLBACKS (Ensures no broken image icons) --- */
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function () {
      if (!this.dataset.fallbackApplied) {
        this.dataset.fallbackApplied = 'true';
        this.src = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
          '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">' +
          '<rect width="800" height="600" fill="#F4EDE1"/>' +
          '<text x="400" y="300" font-family="Georgia, serif" font-size="28" fill="#B0532F" text-anchor="middle">Subramanyam Foods</text>' +
          '<text x="400" y="340" font-family="Arial, sans-serif" font-size="16" fill="#7A6F64" text-anchor="middle">Image coming soon</text>' +
          '</svg>'
        );
      }
    });
  });
})();