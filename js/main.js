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

  // ── Interactive Robot VLA Task Planner Simulator ──
  initRobotSimulator();
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
  canvas.style.opacity = '1.0';

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
    // Clear canvas completely to keep text 100% sharp and readable (no alpha-trail smear)
    ctx.clearRect(0, 0, width, height);

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
        const factor = (120 - distance) / 120; // 0 to 1
        ctx.fillStyle = `rgba(34, 211, 238, ${0.3 + factor * 0.7})`;
        ctx.shadowColor = 'rgba(34, 211, 238, 0.8)';
        ctx.shadowBlur = 4;
      } else {
        // Regular falling term - very faint to avoid distracting but clear
        ctx.fillStyle = 'rgba(0, 255, 65, 0.08)';
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
      }

      ctx.fillText(text, x, y);

      // If the drop has reached the bottom of the screen, reset to top randomly
      if (y > height && Math.random() > 0.975) {
        drops[i] = 0;
        columnTerms[i] = terms[Math.floor(Math.random() * terms.length)];
      }

      // Move drops down at varying speeds
      drops[i] += 0.25;
    }

    requestAnimationFrame(draw);
  }

  // Start loop
  draw();
}

/* ────────────────────────────────────────────
   INTERACTIVE ROBOT VLA SIMULATOR
   ──────────────────────────────────────────── */
function initRobotSimulator() {
  const select = document.getElementById('robot-cmd-select');
  const runBtn = document.getElementById('run-robot-cmd');
  const output = document.getElementById('robot-terminal-output');
  if (!select || !runBtn || !output) return;

  const traces = {
    sort: [
      { text: 'root@apurva:~$ ./prompt_robot.sh --cmd "sort red cylinders"', color: 'var(--terminal-green)' },
      { text: '[AGENT] Parsing natural language intent...', color: 'var(--text-secondary)' },
      { text: '[LLM]   Generated task plan:\n  1. Scan workspace using OpenCV camera node\n  2. Filter red HSV range for cylinder centroids\n  3. Call /manipulator/trajectory planning service\n  4. Grasp with high gripper stiffness (cylinder)', color: 'var(--accent-cyan)' },
      { text: '[ROS2]  Starting shape detection node...', color: 'var(--text-secondary)' },
      { text: '[OPENCV] Found 3 red centroids at coordinates: X:[12, 14, 18], Y:[45, 46, 42]', color: 'var(--terminal-amber)' },
      { text: '[ROS2]  Computing arm inverse kinematics...', color: 'var(--text-secondary)' },
      { text: '[CONTROLLER] Publishing trajectories to joints...', color: 'var(--text-secondary)' },
      { text: '[ROS2]  Closing gripper. Stiffness set to 2.4 N/mm.', color: 'var(--text-secondary)' },
      { text: '[SUCCESS] All red cylinders successfully sorted. Connection closed.', color: 'var(--terminal-green)' }
    ],
    fragile: [
      { text: 'root@apurva:~$ ./prompt_robot.sh --cmd "grasp fragile block"', color: 'var(--terminal-green)' },
      { text: '[AGENT] Parsing natural language intent...', color: 'var(--text-secondary)' },
      { text: '[LLM]   Detected safety-critical keyword: "fragile"\n  1. Position arm above target block\n  2. Set Modular Magnetic Gripper to lowest stiffness (0.4 N/mm)\n  3. Execute slow, smooth trajectory (max accel: 0.1 rad/s^2)\n  4. Validate grasp via force feedback sensor', color: 'var(--accent-cyan)' },
      { text: '[ROS2]  Activating variable stiffness control service...', color: 'var(--text-secondary)' },
      { text: '[CANOPEN] Sending PDO to magnetic coil driver: SetCurrent=0.2A', color: 'var(--terminal-amber)' },
      { text: '[ROS2]  Stiffness adjusted to 0.4 N/mm (compliance enabled).', color: 'var(--text-secondary)' },
      { text: '[CONTROLLER] Executing compliant approach trajectory...', color: 'var(--text-secondary)' },
      { text: '[SENSORS] Force sensor: 0.8N threshold reached. Grasp stabilized.', color: 'var(--text-secondary)' },
      { text: '[SUCCESS] Fragile block stacked safely. Connection closed.', color: 'var(--terminal-green)' }
    ],
    navigate: [
      { text: 'root@apurva:~$ ./prompt_robot.sh --cmd "navigate quadrant 4"', color: 'var(--terminal-green)' },
      { text: '[AGENT] Parsing natural language intent...', color: 'var(--text-secondary)' },
      { text: '[LLM]   Generated navigation intent:\n  1. Query active map from SLAM node\n  2. Generate path planning path via hybrid A*\n  3. Engage driving controller loop (max speed: 1.5 m/s)\n  4. Track local dynamic obstacles using 2D LiDAR scans', color: 'var(--accent-cyan)' },
      { text: '[ROS2]  Calling path planner service...', color: 'var(--text-secondary)' },
      { text: '[PLANNER] Path generated successfully. Total length: 42.5m.', color: 'var(--text-secondary)' },
      { text: '[LIDAR] Scanning active quadrant. Dynamic obstacle detected at X:15.2, Y:12.4', color: 'var(--accent-red)' },
      { text: '[LLM]   Re-routing path: Generating avoidance trajectory...', color: 'var(--accent-cyan)' },
      { text: '[ESTIMATOR] Localization status: Kalman Filter covariance = 0.02 (Stable)', color: 'var(--terminal-amber)' },
      { text: '[SUCCESS] Reached target quadrant 4. Connection closed.', color: 'var(--terminal-green)' }
    ]
  };

  let typingTimeout;

  runBtn.addEventListener('click', () => {
    // Clear output and any existing timeout
    clearTimeout(typingTimeout);
    output.innerHTML = '';
    runBtn.disabled = true;

    const key = select.value;
    const lines = traces[key];
    let lineIdx = 0;

    function typeLine() {
      if (lineIdx < lines.length) {
        const line = lines[lineIdx];
        const p = document.createElement('div');
        p.style.color = line.color;
        // Check if there is newline
        if (line.text.includes('\n')) {
          p.style.whiteSpace = 'pre';
        }
        output.appendChild(p);

        // Type out text character by character
        let charIdx = 0;
        const text = line.text;

        function typeChar() {
          if (charIdx < text.length) {
            p.textContent += text[charIdx];
            charIdx++;
            output.scrollTop = output.scrollHeight;
            typingTimeout = setTimeout(typeChar, 8); // fast typing speed
          } else {
            lineIdx++;
            output.scrollTop = output.scrollHeight;
            typingTimeout = setTimeout(typeLine, 250); // delay between lines
          }
        }

        typeChar();
      } else {
        runBtn.disabled = false;
      }
    }

    typeLine();
  });
}