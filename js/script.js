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
  var megaToggle = document.getElementById('mega-toggle');
  var megaColToggles = document.querySelectorAll('.mega-col-toggle');
  var megaItem   = document.querySelector('.has-mega');
  var megaTrigger = megaItem && megaItem.querySelector('.mega-trigger');

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
    // Collapse the Services accordion too, otherwise it stays expanded
    // behind a closed drawer and reappears pre-opened on the next tap.
    if (megaToggle) megaToggle.checked = false;
    // Same for the per-category accordions nested inside it.
    Array.prototype.forEach.call(megaColToggles, function (t) { t.checked = false; });
    if (megaItem) megaItem.classList.remove('is-open');
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
    link.addEventListener('click', function () {
      // The Services trigger manages its own open state (section 1b);
      // letting closeMenu run here would cancel the click that opened it.
      if (link.classList.contains('mega-trigger')) return;
      closeMenu();
    });
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
     1b. Services mega-menu: click to keep it open
     Hover alone dismissed the panel as soon as the pointer left the
     trigger, which made the links inside hard to reach. Clicking now
     latches it open until you click away, press Escape, or click the
     trigger again. Hover still opens it, and with JS off the trigger
     stays an ordinary link to the services section.
     --------------------------------------------------------------- */
  if (megaItem && megaTrigger) {
    megaTrigger.addEventListener('click', function (e) {
      // Below 1025px the panel is the checkbox accordion, so leave the
      // link alone and let it navigate.
      if (!desktopQuery.matches) return;
      e.preventDefault();
      megaItem.classList.toggle('is-open');
    });

    // Any click outside the menu dismisses it.
    document.addEventListener('click', function (e) {
      if (!megaItem.contains(e.target)) megaItem.classList.remove('is-open');
    });
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
  var groupSelectors = '.card-grid, .pillars, .process-track, .vm-grid, .check-grid, .svc-benefit-grid, .contact-grid, .svc-faq';
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

/* =================================================================
   RAYLA DIGITAL AGENCY — Captcha bridge
   hCaptcha runs in *invisible* mode here. The visible checkbox widget
   anchors its image challenge to wherever the widget sits, which at the
   foot of a tall form opened the challenge half off the bottom-right of
   the screen; invisible mode draws the challenge as hCaptcha's own
   centred overlay instead, and the prompt the visitor sees is ours, so
   it matches the form panel rather than fighting it.

   Web3Forms only fills in the sitekey and then hands the container to
   hCaptcha's auto-render, which looks its callbacks up by *name* from
   the data-* attributes. So these have to be real globals, and they have
   to exist before hCaptcha's script runs — which is why this sits at the
   top level rather than inside a DOMContentLoaded block. script.js is a
   plain script at the end of <body>, so the markup is already parsed and
   the Web3Forms script that follows it has not run yet.

   Everything degrades quietly: if hCaptcha never loads, the form still
   validates and still sends.
   ================================================================= */
(function () {
  var verify = document.getElementById('dc-verify');
  var btn    = document.getElementById('dc-verify-btn');
  var label  = document.getElementById('dc-verify-label');
  var note   = document.getElementById('dc-verify-note');
  if (!verify || !btn) return;

  var FAIL_NOTE = 'We could not load the security check. Email hello@rayladigitalagency.com and we will pick it up from there.';
  var timer = null;

  // The note carries every state change, so it is what a screen reader should
  // announce. Set here rather than in the markup because the same block is
  // duplicated across seven pages.
  if (note) note.setAttribute('aria-live', 'polite');

  function setState(state, text, hint) {
    verify.setAttribute('data-state', state);
    if (label && text) label.textContent = text;
    if (note && hint) note.textContent = hint;
    btn.setAttribute('aria-disabled', state === 'done' ? 'true' : 'false');
  }
  function clearTimer() { if (timer) { window.clearTimeout(timer); timer = null; } }

  // Returns true if a challenge is actually under way, so the caller knows
  // whether to wait for a token or carry on without one.
  window.raylaCaptchaExecute = function () {
    if (verify.getAttribute('data-state') === 'done') return false;
    if (!window.hcaptcha || typeof window.hcaptcha.execute !== 'function') return false;
    setState('working', 'Checking…', 'Opening the security check…');
    clearTimer();
    // If the challenge never opens — blocked, offline, third party down — the
    // visitor would be left watching a spinner. Time it out and give them a way
    // to reach us anyway.
    timer = window.setTimeout(function () {
      if (verify.getAttribute('data-state') === 'working') setState('error', 'Check unavailable', FAIL_NOTE);
    }, 20000);
    try {
      window.hcaptcha.execute();
      return true;
    } catch (err) {
      clearTimer();
      setState('error', 'Check unavailable', FAIL_NOTE);
      return false;
    }
  };

  btn.addEventListener('click', function () {
    if (verify.getAttribute('data-state') === 'done') return;
    window.raylaCaptchaExecute();
  });

  window.raylaCaptchaVerified = function () {
    clearTimer();
    document.body.classList.remove('captcha-open');
    setState('done', 'Verified — thanks', 'You are good to go.');
    // Set by the submit handler when the visitor pressed send before ticking
    // the box: the send resumes the moment the token lands.
    if (typeof window.raylaCaptchaOnToken === 'function') window.raylaCaptchaOnToken();
  };
  window.raylaCaptchaExpired = function () {
    clearTimer();
    setState('idle', 'I\'m not a robot', 'That check expired — tap to confirm again.');
  };
  window.raylaCaptchaError = function () {
    clearTimer();
    setState('error', 'Check unavailable', FAIL_NOTE);
  };

  // hCaptcha draws the challenge as a fixed overlay over the page. Flagging it
  // on <body> is what dims the modal underneath (.captcha-open in style.css) so
  // the challenge reads as one layer on top of the form, and it lets the
  // modal's focus trap stand down while focus is inside hCaptcha's iframe.
  window.raylaCaptchaOpened = function () {
    clearTimer();
    document.body.classList.add('captcha-open');
    if (note) note.textContent = 'Finish the check to continue.';
  };
  window.raylaCaptchaClosed = function () {
    document.body.classList.remove('captcha-open');
    if (verify.getAttribute('data-state') === 'working') {
      setState('idle', 'I\'m not a robot', 'One quick check before this sends.');
    }
  };

  // form.reset() does not clear the widget — the old token would stay in the
  // DOM and be rejected as already-used on the next send.
  window.raylaCaptchaReset = function () {
    clearTimer();
    document.body.classList.remove('captcha-open');
    window.raylaCaptchaOnToken = null;
    setState('idle', 'I\'m not a robot', 'One quick check before this sends.');
    if (window.hcaptcha && typeof window.hcaptcha.reset === 'function') {
      try { window.hcaptcha.reset(); } catch (err) { /* widget not rendered yet */ }
    }
  };
}());

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
    // hCaptcha's challenge is an iframe inside the dialog; pulling focus back
    // to the first field mid-challenge would make it unusable.
    if (document.body.classList.contains('captcha-open')) return;
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
    if (e.key === 'Escape' && !document.body.classList.contains('captcha-open')) closeModal();
    else trapFocus(e);
  }

  function openModal() {
    formStep.hidden = false;
    successStep.hidden = true;
    dialog.classList.remove('is-success');
    if (form) {
      form.querySelectorAll('.has-error').forEach(function (el) { el.classList.remove('has-error'); });
      form.querySelectorAll('.field-error').forEach(function (el) { el.textContent = ''; });
      var formError = document.getElementById('dc-form-error');
      if (formError) formError.hidden = true;
    }
    if (window.raylaCaptchaReset) window.raylaCaptchaReset();
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
    document.body.classList.remove('captcha-open');
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

  var formError   = document.getElementById('dc-form-error');
  var submitBtn   = form.querySelector('button[type="submit"]');
  var submitLabel = (submitBtn && submitBtn.querySelector('.btn-submit-label')) || submitBtn;
  var submitText  = submitLabel ? submitLabel.textContent : 'Send';

  function fail(message) {
    if (!formError) return;
    formError.textContent = message;
    formError.hidden = false;
  }

  function showSuccess(nameVal) {
    successName.textContent = nameVal ? nameVal.split(' ')[0] : 'there';
    formStep.hidden = true;
    successStep.hidden = false;
    // The form is gone, so the dialog shrinks to a small card. It is centred by
    // margin:auto on a fixed inset:0 box, so a smaller box lands in the middle
    // of the viewport instead of leaving the message stranded at the top of a
    // tall panel.
    dialog.classList.add('is-success');
    dialog.scrollTop = 0;
    form.reset();
    if (window.raylaCaptchaReset) window.raylaCaptchaReset();
    var closeBtn = successStep.querySelector('[data-close-modal]');
    if (closeBtn) closeBtn.focus();
  }

  // Split out of the submit handler so the captcha callback can resume a send
  // that was paused waiting for a token.
  function sendForm() {
    var nameVal = form.querySelector('#dc-name').value.trim();
    document.getElementById('dc-subject').value = 'New website inquiry from ' + nameVal;

    submitBtn.disabled = true;
    // Only the label span is swapped, so the icon survives and the original
    // wording comes back afterwards rather than being replaced by a guess.
    submitLabel.textContent = 'Sending…';

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(form)
    })
      .then(function (res) { return res.json(); })
      .then(function (result) {
        if (result.success) showSuccess(nameVal);
        else fail('Something went wrong sending your request — please try again, or call us directly.');
      })
      .catch(function () {
        fail('Something went wrong sending your request — please try again, or call us directly.');
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitLabel.textContent = submitText;
      });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (formError) formError.hidden = true;

    var honeypot = form.querySelector('[name="botcheck"]');
    if (honeypot && honeypot.checked) return;

    var allValid = true;
    Object.keys(FIELD_RULES).forEach(function (id) {
      var input = form.querySelector('#' + id);
      if (input && !validateField(input)) allValid = false;
    });
    if (!allValid) return;

    // The widget is only a gate when it actually rendered. If hCaptcha failed to
    // load there is nothing to complete, and blocking the send would lose an
    // enquiry over a third party being down.
    var hCaptchaField = form.querySelector('textarea[name="h-captcha-response"]');
    if (hCaptchaField && !hCaptchaField.value) {
      // Not verified yet. Rather than bouncing the visitor back to tick a box,
      // run the check now and send the moment the token arrives.
      window.raylaCaptchaOnToken = function () {
        window.raylaCaptchaOnToken = null;
        sendForm();
      };
      if (window.raylaCaptchaExecute && window.raylaCaptchaExecute()) return;
      window.raylaCaptchaOnToken = null;
    }

    sendForm();
  });
}
});

/* =================================================================
   RAYLA DIGITAL AGENCY — Carousels
   There are two on the page now (Areas of Expertise, Our Values), so
   this binds per .carousel-track-wrap instead of reaching for the
   first one on the page — with a single shared handler the second
   carousel's arrows would have driven the first one's track.
   Auto-advance is opt-in via data-autoplay on the track: the values
   carousel cycles itself, the expertise row only moves when the
   reader moves it.
   ================================================================= */
document.addEventListener('DOMContentLoaded', function () {

  function initCarousel(wrap) {
    var track = wrap.querySelector('.carousel-track');
    if (!track) return; // defensive: a wrap with no track is markup mid-edit

    // The dots sit outside .carousel-track-wrap, so they cannot be found by
    // descending from it. The track names its own dots container instead of the
    // id being derived from the track's - deriving it is the kind of link that
    // breaks silently the first time an id is renamed.
    var dotsId = track.getAttribute('data-dots');
    var dotsWrap = dotsId ? document.getElementById(dotsId) : null;
    var slides = Array.prototype.slice.call(track.children);
    // Arrows normally overlay the track and live inside the wrap. The expertise
    // row lifts them into its section head instead, so the track can name the
    // container holding them - same hook as data-dots above, for the same
    // reason: an id derived from the track's would break silently on rename.
    var navId = track.getAttribute('data-nav');
    var navWrap = (navId && document.getElementById(navId)) || wrap;
    var prevBtn = navWrap.querySelector('.carousel-arrow-prev');
    var nextBtn = navWrap.querySelector('.carousel-arrow-next');

    var paused = false;
    var direction = 1;
    track.addEventListener('mouseenter', function () { paused = true; });
    track.addEventListener('mouseleave', function () { paused = false; });
    track.addEventListener('touchstart', function () { paused = true; }, { passive: true });
    track.addEventListener('touchend', function () {
      window.setTimeout(function () { paused = false; }, 2000);
    }, { passive: true });

    function stepWidth() {
      var slide = track.children[0];
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

    // Everything above is manual control and stays on regardless. Only the
    // self-advancing part is opt-in, and it is skipped outright for anyone who
    // has asked for less motion.
    if (!track.hasAttribute('data-autoplay')) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    window.setInterval(function () {
      if (paused) return;
      var step = stepWidth();
      if (!step) return;
      var max = track.scrollWidth - track.clientWidth;
      if (track.scrollLeft >= max - 10) direction = -1;
      if (track.scrollLeft <= 10) direction = 1;
      track.scrollTo({ left: track.scrollLeft + step * direction, behavior: 'smooth' });
    }, 3500);
  }

  Array.prototype.forEach.call(
    document.querySelectorAll('.carousel-track-wrap'),
    initCarousel
  );
});
