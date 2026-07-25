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