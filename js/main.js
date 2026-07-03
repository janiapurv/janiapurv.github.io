/* ============================================
   MAIN.JS — Boot Sequence, Nav, Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ── Boot Sequence ──
  initBootSequence();

  // ── Navigation ──
  initNavigation();

  // ── Scroll Effects ──
  initScrollEffects();

  // ── Fade-In Observer ──
  initFadeInObserver();
});

/* ────────────────────────────────────────────
   BOOT SEQUENCE
   ──────────────────────────────────────────── */
function initBootSequence() {
  const overlay = document.getElementById('boot-overlay');
  if (!overlay) return;

  const lines = overlay.querySelectorAll('.boot-line');
  if (lines.length === 0) {
    overlay.classList.add('hidden');
    return;
  }

  // Check if user has already seen boot this session
  if (sessionStorage.getItem('boot-seen')) {
    overlay.classList.add('hidden');
    return;
  }

  let delay = 300;
  lines.forEach((line, i) => {
    const lineDelay = delay + i * 400;
    setTimeout(() => {
      line.classList.add('visible');
    }, lineDelay);
  });

  // Fade out overlay after all lines
  const totalTime = delay + lines.length * 400 + 800;
  setTimeout(() => {
    overlay.classList.add('hidden');
    sessionStorage.setItem('boot-seen', 'true');
  }, totalTime);
}

/* ────────────────────────────────────────────
   NAVIGATION
   ──────────────────────────────────────────── */
function initNavigation() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      }
    });
  }
}

/* ────────────────────────────────────────────
   SCROLL EFFECTS
   ──────────────────────────────────────────── */
function initScrollEffects() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 20) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  });
}

/* ────────────────────────────────────────────
   INTERSECTION OBSERVER — Fade In
   ──────────────────────────────────────────── */
function initFadeInObserver() {
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  fadeEls.forEach(el => observer.observe(el));
}

/* ────────────────────────────────────────────
   CONTACT FORM (used by contact.html)
   ──────────────────────────────────────────── */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const statusEl = document.getElementById('form-status');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        statusEl.className = 'form-status success';
        statusEl.textContent = '✓ Message delivered. Connection closed.';
        form.reset();
      } else {
        throw new Error('Server error');
      }
    } catch (err) {
      statusEl.className = 'form-status error';
      statusEl.textContent = '✗ Connection refused. Try again.';
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}