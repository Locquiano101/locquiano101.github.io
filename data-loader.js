// ═══════════════════════════════════════════════════════
//  JSON-DRIVEN CONTENT LOADER
//  Fetches /data/*.json and renders: skills, projects,
//  achievements, GitHub analytics, certificates, testimonials.
//  Runs after script.js (which defines applyReveals() and
//  initProjectCanvas() and exposes them on window).
// ═══════════════════════════════════════════════════════

(function () {
  "use strict";

  function escapeHTML(str) {
    return String(str ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  }

  // fetchJSON now reports *why* something is missing, instead of
  // collapsing "network/HTTP error" and "file just has no data" into
  // the same null. That distinction is what lets the empty state
  // give a useful message instead of a generic "no data" shrug.
  async function fetchJSON(path) {
    try {
      const res = await fetch(path, { cache: "no-cache" });
      if (!res.ok) {
        return { ok: false, error: `HTTP ${res.status}`, data: null };
      }
      const data = await res.json();
      return { ok: true, error: null, data };
    } catch (err) {
      console.error("[data-loader]", path, err);
      const isParseError = err instanceof SyntaxError;
      return {
        ok: false,
        error: isParseError ? "Malformed JSON" : "Network error",
        data: null,
      };
    }
  }

  // ── SKILLS ────────────────────────────────────────────
  function renderSkills(skills) {
    const grid = document.getElementById("skills-grid");
    if (!grid || !skills) return;
    grid.innerHTML = skills
      .map(
        (cat) => `
      <div class="skill-cat reveal">
        <div class="skill-cat-icon">${escapeHTML(cat.icon)}</div>
        <div class="skill-cat-name">${escapeHTML(cat.name)}</div>
        <div class="skill-bars">
          ${cat.bars
            .map(
              (bar) => `
            <div class="skill-bar-item">
              <div class="skill-bar-label">${escapeHTML(bar.label)}<span>${bar.pct}%</span></div>
              <div class="skill-bar-track">
                <div class="skill-bar-fill ${escapeHTML(bar.fill)}" style="--w: ${bar.pct}%"></div>
              </div>
            </div>`,
            )
            .join("")}
        </div>
        <div class="skill-tags">
          ${cat.tags.map((t) => `<span class="skill-tag">${escapeHTML(t)}</span>`).join("")}
        </div>
      </div>`,
      )
      .join("");
  }

  // ── PROJECTS ──────────────────────────────────────────
  function renderProjects(data) {
    const featuredMount = document.getElementById("project-featured-mount");
    const cardsMount = document.getElementById("projects-cards-mount");
    if (!data) return;

    if (featuredMount && data.featured) {
      const f = data.featured;
      featuredMount.innerHTML = `
        <div class="project-preview">
          <canvas id="${escapeHTML(f.canvas.id)}"></canvas>
        </div>
        <div class="project-info">
          <div class="project-num">${escapeHTML(f.num)}</div>
          <div class="project-name">${escapeHTML(f.name)}</div>
          <div class="project-desc">${escapeHTML(f.desc)}</div>
          <div class="project-stack">
            ${f.stack.map((s) => `<span class="stack-badge">${escapeHTML(s)}</span>`).join("")}
          </div>
          <div class="project-links">
            <a href="${escapeHTML(f.github)}" target="_blank" rel="noopener" class="btn" style="font-size: 8px">🐙 GITHUB</a>
          </div>
        </div>`;
      window.initProjectCanvas?.(
        f.canvas.id,
        f.canvas.seed,
        f.canvas.label,
        f.canvas.lines,
      );
    }

    if (cardsMount && Array.isArray(data.cards)) {
      cardsMount.innerHTML = data.cards
        .map(
          (p) => `
        <div class="project-card reveal">
          <div class="project-card-preview">
            <canvas id="${escapeHTML(p.canvas.id)}" style="width: 100%; height: 100%; display: block"></canvas>
          </div>
          <div class="project-card-body">
            <div class="project-num" style="font-family: var(--pixel); font-size: 7px; color: var(--muted); margin-bottom: 6px;">${escapeHTML(p.num)}</div>
            <div class="project-card-name">${escapeHTML(p.name)}</div>
            <div class="project-card-desc">${escapeHTML(p.desc)}</div>
            <div class="project-card-stack">
              ${p.stack.map((s) => `<span class="stack-badge">${escapeHTML(s)}</span>`).join("")}
            </div>
            <div class="project-card-links">
              <a href="${escapeHTML(p.github)}" target="_blank" rel="noopener" class="btn btn-secondary" style="font-size: 7px">🐙 GITHUB</a>
            </div>
          </div>
        </div>`,
        )
        .join("");
      data.cards.forEach((p) =>
        window.initProjectCanvas?.(
          p.canvas.id,
          p.canvas.seed,
          p.canvas.label,
          p.canvas.lines,
        ),
      );
    }
  }

  // ── ACHIEVEMENTS ──────────────────────────────────────
  function renderAchievements(items) {
    const grid = document.getElementById("achievements-grid");
    if (!grid || !items) return;
    grid.innerHTML = items
      .map(
        (a) => `
      <div class="badge-card reveal">
        <div class="badge-icon">${escapeHTML(a.icon)}</div>
        <div class="badge-name">${escapeHTML(a.name)}</div>
        <div class="badge-desc">${escapeHTML(a.desc)}</div>
        <div class="badge-year">${escapeHTML(a.year)}</div>
      </div>`,
      )
      .join("");
  }

  // ── GITHUB ANALYTICS ──────────────────────────────────
  function renderGithub(data) {
    const grid = document.getElementById("github-grid");
    if (!grid || !data) return;
    grid.innerHTML = data.widgets
      .map(
        (w) => `
      <div class="github-card reveal ${w.span === "full" ? "github-card-full" : ""}">
        <div class="github-card-title">${escapeHTML(w.title)}</div>
        <div class="github-card-desc">${escapeHTML(w.desc)}</div>
        <div class="github-card-imgwrap">
          <img
            src="${escapeHTML(w.url)}"
            alt="${escapeHTML(w.alt)}"
            loading="lazy"
            decoding="async"
            onerror="this.closest('.github-card-imgwrap').classList.add('img-error')"
          />
        </div>
      </div>`,
      )
      .join("");

    const link = document.getElementById("github-profile-link");
    if (link && data.profileUrl) link.href = data.profileUrl;
  }

  // ── CERTIFICATES ──────────────────────────────────────
  function renderCertificates(items) {
    const grid = document.getElementById("certificates-grid");
    if (!grid || !items) return;
    grid.innerHTML = items
      .map((c) => {
        const date = new Date(c.date);
        const dateLabel = isNaN(date)
          ? escapeHTML(c.date)
          : date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
            });
        return `
        <div class="cert-card reveal">
          <div class="cert-card-imgwrap">
            <img src="${escapeHTML(c.image)}" alt="${escapeHTML(c.title)} certificate" loading="lazy" decoding="async" />
          </div>
          <div class="cert-card-body">
            <div class="cert-card-title">${escapeHTML(c.title)}</div>
            <div class="cert-card-meta">${escapeHTML(c.issuer)} · ${dateLabel}</div>
            <div class="cert-card-desc">${escapeHTML(c.description)}</div>
            <a href="${escapeHTML(c.credentialUrl)}" target="_blank" rel="noopener" class="btn btn-secondary" style="font-size: 7px">⛓ VIEW CREDENTIAL</a>
          </div>
        </div>`;
      })
      .join("");
  }

  // ── TESTIMONIALS ──────────────────────────────────────
  function renderTestimonials(items) {
    const grid = document.getElementById("testimonials-grid");
    if (!grid || !items) return;
    grid.innerHTML = items
      .map((t) => {
        const stars = "★".repeat(t.rating) + "☆".repeat(5 - t.rating);
        return `
        <div class="testimonial-card reveal">
          <div class="testimonial-rating" aria-label="${t.rating} out of 5 stars">${stars}</div>
          <div class="testimonial-message">“${escapeHTML(t.message)}”</div>
          <div class="testimonial-person">
            <img class="testimonial-avatar" src="${escapeHTML(t.avatar)}" alt="${escapeHTML(t.name)}" loading="lazy" decoding="async" />
            <div>
              <div class="testimonial-name">${escapeHTML(t.name)}</div>
              <div class="testimonial-role">${escapeHTML(t.role)} · ${escapeHTML(t.company)}</div>
            </div>
          </div>
        </div>`;
      })
      .join("");
  }

  // ── EMPTY STATE ───────────────────────────────────────
  // One-time CSS injection so the empty state looks intentional
  // (pixel-themed "GAME OVER / INSERT DATA" card) without requiring
  // any edits to the main stylesheet. Uses the same custom properties
  // (--pixel, --muted, --accent, --bg, --border) the rest of the site
  // already relies on, with safe fallbacks in case one isn't defined.
  function injectEmptyStateStyles() {
    if (document.getElementById("empty-state-styles")) return;
    const style = document.createElement("style");
    style.id = "empty-state-styles";
    style.textContent = `
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 10px;
        width: 100%;
        padding: 48px 24px;
        text-align: center;
        border: 2px dashed var(--border, #444);
        border-radius: 4px;
        background: repeating-linear-gradient(
          45deg,
          transparent,
          transparent 10px,
          rgba(255, 255, 255, 0.02) 10px,
          rgba(255, 255, 255, 0.02) 20px
        );
      }
      .empty-state-icon {
        font-size: 28px;
        line-height: 1;
        filter: grayscale(0.15);
        animation: empty-state-float 2.4s ease-in-out infinite;
      }
      .empty-state-icon.is-error {
        animation: empty-state-shake 0.5s ease-in-out;
      }
      .empty-state-title {
        font-family: var(--pixel, monospace);
        font-size: 10px;
        letter-spacing: 0.5px;
        color: var(--text, inherit);
      }
      .empty-state-subtitle {
        font-size: 12px;
        color: var(--muted, #888);
        max-width: 320px;
      }
      .empty-state-meta {
        font-family: var(--pixel, monospace);
        font-size: 7px;
        color: var(--muted, #888);
        opacity: 0.7;
      }
      .empty-state-retry {
        margin-top: 6px;
        font-family: var(--pixel, monospace);
        font-size: 8px;
        padding: 8px 14px;
        background: transparent;
        border: 2px solid var(--accent, #888);
        color: var(--accent, inherit);
        cursor: pointer;
        border-radius: 2px;
        transition: transform 0.15s ease, background 0.15s ease;
      }
      .empty-state-retry:hover {
        background: var(--accent, #888);
        color: var(--bg, #111);
      }
      .empty-state-retry:active {
        transform: translateY(1px);
      }
      .empty-state-retry[disabled] {
        opacity: 0.5;
        cursor: default;
      }
      @keyframes empty-state-float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-4px); }
      }
      @keyframes empty-state-shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-3px); }
        75% { transform: translateX(3px); }
      }
    `;
    document.head.appendChild(style);
  }

  // Per-section flavor so every empty state reads like a deliberate
  // part of the UI rather than a leftover fallback string.
  const EMPTY_STATE_COPY = {
    skills: {
      icon: "🛠",
      title: "NO SKILLS DATA",
      subtitle: "Skill tree hasn't loaded any nodes yet.",
    },
    projects: {
      icon: "🗂",
      title: "NO PROJECTS FOUND",
      subtitle: "The project shelf is empty right now.",
    },
    achievements: {
      icon: "🏆",
      title: "NO ACHIEVEMENTS",
      subtitle: "No badges have been unlocked yet.",
    },
    github: {
      icon: "🐙",
      title: "GITHUB DATA EMPTY",
      subtitle: "No GitHub stats are wired up yet.",
    },
    certificates: {
      icon: "📜",
      title: "NO CERTIFICATES",
      subtitle: "No certificates have been added yet.",
    },
    testimonials: {
      icon: "💬",
      title: "NO TESTIMONIALS",
      subtitle: "No one's left a review yet — be the first.",
    },
  };

  /**
   * @param {HTMLElement|null} container - mount point
   * @param {object} options
   * @param {string} options.key - one of EMPTY_STATE_COPY's keys, for default copy/icon
   * @param {boolean} [options.isError] - true if this is a fetch/parse failure, not just empty data
   * @param {string} [options.errorDetail] - short technical reason (e.g. "HTTP 404"), shown in fine print
   * @param {() => void} [options.onRetry] - if provided, shows a retry button that calls this
   */
  function renderEmptyState(
    container,
    { key, isError = false, errorDetail, onRetry } = {},
  ) {
    if (!container) return;
    injectEmptyStateStyles();

    const copy = EMPTY_STATE_COPY[key] || {
      icon: "📦",
      title: "NO DATA FOUND",
      subtitle: "Nothing unlocked yet...",
    };

    const icon = isError ? "⚠️" : copy.icon;
    const title = isError ? "COULDN'T LOAD DATA" : copy.title;
    const subtitle = isError
      ? "That section failed to load — check your connection and try again."
      : copy.subtitle;

    container.innerHTML = `
      <div class="empty-state reveal">
        <div class="empty-state-icon${isError ? " is-error" : ""}">${icon}</div>
        <div class="empty-state-title">${escapeHTML(title)}</div>
        <div class="empty-state-subtitle">${escapeHTML(subtitle)}</div>
        ${errorDetail ? `<div class="empty-state-meta">${escapeHTML(errorDetail)}</div>` : ""}
        ${onRetry ? `<button type="button" class="empty-state-retry">↻ RETRY</button>` : ""}
      </div>
    `;

    if (onRetry) {
      const btn = container.querySelector(".empty-state-retry");
      btn?.addEventListener("click", async () => {
        btn.disabled = true;
        btn.textContent = "LOADING…";
        await onRetry();
      });
    }
  }

  // ── BOOT ──────────────────────────────────────────────
  async function loadAndRenderSkills() {
    const result = await fetchJSON("data/skills.json");
    const grid = document.getElementById("skills-grid");
    if (result.ok && result.data && result.data.length) {
      renderSkills(result.data);
      window.applyReveals?.(grid);
    } else {
      renderEmptyState(grid, {
        key: "skills",
        isError: !result.ok,
        errorDetail: result.error,
        onRetry: loadAndRenderSkills,
      });
    }
  }

  async function loadAndRenderProjects() {
    const result = await fetchJSON("data/projects.json");
    const featuredMount = document.getElementById("project-featured-mount");
    const cardsMount = document.getElementById("projects-cards-mount");
    const hasContent =
      result.ok &&
      result.data &&
      (result.data.featured || (result.data.cards && result.data.cards.length));
    if (hasContent) {
      renderProjects(result.data);
      window.applyReveals?.(featuredMount || cardsMount);
    } else {
      renderEmptyState(featuredMount || cardsMount, {
        key: "projects",
        isError: !result.ok,
        errorDetail: result.error,
        onRetry: loadAndRenderProjects,
      });
    }
  }

  async function loadAndRenderAchievements() {
    const result = await fetchJSON("data/achievements.json");
    const grid = document.getElementById("achievements-grid");
    if (result.ok && result.data && result.data.length) {
      renderAchievements(result.data);
      window.applyReveals?.(grid);
    } else {
      renderEmptyState(grid, {
        key: "achievements",
        isError: !result.ok,
        errorDetail: result.error,
        onRetry: loadAndRenderAchievements,
      });
    }
  }

  async function loadAndRenderGithub() {
    const result = await fetchJSON("data/github.json");
    const grid = document.getElementById("github-grid");
    if (
      result.ok &&
      result.data &&
      result.data.widgets &&
      result.data.widgets.length
    ) {
      renderGithub(result.data);
      window.applyReveals?.(grid);
    } else {
      renderEmptyState(grid, {
        key: "github",
        isError: !result.ok,
        errorDetail: result.error,
        onRetry: loadAndRenderGithub,
      });
    }
  }

  // JSON SAMPLE --- CERTIFICATES
  //{
  //   "id": "cert-1",
  //   "title": "Full-Stack Web Development",
  //   "issuer": "freeCodeCamp",
  //   "date": "2024-03-15",
  //   "image": "https://placehold.co/480x320/0c0f1c/f0c040?text=CERTIFICATE",
  //   "credentialUrl": "https://freecodecamp.org/certification/example/full-stack",
  //   "description": "Covers full-stack JavaScript fundamentals including responsive web design, APIs, and database integration."
  // },

  async function loadAndRenderCertificates() {
    const result = await fetchJSON("data/certificates.json");
    const grid = document.getElementById("certificates-grid");
    if (result.ok && result.data && result.data.length) {
      renderCertificates(result.data);
      window.applyReveals?.(grid);
    } else {
      renderEmptyState(grid, {
        key: "certificates",
        isError: !result.ok,
        errorDetail: result.error,
        onRetry: loadAndRenderCertificates,
      });
    }
  }

  // JSON SAMPLE --- TESTIMONIALS
  //   {
  //     "id": "test-1",
  //     "name": "Maria Santos",
  //     "role": "Student Affairs Officer",
  //     "company": "CNSC Office of Student Affairs",
  //     "message": "Greg built our office a file system that actually fits how we work. Records that used to take a full afternoon to find now take seconds. Rare to find a student developer who delivers production-ready work.",
  //     "avatar": "https://placehold.co/96x96/0c0f1c/f0c040?text=MS",
  //     "rating": 5
  //   }
  async function loadAndRenderTestimonials() {
    const result = await fetchJSON("data/testimonials.json");
    const grid = document.getElementById("testimonials-grid");
    if (result.ok && result.data && result.data.length) {
      renderTestimonials(result.data);
      window.applyReveals?.(grid);
    } else {
      renderEmptyState(grid, {
        key: "testimonials",
        isError: !result.ok,
        errorDetail: result.error,
        onRetry: loadAndRenderTestimonials,
      });
    }
  }

  async function init() {
    await Promise.all([
      loadAndRenderSkills(),
      loadAndRenderProjects(),
      loadAndRenderAchievements(),
      loadAndRenderGithub(),
      loadAndRenderCertificates(),
      loadAndRenderTestimonials(),
    ]);

    // Re-run reveal animations for injected content
    window.applyReveals?.(document);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
