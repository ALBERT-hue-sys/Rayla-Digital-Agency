/* =================================================================
   RAYLA DIGITAL AGENCY — Header & Nav Behaviour
   Everything here is about how the "task bar" (site header + mobile
   nav) behaves as the viewport changes size and as the page scrolls.
   The menu open/close mechanism itself is still pure CSS (the
   checkbox hack in style.css) — this script only handles the parts
   CSS alone can't: closing the menu automatically, locking body
   scroll while it's open, and reacting to scroll position.
   ================================================================= */

document.addEventListener('DOMContentLoaded', function () {
  var header    = document.querySelector('.site-header');
  var navToggle = document.getElementById('nav-toggle');
  var navLinks  = document.querySelectorAll('.main-nav a');

  if (!header || !navToggle) return; // defensive: don't error if markup changes later

  /* ---------------------------------------------------------------
     0. Keep the mobile dropdown aligned to the header's real height
     (handles both the normal and the scrolled/compact header states)
     --------------------------------------------------------------- */
  function setHeaderHeightVar() {
    document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
  }
  setHeaderHeightVar();
  window.addEventListener('resize', setHeaderHeightVar);
  if (window.ResizeObserver) {
    new ResizeObserver(setHeaderHeightVar).observe(header);
  } else {
    window.addEventListener('scroll', setHeaderHeightVar, { passive: true });
  }

  /* ---------------------------------------------------------------
     1. Mobile menu behaviour
     --------------------------------------------------------------- */
  function closeMenu() {
    if (navToggle.checked) {
      navToggle.checked = false;
      document.body.classList.remove('nav-open');
    }
  }

  // Keep <body> in sync with the checkbox so we can lock scrolling
  // while the mobile drawer is open (prevents the page behind it
  // from scrolling on touch devices).
  navToggle.addEventListener('change', function () {
    document.body.classList.toggle('nav-open', navToggle.checked);
  });

  // Close the drawer automatically once a link inside it is tapped —
  // without this, the checkbox stays "checked" after an anchor jump
  // and the menu is left covering the page it just navigated to.
  navLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape, for keyboard users.
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  // If the window is resized (or a device is rotated) past the
  // point where the mobile drawer applies, reset its state so it
  // can't reappear pre-opened if the viewport shrinks again later.
  var desktopQuery = window.matchMedia('(min-width: 1025px)');
  function handleViewportChange(e) {
    if (e.matches) closeMenu();
  }
  if (desktopQuery.addEventListener) {
    desktopQuery.addEventListener('change', handleViewportChange);
  } else if (desktopQuery.addListener) {
    desktopQuery.addListener(handleViewportChange); // older Safari fallback
  }

  /* ---------------------------------------------------------------
     2. Scrolled / compact header state
     Adds `.is-scrolled` once the page moves down a bit, so the bar
     can shrink slightly and pick up a solid background + shadow
     instead of sitting at full size over the hero indefinitely.
     --------------------------------------------------------------- */
  var SCROLL_THRESHOLD = 40;
  var ticking = false;

  function updateHeaderState() {
    header.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(updateHeaderState);
      ticking = true;
    }
  }, { passive: true });

  updateHeaderState(); // set correct state on load (e.g. page opened mid-scroll)
});

document.addEventListener('DOMContentLoaded', function () {
  var groupSelectors = '.card-grid, .pillars, .process-track, .vm-grid, .check-grid, .contact-grid';
  var soloSelectors   = '.section-head, .who-text, .who-media, .about-grid, .statement, .pill-cloud, .brand-logos';

  document.querySelectorAll(groupSelectors).forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (child, i) {
      child.classList.add('fade-up');
      child.style.setProperty('--fade-delay', Math.min(i * 0.08, 0.4) + 's');
    });
  });
  document.querySelectorAll(soloSelectors).forEach(function (el) {
    el.classList.add('fade-up');
  });

  var toReveal = document.querySelectorAll('.fade-up');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    toReveal.forEach(function (el) { observer.observe(el); });
  } else {
    toReveal.forEach(function (el) { el.classList.add('is-visible'); });
  }
});

document.addEventListener('DOMContentLoaded', function () {
  var dialog = document.getElementById('discovery-modal');
  if (!dialog) return;

  var form        = document.getElementById('discovery-form');
  var formStep    = dialog.querySelector('[data-step="form"]');
  var successStep = dialog.querySelector('[data-step="success"]');
  var successName = document.getElementById('dc-success-name');
  var openTriggers = document.querySelectorAll('[data-open-modal="discovery-modal"]');
  var closeTriggers = dialog.querySelectorAll('[data-close-modal]');

  function openModal() {
    formStep.hidden = false;
    successStep.hidden = true;
    dialog.showModal();
    document.body.classList.add('modal-open');
    requestAnimationFrame(function () {
      dialog.classList.add('is-visible');
    });
  }

  function closeModal() {
    dialog.classList.remove('is-visible');
    document.body.classList.remove('modal-open');
    window.setTimeout(function () {
      dialog.close();
    }, 250);
  }

  openTriggers.forEach(function (btn) { btn.addEventListener('click', openModal); });
  closeTriggers.forEach(function (btn) { btn.addEventListener('click', closeModal); });

  dialog.addEventListener('click', function (e) {
    if (e.target === dialog) closeModal();
  });

  dialog.addEventListener('cancel', function (e) {
    e.preventDefault();
    closeModal();
  });

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.querySelector('#dc-name').value.trim();
      successName.textContent = name ? name.split(' ')[0] : 'there';
      formStep.hidden = true;
      successStep.hidden = false;
      form.reset();
    });
  }
});