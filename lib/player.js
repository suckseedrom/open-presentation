/**
 * PresentationPlayer — vanilla JS transport/stage/transition engine
 * Provides a minimal transport for static HTML presentations.
 *
 * Usage:
 *   new PresentationPlayer(container, { scenes, durations, audioUrl, theme, onExit, onEdit })
 */

const DEFAULTS = {
  DESKTOP_W: 1280,
  DESKTOP_H: 720,
  MOBILE_W: 576,
  MOBILE_H: 1024,
  TICK_MS: 30,
  TRANSITION_MS: 600,
  MOBILE_BP: 768
};

/* ── Inline SVG icons ─────────────────────────────────────────────── */
const ICONS = {
  play: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 3 20 12 6 21 6 3"/></svg>`,
  pause: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`,
  skipBack: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/></svg>`,
  skipForward: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>`,
  restart: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>`,
  volume2: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`,
  volumeX: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`,
  editor: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z"/></svg>`,
  exit: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
};

class PresentationPlayer {
  /**
   * @param {HTMLElement} container
   * @param {object} opts
   * @param {Array<{id:string, html:string, background?:string, duration?:number, activate?:function}>} opts.scenes
   * @param {number|number[]} [opts.durations]   — fallback per-slide ms
   * @param {string}  [opts.audioUrl]
   * @param {object}  [opts.theme]               — CSS custom-property overrides
   * @param {function} [opts.onExit]
   * @param {function} [opts.onEdit]
   */
  constructor(container, opts = {}) {
    if (!container) throw new Error('PresentationPlayer: container element required');
    this._container = container;
    this._scenes = (opts.scenes || []).map((s, i) => ({
      id: s.id || `scene-${i}`,
      html: s.html || '',
      background: s.background || null,
      duration: s.duration || null,
      activate: typeof s.activate === 'function' ? s.activate : null
    }));

    /* Resolve per-slide durations */
    const fallback = opts.durations;
    this._durations = this._scenes.map((s, i) => {
      if (s.duration) return s.duration;
      if (Array.isArray(fallback)) return fallback[i] || 5000;
      if (typeof fallback === 'number') return fallback;
      return 5000;
    });

    this._audioUrl = opts.audioUrl || null;
    this._onExit = typeof opts.onExit === 'function' ? opts.onExit : null;
    this._onEdit = typeof opts.onEdit === 'function' ? opts.onEdit : null;

    /* State */
    this._currentSlide = 0;
    this._isPlaying = true;
    this._progress = 0;          // 0-100 within current slide
    this._isMuted = false;
    this._tickTimer = null;
    this._isMobile = false;
    this._destroyed = false;

    /* DOM refs */
    this._stageEl = null;
    this._sceneEls = [];
    this._bgEls = [];
    this._playBtn = null;
    this._muteBtn = null;
    this._statusEl = null;
    this._audioEl = null;
    this._resizeObserver = null;

    /* Build */
    this._applyTheme(opts.theme);
    this._buildDOM();
    this._initAudio();
    this._bindResize();
    this._activateScene(0, true);
    this._startTick();
  }

  /* ── Public API ──────────────────────────────────────────────────── */

  play() {
    if (this._destroyed) return;
    this._isPlaying = true;
    this._updatePlayBtn();
    this._startTick();
    this._unblockAudio();
  }

  pause() {
    if (this._destroyed) return;
    this._isPlaying = false;
    this._updatePlayBtn();
    this._stopTick();
  }

  next() {
    if (this._destroyed || this._scenes.length === 0) return;
    const nextIdx = (this._currentSlide + 1) % this._scenes.length;
    this._goTo(nextIdx);
  }

  prev() {
    if (this._destroyed || this._scenes.length === 0) return;
    const prevIdx = (this._currentSlide - 1 + this._scenes.length) % this._scenes.length;
    this._goTo(prevIdx);
  }

  restart() {
    if (this._destroyed) return;
    this._goTo(0);
    if (!this._isPlaying) this.play();
  }

  setMuted(muted) {
    if (this._destroyed) return;
    this._isMuted = !!muted;
    if (this._audioEl) this._audioEl.muted = this._isMuted;
    this._updateMuteBtn();
  }

  destroy() {
    if (this._destroyed) return;
    this._destroyed = true;
    this._stopTick();
    if (this._resizeObserver) this._resizeObserver.disconnect();
    if (this._resizeHandler) window.removeEventListener('resize', this._resizeHandler);
    if (this._audioEl) {
      this._audioEl.pause();
      this._audioEl.remove();
    }
    this._container.innerHTML = '';
    this._container.classList.remove('pf-player');
  }

  /* ── Read-only state getters ─────────────────────────────────────── */

  get currentSlide() { return this._currentSlide; }
  get isPlaying()    { return this._isPlaying; }
  get progress()     { return this._progress; }
  get isMuted()      { return this._isMuted; }

  /* ── Internal: DOM construction ──────────────────────────────────── */

  _applyTheme(theme) {
    if (!theme) return;
    const root = this._container;
    const map = {
      primary:     '--pf-primary',
      bg:          '--pf-bg',
      pillBg:      '--pf-pill-bg',
      pillBorder:  '--pf-pill-border',
      pillShadow:  '--pf-pill-shadow',
      transition:  '--pf-transition'
    };
    for (const [key, prop] of Object.entries(map)) {
      if (theme[key]) root.style.setProperty(prop, theme[key]);
    }
  }

  _buildDOM() {
    this._container.classList.add('pf-player');
    this._container.innerHTML = '';

    /* Scene background layers (siblings before stage-wrap, z-index 0) */
    this._bgEls = this._scenes.map((scene, i) => {
      const bg = document.createElement('div');
      bg.className = 'pf-scene-bg';
      bg.setAttribute('aria-hidden', 'true');
      if (scene.background) {
        if (scene.background.trim().startsWith('<')) {
          bg.innerHTML = scene.background;
        } else {
          bg.style.background = scene.background;
        }
      }
      if (i === 0) bg.classList.add('pf-scene-bg--active');
      this._container.appendChild(bg);
      return bg;
    });

    /* Stage wrapper */
    const stageWrap = document.createElement('div');
    stageWrap.className = 'pf-stage-wrap';

    /* Stage (scaled viewport) */
    this._stageEl = document.createElement('div');
    this._stageEl.className = 'pf-stage';
    stageWrap.appendChild(this._stageEl);

    /* Create scene nodes */
    this._sceneEls = this._scenes.map((scene, i) => {
      const node = document.createElement('div');
      node.className = 'pf-scene';
      node.setAttribute('data-scene-id', scene.id);
      node.innerHTML = scene.html;
      if (i !== 0) node.style.opacity = '0';
      this._stageEl.appendChild(node);
      return node;
    });

    this._container.appendChild(stageWrap);

    /* Status (a11y live region) */
    this._statusEl = document.createElement('div');
    this._statusEl.className = 'pf-sr-only';
    this._statusEl.setAttribute('aria-live', 'polite');
    this._statusEl.setAttribute('role', 'status');
    this._container.appendChild(this._statusEl);

    /* Transport pill */
    this._buildTransport();

    /* Initial sizing */
    this._onResize();
  }

  _buildTransport() {
    const pill = document.createElement('div');
    pill.className = 'pf-pill';
    pill.setAttribute('role', 'toolbar');
    pill.setAttribute('aria-label', 'Presentation controls');

    const makeBtn = (label, icon, className, onClick) => {
      const btn = document.createElement('button');
      btn.className = className;
      btn.innerHTML = icon;
      btn.setAttribute('aria-label', label);
      btn.addEventListener('click', (e) => { e.preventDefault(); onClick(); });
      return btn;
    };

    /* Exit (conditional) */
    if (this._onExit) {
      pill.appendChild(makeBtn('Exit', ICONS.exit, 'pf-btn pf-btn--exit', () => this._onExit()));
    }

    /* SkipBack */
    pill.appendChild(makeBtn('Previous slide', ICONS.skipBack, 'pf-btn pf-btn--sm', () => this.prev()));

    /* Play / Pause */
    this._playBtn = makeBtn('Play', ICONS.play, 'pf-btn pf-btn--play', () => {
      this._isPlaying ? this.pause() : this.play();
      this._unblockAudio();
    });
    pill.appendChild(this._playBtn);

    /* SkipForward */
    pill.appendChild(makeBtn('Next slide', ICONS.skipForward, 'pf-btn pf-btn--sm', () => this.next()));

    /* Restart */
    pill.appendChild(makeBtn('Restart', ICONS.restart, 'pf-btn pf-btn--sm', () => this.restart()));

    /* Mute */
    this._muteBtn = makeBtn('Mute', ICONS.volume2, 'pf-btn pf-btn--sm', () => {
      this.setMuted(!this._isMuted);
      this._unblockAudio();
    });
    pill.appendChild(this._muteBtn);

    if (this._onEdit) {
      pill.appendChild(makeBtn('Editor', ICONS.editor, 'pf-btn pf-btn--editor', () => this._onEdit()));
    }

    this._container.appendChild(pill);
    this._updatePlayBtn();
    this._updateMuteBtn();
  }

  /* ── Internal: Audio ─────────────────────────────────────────────── */

  _initAudio() {
    if (!this._audioUrl) return;
    this._audioEl = document.createElement('audio');
    this._audioEl.src = this._audioUrl;
    this._audioEl.loop = true;
    this._audioEl.preload = 'auto';
    this._audioEl.muted = this._isMuted;
    this._audioEl.setAttribute('aria-hidden', 'true');
    this._container.appendChild(this._audioEl);
  }

  _unblockAudio() {
    if (!this._audioEl) return;
    const p = this._audioEl.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  }

  _syncAudioState() {
    if (!this._audioEl) return;
    if (this._isMuted) {
      this._audioEl.muted = true;
    } else {
      this._audioEl.muted = false;
      if (this._isPlaying) this._unblockAudio();
    }
  }

  /* ── Internal: Timer / tick ──────────────────────────────────────── */

  _startTick() {
    this._stopTick();
    if (this._scenes.length === 0) return;
    this._tickTimer = setInterval(() => this._tick(), DEFAULTS.TICK_MS);
  }

  _stopTick() {
    if (this._tickTimer) {
      clearInterval(this._tickTimer);
      this._tickTimer = null;
    }
  }

  _tick() {
    if (!this._isPlaying || this._scenes.length === 0) return;
    const dur = this._durations[this._currentSlide] || 5000;
    const increment = (DEFAULTS.TICK_MS / dur) * 100;
    this._progress += increment;

    /* Update scale drift on active scene */
    const activeNode = this._sceneEls[this._currentSlide];
    if (activeNode) {
      const t = Math.min(this._progress / 100, 1);
      const scale = 0.98 + t * 0.04;   // 0.98 → 1.02
      activeNode.style.transform = `scale(${scale})`;
    }

    if (this._progress >= 100) {
      this._progress = 0;
      const nextIdx = (this._currentSlide + 1) % this._scenes.length;
      this._goTo(nextIdx);
    }
  }

  /* ── Internal: Scene transitions ─────────────────────────────────── */

  _goTo(idx) {
    if (idx === this._currentSlide) return;
    this._deactivateScene(this._currentSlide);
    this._currentSlide = idx;
    this._progress = 0;
    this._activateScene(idx, true);
    this._updateStatus();
  }

  _activateScene(idx, withTransition) {
    const node = this._sceneEls[idx];
    if (!node) return;
    const scene = this._scenes[idx];

    if (withTransition) {
      node.style.transition = `opacity var(--pf-transition, 0.6s), filter var(--pf-transition, 0.6s)`;
      node.style.filter = 'blur(8px)';
      node.style.opacity = '0';
      /* Force reflow so transition fires */
      void node.offsetHeight;
      node.style.opacity = '1';
      node.style.filter = 'blur(0px)';
    } else {
      node.style.transition = 'none';
      node.style.opacity = '1';
      node.style.filter = 'blur(0px)';
    }

    /* Reset scale drift */
    node.style.transform = 'scale(0.98)';

    /* Call scene.activate() */
    if (scene.activate) {
      try { scene.activate(node); } catch (_) { /* swallow */ }
    }

    /* Dispatch event */
    this._container.dispatchEvent(new CustomEvent('scene:activate', {
      bubbles: true,
      detail: { index: idx, id: scene.id, node }
    }));

    /* Activate scene background */
    const bg = this._bgEls[idx];
    if (bg && scene.background) bg.classList.add('pf-scene-bg--active');

    this._updateStatus();
  }

  _deactivateScene(idx) {
    const node = this._sceneEls[idx];
    if (!node) return;
    const scene = this._scenes[idx];

    node.style.transition = `opacity var(--pf-transition, 0.6s), filter var(--pf-transition, 0.6s)`;
    node.style.opacity = '0';
    node.style.filter = 'blur(8px)';

    /* Deactivate scene background */
    const bg = this._bgEls[idx];
    if (bg) bg.classList.remove('pf-scene-bg--active');

    /* Dispatch event */
    this._container.dispatchEvent(new CustomEvent('scene:deactivate', {
      bubbles: true,
      detail: { index: idx, id: scene.id, node }
    }));
  }

  /* ── Internal: Stage scaling ─────────────────────────────────────── */

  _bindResize() {
    this._resizeHandler = () => this._onResize();
    window.addEventListener('resize', this._resizeHandler);
    if (typeof ResizeObserver !== 'undefined') {
      this._resizeObserver = new ResizeObserver(() => this._onResize());
      this._resizeObserver.observe(this._container);
    }
  }

  _onResize() {
    if (!this._stageEl) return;
    const cw = this._container.clientWidth;
    const ch = this._container.clientHeight;
    this._isMobile = cw < DEFAULTS.MOBILE_BP;

    const baseW = this._isMobile ? DEFAULTS.MOBILE_W : DEFAULTS.DESKTOP_W;
    const baseH = this._isMobile ? DEFAULTS.MOBILE_H : DEFAULTS.DESKTOP_H;

    this._stageEl.style.width = baseW + 'px';
    this._stageEl.style.height = baseH + 'px';

    const widthRatio = cw / baseW;
    const heightRatio = ch / baseH;
    const scale = Math.min(widthRatio, heightRatio);
    this._stageEl.style.transform = `scale(${scale})`;
  }

  /* ── Internal: Button state ──────────────────────────────────────── */

  _updatePlayBtn() {
    if (!this._playBtn) return;
    this._playBtn.innerHTML = this._isPlaying ? ICONS.pause : ICONS.play;
    this._playBtn.setAttribute('aria-label', this._isPlaying ? 'Pause' : 'Play');
  }

  _updateMuteBtn() {
    if (!this._muteBtn) return;
    this._muteBtn.innerHTML = this._isMuted ? ICONS.volumeX : ICONS.volume2;
    this._muteBtn.setAttribute('aria-label', this._isMuted ? 'Unmute' : 'Mute');
    this._syncAudioState();
  }

  _updateStatus() {
    if (!this._statusEl || this._scenes.length === 0) return;
    const scene = this._scenes[this._currentSlide];
    this._statusEl.textContent = `Slide ${this._currentSlide + 1} of ${this._scenes.length}: ${scene.id}`;
  }
}

/* ── Expose globally ─────────────────────────────────────────────── */
if (typeof window !== 'undefined') {
  window.PresentationPlayer = PresentationPlayer;
}

/* ── ESM export (optional) ───────────────────────────────────────── */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PresentationPlayer;
}
