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
  var backdrop = document.getElementById('discovery-modal-backdrop');
  if (!dialog || !backdrop) return;

  var form        = document.getElementById('discovery-form');
  var formStep    = dialog.querySelector('[data-step="form"]');
  var successStep = dialog.querySelector('[data-step="success"]');
  var successName = document.getElementById('dc-success-name');
  var openTriggers = document.querySelectorAll('[data-open-modal="discovery-modal"]');
  var closeTriggers = dialog.querySelectorAll('[data-close-modal]');
  var lastFocused = null;

  function focusableElements() {
    var els = dialog.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    return Array.prototype.filter.call(els, function (el) { return el.offsetParent !== null; });
  }

  function trapFocus(e) {
    if (e.key !== 'Tab') return;
    var els = focusableElements();
    if (!els.length) return;
    var first = els[0];
    var last = els[els.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') closeModal();
    else trapFocus(e);
  }

  function openModal() {
    formStep.hidden = false;
    successStep.hidden = true;
    if (form) {
      form.querySelectorAll('.has-error').forEach(function (el) { el.classList.remove('has-error'); });
      form.querySelectorAll('.field-error').forEach(function (el) { el.textContent = ''; });
      var formError = document.getElementById('dc-form-error');
      if (formError) formError.hidden = true;
    }
    lastFocused = document.activeElement;
    dialog.show();
    document.body.classList.add('modal-open');
    document.addEventListener('keydown', handleKeydown);
    requestAnimationFrame(function () {
      dialog.classList.add('is-visible');
      backdrop.classList.add('is-visible');
      var els = focusableElements();
      if (els.length) els[0].focus();
    });
  }

  function closeModal() {
    dialog.classList.remove('is-visible');
    backdrop.classList.remove('is-visible');
    document.body.classList.remove('modal-open');
    document.removeEventListener('keydown', handleKeydown);
    window.setTimeout(function () {
      dialog.close();
      if (lastFocused) lastFocused.focus();
    }, 250);
  }

  openTriggers.forEach(function (btn) {
    btn.addEventListener('click', openModal);
  });
  closeTriggers.forEach(function (btn) {
    btn.addEventListener('click', closeModal);
  });

  backdrop.addEventListener('click', closeModal);

// document.addEventListener('DOMContentLoaded', function () {
//   var dialog = document.getElementById('discovery-modal');
//   if (!dialog) return;

//   var form        = document.getElementById('discovery-form');
//   var formStep    = dialog.querySelector('[data-step="form"]');
//   var successStep = dialog.querySelector('[data-step="success"]');
//   var successName = document.getElementById('dc-success-name');
//   var openTriggers = document.querySelectorAll('[data-open-modal="discovery-modal"]');
//   var closeTriggers = dialog.querySelectorAll('[data-close-modal]');

//   // function openModal() {
//   //   formStep.hidden = false;
//   //   successStep.hidden = true;
//   //   dialog.showModal();
//   //   document.body.classList.add('modal-open');
//   //   requestAnimationFrame(function () {
//   //     dialog.classList.add('is-visible');
//   //   });
//   // }

//   function openModal() {
//   formStep.hidden = false;
//   successStep.hidden = true;
//   if (form) {
//     form.querySelectorAll('.has-error').forEach(function (el) { el.classList.remove('has-error'); });
//     form.querySelectorAll('.field-error').forEach(function (el) { el.textContent = ''; });
//     var formError = document.getElementById('dc-form-error');
//     if (formError) formError.hidden = true;
//   }
//   dialog.showModal();
//   document.body.classList.add('modal-open');
//   requestAnimationFrame(function () {
//     dialog.classList.add('is-visible');
//   });
// }

//   function closeModal() {
//     dialog.classList.remove('is-visible');
//     document.body.classList.remove('modal-open');
//     window.setTimeout(function () {
//       dialog.close();
//     }, 250);
//   }

//   openTriggers.forEach(function (btn) { btn.addEventListener('click', openModal); });
//   closeTriggers.forEach(function (btn) { btn.addEventListener('click', closeModal); });

//   dialog.addEventListener('click', function (e) {
//     if (e.target === dialog) closeModal();
//   });

//   dialog.addEventListener('cancel', function (e) {
//     e.preventDefault();
//     closeModal();
//   });
   

   var FIELD_RULES = {
  'dc-name':    function (v) { return v.trim().length > 0; },
  'dc-email':   function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); },
  'dc-phone':   function (v) { return v.trim().length > 0; },
  'dc-details': function (v) { return v.trim().length >= 20; }
};
var FIELD_MESSAGES = {
  'dc-name': 'Please enter your name.',
  'dc-email': 'Please enter a valid email address.',
  'dc-phone': 'Please enter a phone number.',
  'dc-details': 'Please add a little more detail (at least 20 characters).'
};

function validateField(input) {
  var rule = FIELD_RULES[input.id];
  if (!rule) return true;
  var isValid = rule(input.value);
  var errorEl = form.querySelector('[data-error-for="' + input.id + '"]');
  input.classList.toggle('has-error', !isValid);
  if (errorEl) errorEl.textContent = isValid ? '' : FIELD_MESSAGES[input.id];
  return isValid;
}

if (form) {
  Object.keys(FIELD_RULES).forEach(function (id) {
    var input = form.querySelector('#' + id);
    if (!input) return;
    input.addEventListener('blur', function () { validateField(input); });
    input.addEventListener('input', function () {
      if (input.classList.contains('has-error')) validateField(input);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var formError = document.getElementById('dc-form-error');
    formError.hidden = true;

    var honeypot = form.querySelector('[name="botcheck"]');
    if (honeypot && honeypot.checked) return;

    var allValid = true;
    Object.keys(FIELD_RULES).forEach(function (id) {
      var input = form.querySelector('#' + id);
      if (input && !validateField(input)) allValid = false;
    });
    if (!allValid) return;

    var hCaptchaField = form.querySelector('textarea[name="h-captcha-response"]');
    if (hCaptchaField && !hCaptchaField.value) {
      formError.textContent = 'Please complete the captcha before submitting.';
      formError.hidden = false;
      return;
    }

    var nameVal = form.querySelector('#dc-name').value.trim();
    document.getElementById('dc-subject').value = 'New website inquiry from ' + nameVal;

    var submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(form)
    })
      .then(function (res) { return res.json(); })
      .then(function (result) {
        if (result.success) {
          successName.textContent = nameVal ? nameVal.split(' ')[0] : 'there';
          formStep.hidden = true;
          successStep.hidden = false;
          form.reset();
        } else {
          formError.textContent = 'Something went wrong sending your request — please try again, or call us directly.';
          formError.hidden = false;
        }
      })
      .catch(function () {
        formError.textContent = 'Something went wrong sending your request — please try again, or call us directly.';
        formError.hidden = false;
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Request Discovery Call';
      });
  });
}
});

document.addEventListener('DOMContentLoaded', function () {
  var wrap = document.querySelector('.carousel-track-wrap');
  var track = document.getElementById('why-rayla-carousel');
  var dotsWrap = document.getElementById('why-rayla-dots');
  if (!track || !wrap) return;

  var slides = Array.prototype.slice.call(track.querySelectorAll('.carousel-slide'));
  var prevBtn = wrap.querySelector('.carousel-arrow-prev');
  var nextBtn = wrap.querySelector('.carousel-arrow-next');

  var paused = false;
  track.addEventListener('mouseenter', function () { paused = true; });
  track.addEventListener('mouseleave', function () { paused = false; });
  track.addEventListener('touchstart', function () { paused = true; }, { passive: true });
  track.addEventListener('touchend', function () {
    window.setTimeout(function () { paused = false; }, 2000);
  }, { passive: true });

  function stepWidth() {
    var slide = track.querySelector('.carousel-slide');
    if (!slide) return 0;
    var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return slide.getBoundingClientRect().width + gap;
  }

  var resumeTimer;
  function pauseThenResume() {
    paused = true;
    window.clearTimeout(resumeTimer);
    resumeTimer = window.setTimeout(function () { paused = false; }, 2500);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      track.scrollBy({ left: stepWidth(), behavior: 'smooth' });
      pauseThenResume();
    });
  }
  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      track.scrollBy({ left: -stepWidth(), behavior: 'smooth' });
      pauseThenResume();
    });
  }

  var dots = [];
  if (dotsWrap && slides.length) {
    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.addEventListener('click', function () {
        track.scrollTo({ left: stepWidth() * i, behavior: 'smooth' });
        pauseThenResume();
      });
      dotsWrap.appendChild(dot);
      dots.push(dot);
    });

    if ('IntersectionObserver' in window) {
      var dotObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            var index = slides.indexOf(entry.target);
            dots.forEach(function (d, i) { d.classList.toggle('is-active', i === index); });
          }
        });
      }, { root: track, threshold: [0.6] });
      slides.forEach(function (s) { dotObserver.observe(s); });
    } else {
      dots[0].classList.add('is-active');
    }
  }

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  window.setInterval(function () {
    if (paused) return;
    var step = stepWidth();
    if (!step) return;
    var atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 10;
    track.scrollTo({ left: atEnd ? 0 : track.scrollLeft + step, behavior: 'smooth' });
  }, 3500);
});