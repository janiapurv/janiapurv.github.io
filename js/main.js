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

  // ── Interactive Matrix Rain Background ──
  initInteractiveMatrixRain();
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

/* ────────────────────────────────────────────
   INTERACTIVE TERMINAL MATRIX RAIN BACKGROUND
   ──────────────────────────────────────────── */
function initInteractiveMatrixRain() {
  const canvas = document.createElement('canvas');
  canvas.id = 'terminal-canvas';
  document.body.appendChild(canvas);

  // Apply basic styles dynamically (also backstopped in CSS)
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.zIndex = '0';
  canvas.style.pointerEvents = 'none';
  canvas.style.opacity = '0.12';

  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  // Robotics, controls, and mechatronics terms
  const terms = [
    '0', '1', 'ROS2', 'C++', 'Python', 'LiDAR', 'Kalman', 'ParticleFilter', 'PID', 
    'x', 'y', 'z', 'theta', 'omega', 'tau', 'u', 'e', 'dt', 'matrix', 'swarm', 
    'state', 'dynamics', 'trajectory', 'jacobian', 'kinematics', 'imu', 'canopen', 
    'estimation', 'planning', 'controller', 'odometry', 'slam', 'gazebo', 'robot'
  ];

  const fontSize = 13;
  let columns = Math.floor(width / 22); // space out columns slightly

  // Array of drops - one per column, initialized at random offscreen coordinates
  const drops = [];
  const columnTerms = []; // Store which term is currently falling in this column
  
  for (let i = 0; i < columns; i++) {
    drops[i] = Math.random() * -100; // start off-screen
    columnTerms[i] = terms[Math.floor(Math.random() * terms.length)];
  }

  // Mouse tracking
  let mouseX = -1000;
  let mouseY = -1000;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouseX = -1000;
    mouseY = -1000;
  });

  // Handle window resizing
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    columns = Math.floor(width / 22);
    
    // Re-initialize arrays for new width
    drops.length = 0;
    columnTerms.length = 0;
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
      columnTerms[i] = terms[Math.floor(Math.random() * terms.length)];
    }
  });

  function draw() {
    // Faint overlay to create trail effect
    ctx.fillStyle = 'rgba(10, 14, 23, 0.08)';
    ctx.fillRect(0, 0, width, height);

    ctx.font = fontSize + 'px "JetBrains Mono", monospace';

    for (let i = 0; i < columns; i++) {
      const text = columnTerms[i];
      const x = i * 22;
      const y = drops[i] * fontSize;

      // Calculate distance to mouse cursor
      const dx = x - mouseX;
      const dy = y - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Flashlight interactivity: characters close to the mouse light up in glowing cyan
      if (distance < 120) {
        // Bright green/cyan glow near the mouse
        const factor = (120 - distance) / 120; // 0 to 1
        ctx.fillStyle = `rgba(34, 211, 238, ${0.15 + factor * 0.7})`;
        ctx.shadowColor = 'var(--accent-cyan)';
        ctx.shadowBlur = 8;
      } else {
        // Regular falling term
        ctx.fillStyle = 'rgba(0, 255, 65, 0.25)';
        ctx.shadowBlur = 0;
      }

      ctx.fillText(text, x, y);

      // If the drop has reached the bottom of the screen, reset to top randomly
      if (y > height && Math.random() > 0.975) {
        drops[i] = 0;
        columnTerms[i] = terms[Math.floor(Math.random() * terms.length)];
      }

      // Move drops down at varying speeds
      drops[i] += 0.8;
    }

    requestAnimationFrame(draw);
  }

  // Start loop
  draw();
}