// ═══════════════════════════════════════════════════════
//  GREG LOCQUIANO — PIXEL PORTFOLIO SCRIPTS
// ═══════════════════════════════════════════════════════

// ── NAV ───────────────────────────────────────────────
const nav = document.getElementById("nav");
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");
window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 40);
});
hamburger.addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks
  .querySelectorAll("a")
  .forEach((a) =>
    a.addEventListener("click", () => navLinks.classList.remove("open")),
  );

// ── SCROLL REVEAL ──────────────────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
);

// ── SKILL BAR ANIMATION on scroll ─────────────────────
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        skillObserver.unobserve(e.target);
      }
    });
  },
  { threshold: 0.3 },
);

// ── REUSABLE REVEAL/STAGGER ATTACHMENT ─────────────────
// Re-runnable so dynamically-rendered (JSON-driven) sections get the same
// scroll-reveal + skill-bar-fill animations as static markup. Safe to call
// repeatedly: observing an already-observed element is a no-op.
function applyReveals(scope) {
  const root = scope || document;
  root
    .querySelectorAll(".reveal,.reveal-left,.reveal-right,.skill-cat")
    .forEach((el) => revealObserver.observe(el));
  root.querySelectorAll(".reveal").forEach((el, i) => {
    if (!el.style.transitionDelay) {
      el.style.transitionDelay = (i % 6) * 0.07 + "s";
    }
  });
  root
    .querySelectorAll(".skill-cat")
    .forEach((el) => skillObserver.observe(el));
}
window.applyReveals = applyReveals;
applyReveals(document);

// ── HERO CANVAS ───────────────────────────────────────
(function initHero() {
  const canvas = document.getElementById("hero-canvas");
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  let W,
    H,
    t = 0;

  const PIXEL = 4; // each "game pixel" = 4 real pixels

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  // Clouds
  const clouds = Array.from({ length: 8 }, (_, i) => ({
    x: Math.random() * 1000,
    y: 40 + Math.random() * 120,
    w: 60 + Math.random() * 80,
    speed: 0.3 + Math.random() * 0.4,
  }));

  // Stars
  const stars = Array.from({ length: 60 }, () => ({
    x: Math.random(),
    y: Math.random() * 0.6,
    b: Math.random(),
    phase: Math.random() * Math.PI * 2,
  }));

  // Buildings
  const buildings = [
    { x: 0.05, w: 0.06, h: 0.35, c: "#0c1020" },
    { x: 0.12, w: 0.04, h: 0.28, c: "#0e1428" },
    { x: 0.18, w: 0.08, h: 0.42, c: "#0a0e1e" },
    { x: 0.27, w: 0.05, h: 0.32, c: "#0c1022" },
    { x: 0.33, w: 0.07, h: 0.48, c: "#080d1a" },
    { x: 0.42, w: 0.04, h: 0.25, c: "#0e1530" },
    { x: 0.48, w: 0.09, h: 0.55, c: "#090e1c" },
    { x: 0.58, w: 0.06, h: 0.36, c: "#0b1124" },
    { x: 0.65, w: 0.05, h: 0.3, c: "#0d1428" },
    { x: 0.72, w: 0.08, h: 0.44, c: "#080c18" },
    { x: 0.81, w: 0.05, h: 0.38, c: "#0c1020" },
    { x: 0.88, w: 0.07, h: 0.5, c: "#0a0e1e" },
    { x: 0.96, w: 0.05, h: 0.28, c: "#0e1428" },
  ];

  function drawPixelRect(x, y, w, h, color) {
    const px = Math.round(x / PIXEL) * PIXEL;
    const py = Math.round(y / PIXEL) * PIXEL;
    const pw = Math.round(w / PIXEL) * PIXEL;
    const ph = Math.round(h / PIXEL) * PIXEL;
    ctx.fillStyle = color;
    ctx.fillRect(px, py, pw, ph);
  }

  function loop() {
    t += 0.5;
    ctx.clearRect(0, 0, W, H);

    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, "#050810");
    sky.addColorStop(0.6, "#0a0f20");
    sky.addColorStop(1, "#101830");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // Stars
    stars.forEach((s) => {
      const blink = 0.4 + 0.6 * Math.abs(Math.sin(t * 0.02 + s.phase));
      const px = Math.round((s.x * W) / PIXEL) * PIXEL;
      const py = Math.round((s.y * H) / PIXEL) * PIXEL;
      ctx.fillStyle = `rgba(200,220,255,${blink * 0.8})`;
      ctx.fillRect(px, py, PIXEL, PIXEL);
    });

    // Moon
    const moonX = Math.round((W * 0.82) / PIXEL) * PIXEL;
    const moonY = Math.round((H * 0.12) / PIXEL) * PIXEL;
    const moonR = 24;
    ctx.fillStyle = "#d0c080";
    for (let dy = -moonR; dy <= moonR; dy += PIXEL) {
      for (let dx = -moonR; dx <= moonR; dx += PIXEL) {
        if (dx * dx + dy * dy <= moonR * moonR) {
          ctx.fillRect(
            moonX + Math.round(dx / PIXEL) * PIXEL,
            moonY + Math.round(dy / PIXEL) * PIXEL,
            PIXEL,
            PIXEL,
          );
        }
      }
    }
    ctx.fillStyle = "#080c18";
    for (let dy = -moonR; dy <= moonR; dy += PIXEL) {
      for (let dx = -moonR + 8; dx <= moonR + 8; dx += PIXEL) {
        if (dx * dx + dy * dy <= moonR * moonR) {
          ctx.fillRect(
            moonX + Math.round(dx / PIXEL) * PIXEL,
            moonY + Math.round(dy / PIXEL) * PIXEL,
            PIXEL,
            PIXEL,
          );
        }
      }
    }

    // Clouds
    clouds.forEach((c) => {
      c.x = (c.x + c.speed) % (W + c.w * 6);
      const cx = Math.round(c.x / PIXEL) * PIXEL;
      const cy = Math.round(c.y / PIXEL) * PIXEL;
      const cw = Math.round(c.w / PIXEL) * PIXEL;
      ctx.fillStyle = "rgba(30,40,80,0.6)";
      ctx.fillRect(cx, cy, cw, PIXEL * 3);
      ctx.fillRect(cx + PIXEL * 2, cy - PIXEL * 2, cw - PIXEL * 4, PIXEL * 2);
      ctx.fillRect(cx + PIXEL * 4, cy - PIXEL * 4, cw - PIXEL * 8, PIXEL * 2);
    });

    // Buildings
    buildings.forEach((b) => {
      const bx = Math.round((b.x * W) / PIXEL) * PIXEL;
      const bh = Math.round((b.h * H) / PIXEL) * PIXEL;
      const bw = Math.round((b.w * W) / PIXEL) * PIXEL;
      const by = H - bh;
      ctx.fillStyle = b.c;
      ctx.fillRect(bx, by, bw, bh);
      // Windows
      for (let wy = by + 8; wy < H - 12; wy += 16) {
        for (let wx = bx + 4; wx < bx + bw - 8; wx += 12) {
          if (Math.sin(wx * 0.3 + wy * 0.5 + t * 0.002) > 0.1) {
            ctx.fillStyle =
              Math.random() > 0.998 ? "#ff8800" : "rgba(200,180,80,0.25)";
            ctx.fillRect(
              Math.round(wx / PIXEL) * PIXEL,
              Math.round(wy / PIXEL) * PIXEL,
              PIXEL * 2,
              PIXEL * 2,
            );
          }
        }
      }
    });

    // Ground
    const groundY = Math.round((H - 32) / PIXEL) * PIXEL;
    ctx.fillStyle = "#060a14";
    ctx.fillRect(0, groundY, W, H - groundY);
    ctx.fillStyle = "#0a1020";
    ctx.fillRect(0, groundY, W, PIXEL * 2);

    // Ground glow / reflection
    const glow = ctx.createLinearGradient(0, groundY, 0, H);
    glow.addColorStop(0, "rgba(74,144,226,0.08)");
    glow.addColorStop(1, "transparent");
    ctx.fillStyle = glow;
    ctx.fillRect(0, groundY, W, H - groundY);

    requestAnimationFrame(loop);
  }
  loop();
})();

// ── AVATAR CANVAS ─────────────────────────────────────
(function initAvatar() {
  const c = document.getElementById("avatar-canvas");
  const ctx = c.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  let t = 0;
  function draw() {
    t++;
    ctx.clearRect(0, 0, 120, 120);
    const bob = Math.sin(t * 0.04) * 1.5;

    // Background
    ctx.fillStyle = "#0c0f1c";
    ctx.fillRect(0, 0, 120, 120);
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(4, 4, 112, 112);

    // Border glow
    ctx.strokeStyle = `rgba(240,192,64,${0.3 + 0.2 * Math.abs(Math.sin(t * 0.03))})`;
    ctx.lineWidth = 2;
    ctx.strokeRect(4, 4, 112, 112);

    const S = 4; // pixel size
    const ox = 28,
      oy = 18 + bob;

    // Shadow
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.fillRect(ox + 8, oy + 58, 48, 8);

    // Legs
    ctx.fillStyle = "#2244aa";
    ctx.fillRect(ox + 12, oy + 44, 12, 16);
    ctx.fillRect(ox + 32, oy + 44, 12, 16);
    ctx.fillStyle = "#442200";
    ctx.fillRect(ox + 10, oy + 58, 14, 8);
    ctx.fillRect(ox + 30, oy + 58, 14, 8);

    // Body
    ctx.fillStyle = "#f0c040";
    ctx.fillRect(ox + 8, oy + 24, 48, 24);

    // Arms (animated)
    const armSwing = Math.sin(t * 0.04) * 3;
    ctx.fillStyle = "#f0c040";
    ctx.fillRect(ox, oy + 26 + armSwing, 10, 20);
    ctx.fillRect(ox + 54, oy + 26 - armSwing, 10, 20);

    // Head
    ctx.fillStyle = "#c8903c";
    ctx.fillRect(ox + 16, oy + 4, 32, 24);
    ctx.fillStyle = "#3a1a00";
    ctx.fillRect(ox + 16, oy + 4, 32, 8);
    // Eyes
    const blink = t % 90 < 6 ? 1 : 0;
    ctx.fillStyle = "#fff";
    if (!blink) {
      ctx.fillRect(ox + 22, oy + 16, S, S);
      ctx.fillRect(ox + 36, oy + 16, S, S);
      ctx.fillStyle = "#222";
      ctx.fillRect(ox + 22, oy + 18, S, 2);
      ctx.fillRect(ox + 36, oy + 18, S, 2);
    } else {
      ctx.fillRect(ox + 22, oy + 18, 8, 2);
      ctx.fillRect(ox + 36, oy + 18, 8, 2);
    }
    // Smile
    ctx.fillStyle = "#3a1a00";
    ctx.fillRect(ox + 26, oy + 24, 12, 2);

    requestAnimationFrame(draw);
  }
  draw();
})();

// ── PROJECT CANVASES ──────────────────────────────────
function initProjectCanvas(id, hue, label, lines) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  let t = 0;
  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  let ro = new ResizeObserver(resize);
  ro.observe(canvas.parentElement);

  function draw() {
    t++;
    const W = canvas.width,
      H = canvas.height;
    if (!W || !H) {
      requestAnimationFrame(draw);
      return;
    }
    ctx.clearRect(0, 0, W, H);

    // BG
    ctx.fillStyle = "#08090f";
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = `hsla(${hue},60%,30%,0.15)`;
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 0; y < H; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    // Animated dots
    for (let i = 0; i < 6; i++) {
      const x = W * (0.15 + i * 0.13);
      const y = H * 0.5 + Math.sin(t * 0.03 + i) * H * 0.2;
      ctx.fillStyle = `hsla(${hue + i * 20},80%,60%,0.5)`;
      ctx.fillRect(Math.round(x / 4) * 4, Math.round(y / 4) * 4, 4, 4);
    }

    // Label
    ctx.fillStyle = `hsla(${hue},70%,65%,0.9)`;
    ctx.font = `bold ${Math.max(8, W * 0.04)}px "Press Start 2P"`;
    ctx.textAlign = "center";
    ctx.fillText(label, W / 2, H * 0.38);

    // Lines / code
    ctx.font = `${Math.max(10, W * 0.045)}px "VT323"`;
    ctx.fillStyle = `hsla(${hue},40%,60%,0.5)`;
    lines.forEach((l, i) => {
      ctx.fillText(l, W / 2, H * 0.55 + i * Math.max(14, H * 0.1));
    });

    // Scanlines
    for (let y = 0; y < H; y += 4) {
      ctx.fillStyle = "rgba(0,0,0,0.06)";
      ctx.fillRect(0, y, W, 2);
    }

    requestAnimationFrame(draw);
  }
  draw();
}
// initProjectCanvas() calls now happen in js/data-loader.js once projects.json
// has been fetched and the card markup (with its canvas element) is rendered.
window.initProjectCanvas = initProjectCanvas;

// ── PARTICLES ─────────────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById("particles-canvas");
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  let W, H;
  const particles = [];
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  // Spawn initial
  for (let i = 0; i < 30; i++) {
    particles.push({
      x: Math.random() * 1000,
      y: Math.random() * 800,
      vy: -(0.2 + Math.random() * 0.5),
      vx: (Math.random() - 0.5) * 0.2,
      life: Math.random(),
      maxLife: 0.6 + Math.random() * 0.4,
      hue: Math.random() > 0.5 ? 45 : 190,
      size: Math.random() > 0.7 ? 4 : 2,
    });
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    // Add new
    if (Math.random() < 0.15 && particles.length < 50) {
      particles.push({
        x: Math.random() * W,
        y: H + 4,
        vy: -(0.3 + Math.random() * 0.6),
        vx: (Math.random() - 0.5) * 0.3,
        life: 0,
        maxLife: 0.5 + Math.random() * 0.5,
        hue: Math.random() > 0.5 ? 45 : 190,
        size: Math.random() > 0.7 ? 4 : 2,
      });
    }
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life += 0.003;
      if (p.life > p.maxLife || p.y < -8) {
        particles.splice(i, 1);
        continue;
      }
      const alpha = Math.sin((p.life / p.maxLife) * Math.PI) * 0.7;
      ctx.fillStyle = `hsla(${p.hue},80%,65%,${alpha})`;
      ctx.fillRect(
        Math.round(p.x / p.size) * p.size,
        Math.round(p.y / p.size) * p.size,
        p.size,
        p.size,
      );
    }
    requestAnimationFrame(loop);
  }
  loop();
})();

// ── TERMINAL ──────────────────────────────────────────
(function initTerminal() {
  const output = document.getElementById("t-output");
  const input = document.getElementById("t-input");

  const COMMANDS = {
    help: () => [
      { text: "Available commands:", cls: "highlight" },
      { text: "  whoami     about Greg" },
      { text: "  skills     technical skills" },
      { text: "  projects   list of projects" },
      { text: "  contact    contact information" },
      { text: "  github     open GitHub profile" },
      { text: "  clear      clear terminal" },
      { text: "", cls: "blank" },
    ],
    whoami: () => [
      { text: "Greg Patrick Locquiano", cls: "highlight" },
      { text: "Full-Stack Developer · BSIS Student @ CNSC" },
      { text: "Bicol, Philippines · github.com/Locquiano101" },
      { text: "Specializing in MERN Stack + Ubuntu Server", cls: "dim" },
      { text: "", cls: "blank" },
    ],
    skills: () => [
      { text: "Technical Skills:", cls: "highlight" },
      { text: "  Frontend:  React.js, HTML5, CSS3, JavaScript" },
      { text: "  Backend:   Node.js, Express.js, PHP" },
      { text: "  Database:  MongoDB, MySQL, SQL" },
      { text: "  Server:    Ubuntu Server, Linux, SSH" },
      { text: "  Tools:     Git, GitHub, VS Code" },
      {
        text: "  Stack:     MERN (MongoDB+Express+React+Node)",
        cls: "dim",
      },
      { text: "", cls: "blank" },
    ],
    projects: () => [
      { text: "Projects:", cls: "highlight" },
      { text: "  [1] CnscCodexMain (MERN Stack)" },
      { text: "      Multi-office platform for CNSC", cls: "dim" },
      { text: "  [2] ToDoEase (PHP + MySQL)" },
      { text: "      Role-based multi-user task manager", cls: "dim" },
      { text: "  [3] CNPENRO-FTSMS (HTML/JS/CSS)" },
      { text: "      Government file tracking system", cls: "dim" },
      { text: "", cls: "blank" },
    ],
    contact: () => [
      { text: "Contact Information:", cls: "highlight" },
      { text: "  Email:  Locquianopatrickgreg@gmail.com" },
      { text: "  Phone:  +63 961 215 7709" },
      { text: "  GitHub: github.com/Locquiano101" },
      { text: "  Region: Bicol, Philippines", cls: "dim" },
      { text: "", cls: "blank" },
    ],
    github: () => {
      window.open("https://github.com/Locquiano101", "_blank");
      return [
        { text: "Opening GitHub profile...", cls: "highlight" },
        { text: "", cls: "blank" },
      ];
    },
    clear: () => {
      output.innerHTML = "";
      return [];
    },
  };

  let typeQueue = [];
  let isTyping = false;

  function addLine(text, cls = "output") {
    const div = document.createElement("div");
    div.className = `t-line ${cls}`;
    div.textContent = text;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
  }

  function typeLines(lines, idx = 0) {
    if (idx >= lines.length) {
      isTyping = false;
      return;
    }
    const line = lines[idx];
    setTimeout(
      () => {
        addLine(line.text, line.cls ? `output ${line.cls}` : "output");
        typeLines(lines, idx + 1);
      },
      30 + idx * 25,
    );
  }

  function runCommand(cmd) {
    addLine(`greg@devtown:~$ ${cmd}`, "prompt");
    const fn = COMMANDS[cmd.trim().toLowerCase()];
    if (fn) {
      const result = fn();
      if (result && result.length) typeLines(result);
    } else if (cmd.trim()) {
      typeLines([
        {
          text: `bash: ${cmd}: command not found. Try 'help'`,
          cls: "error",
        },
        { text: "", cls: "blank" },
      ]);
    }
  }

  // Boot sequence
  setTimeout(() => {
    typeLines([
      { text: "GREG'S DEV TERMINAL v2.0.0", cls: "highlight" },
      { text: "Connected to: devtown.local", cls: "dim" },
      { text: "─────────────────────────────────", cls: "dim" },
      { text: "Type 'help' for available commands.", cls: "" },
      { text: "", cls: "blank" },
    ]);
  }, 800);

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const val = input.value;
      input.value = "";
      runCommand(val);
    }
    e.stopPropagation();
  });

  document.querySelectorAll(".t-shortcut").forEach((btn) => {
    btn.addEventListener("click", () => {
      runCommand(btn.dataset.cmd);
      input.focus();
    });
  });
})();

// (skill-bar reveal-on-scroll is now handled by the consolidated
// applyReveals()/skillObserver setup near the top of this file)
