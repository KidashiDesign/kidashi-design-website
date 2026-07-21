/* ============================================================
   KIDASHI DESIGN — fluid-particles.js (Optimized)
   ============================================================ */

class FluidParticles {
  constructor(canvasSelector, options = {}) {
    this.canvas = typeof canvasSelector === 'string'
      ? document.querySelector(canvasSelector)
      : canvasSelector

    if (!this.canvas) return

    this.opts = {
      particleDensity:     options.particleDensity     ?? 50,
      particleSize:        options.particleSize        ?? 1,
      particleColor:       options.particleColor       ?? '#555555',
      activeColor:         options.activeColor         ?? '#ffffff',
      maxBlastRadius:      options.maxBlastRadius      ?? 300,
      hoverDelay:          options.hoverDelay          ?? 100,
      interactionDistance: options.interactionDistance ?? 10,
    }
    
    // Pre-calculate squared values for faster math
    this.opts.interactionSq = this.opts.interactionDistance ** 2;

    this.ctx         = null
    this.particles   = []
    this.mouse       = { x: -1000, y: -1000, prevX: 0, prevY: 0 } // Reusable object
    this.blast       = { active: false, x: 0, y: 0, radius: 0 }
    this.rafId       = 0
    this.hoverTimer  = null
    this._handlers   = {}
    this._rect       = { left: 0, top: 0 } // Cache bounding rect

    // Pre-compute 256 blast color strings to avoid GC pauses
    this._blastColors = Array.from({ length: 256 }, (_, i) => `rgba(${i},100,255,0.8)`);

    this._init()
  }

  /* ── Particle ─────────────────────────────────────── */
  _createParticle(x, y) {
    const opts = this.opts
    const density = Math.random() * 3 + 1
    return {
      x, y,
      baseX:    x,
      baseY:    y,
      size:     Math.random() * opts.particleSize + 0.5,
      density:  density,
      color:    opts.particleColor,
      vx:       0,
      vy:       0,
      friction: 0.9 - 0.01 * density,
    }
  }

  _updateParticle(p) {
    const opts  = this.opts
    const mouse = this.mouse
    const blast = this.blast

    p.x  += p.vx
    p.y  += p.vy
    p.vx *= p.friction
    p.vy *= p.friction

    const dx = mouse.x - p.x
    const dy = mouse.y - p.y
    const distSq = dx * dx + dy * dy

    // Use squared distance check before doing expensive Math.sqrt()
    if (distSq < opts.interactionSq) {
      const dist = Math.sqrt(distSq) || 1
      const fdx   = dx / dist
      const fdy   = dy / dist
      const force = (opts.interactionDistance - dist) / opts.interactionDistance
      p.x    -= fdx * force * p.density * 0.6
      p.y    -= fdy * force * p.density * 0.6
      p.color = opts.activeColor
    } else {
      p.x    -= (p.x - p.baseX) / 20
      p.y    -= (p.y - p.baseY) / 20
      p.color = opts.particleColor
    }

    if (blast.active) {
      const bdx   = p.x - blast.x
      const bdy   = p.y - blast.y
      const bdistSq = bdx * bdx + bdy * bdy
      
      const blastRadSq = blast.radius * blast.radius;
      
      if (bdistSq < blastRadSq) {
        const bdist = Math.sqrt(bdistSq) || 1
        const bfx    = bdx / bdist
        const bfy    = bdy / bdist
        const bforce = (blast.radius - bdist) / blast.radius
        p.vx += bfx * bforce * 15
        p.vy += bfy * bforce * 15
        
        const intensity = Math.min(255, Math.max(0, 255 - Math.floor(bdist)))
        p.color = this._blastColors[intensity] // Use pre-allocated string
      }
    }
  }

  /* ── Setup ────────────────────────────────────────── */
  _w() { return this.canvas.parentElement ? this.canvas.parentElement.offsetWidth  : window.innerWidth  }
  _h() { return this.canvas.parentElement ? this.canvas.parentElement.offsetHeight : window.innerHeight }

  _initParticles() {
    this.particles = []
    const w = this._w(), h = this._h()
    const count = Math.floor((w * h) / this.opts.particleDensity)
    
    // Pre-allocate array size for slight memory optimization
    this.particles = new Array(count);
    for (let i = 0; i < count; i++) {
      this.particles[i] = this._createParticle(
        Math.random() * w,
        Math.random() * h
      )
    }
  }
  
  _updateRect() {
      this._rect = this.canvas.getBoundingClientRect();
  }

  _resize() {
    const pr = window.devicePixelRatio || 1
    const w  = this._w(), h = this._h()
    this.canvas.width  = w * pr
    this.canvas.height = h * pr
    this.canvas.style.width  = `${w}px`
    this.canvas.style.height = `${h}px`
    this.ctx.setTransform(pr, 0, 0, pr, 0, 0)
    this._updateRect()
    this._initParticles()
  }

  /* ── Blast ────────────────────────────────────────── */
  _triggerBlast(x, y) {
    this.blast.active = true;
    this.blast.x = x;
    this.blast.y = y;
    this.blast.radius = 0;
    
    const start    = performance.now()
    const duration = 300
    const maxR     = this.opts.maxBlastRadius

    const expand = (ts) => {
      const p = Math.min((ts - start) / duration, 1)
      this.blast.radius = p * (2 - p) * maxR   // easeOutQuad
      if (p < 1) {
        requestAnimationFrame(expand)
      } else {
        setTimeout(() => { this.blast.active = false }, 100)
      }
    }
    requestAnimationFrame(expand)

    if (this.hoverTimer) { clearTimeout(this.hoverTimer); this.hoverTimer = null }
  }

  /* ── Animation loop ───────────────────────────────── */
  _animate() {
    const ctx = this.ctx
    ctx.clearRect(0, 0, this._w(), this._h())
    
    let lastColor = null;
    
    // Traditional for-loop is slightly faster than for...of for huge arrays
    const len = this.particles.length;
    for (let i = 0; i < len; i++) {
      const p = this.particles[i];
      this._updateParticle(p);
      
      // Batch state changes: Only update fillStyle if the color changed
      if (p.color !== lastColor) {
          ctx.fillStyle = p.color;
          lastColor = p.color;
      }
      
      // Use fillRect instead of arc for massive performance gain on tiny particles
      ctx.fillRect(p.x, p.y, p.size, p.size);
    }
    
    this.rafId = requestAnimationFrame(() => this._animate())
  }

  /* ── Init ─────────────────────────────────────────── */
  _init() {
    this.ctx = this.canvas.getContext('2d', { alpha: true })
    this.ctx.globalCompositeOperation = 'lighter'

    const opts = this.opts
    let lastMove = 0

    const onResize = () => this._resize()
    const onScroll = () => this._updateRect() // Keep cache accurate

    const onMouseMove = (e) => {
      const now = performance.now()
      if (now - lastMove < 10) return
      lastMove = now

      // Mutate existing object rather than creating a new one
      this.mouse.prevX = this.mouse.x;
      this.mouse.prevY = this.mouse.y;
      this.mouse.x = e.clientX - this._rect.left;
      this.mouse.y = e.clientY - this._rect.top;

      const d = Math.hypot(this.mouse.x - this.mouse.prevX, this.mouse.y - this.mouse.prevY)
      if (d < 5) {
        if (!this.hoverTimer) {
          this.hoverTimer = setTimeout(() => this._triggerBlast(e.clientX, e.clientY), opts.hoverDelay)
        }
      } else {
        if (this.hoverTimer) { clearTimeout(this.hoverTimer); this.hoverTimer = null }
      }
    }

    const onClick = (e) => {
      this._triggerBlast(e.clientX - this._rect.left, e.clientY - this._rect.top)
    }

    const onTouchMove = (e) => {
      if (!e.touches[0]) return
      this.mouse.prevX = this.mouse.x;
      this.mouse.prevY = this.mouse.y;
      this.mouse.x = e.touches[0].clientX - this._rect.left;
      this.mouse.y = e.touches[0].clientY - this._rect.top;
    }

    const onTouchStart = (e) => {
      if (!e.touches[0]) return
      const x = e.touches[0].clientX - this._rect.left
      const y = e.touches[0].clientY - this._rect.top
      this.hoverTimer = setTimeout(() => this._triggerBlast(x, y), opts.hoverDelay)
    }

    const onTouchEnd = () => {
      if (this.hoverTimer) { clearTimeout(this.hoverTimer); this.hoverTimer = null }
    }

    window.addEventListener('resize',     onResize)
    window.addEventListener('scroll',     onScroll, { passive: true })
    window.addEventListener('mousemove',  onMouseMove)
    window.addEventListener('click',      onClick)
    window.addEventListener('touchmove',  onTouchMove,  { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend',   onTouchEnd)

    this._handlers = { onResize, onScroll, onMouseMove, onClick, onTouchMove, onTouchStart, onTouchEnd }

    this._resize()
    this._animate()
  }

  /* ── Cleanup ──────────────────────────────────────── */
  destroy() {
    cancelAnimationFrame(this.rafId)
    if (this.hoverTimer) clearTimeout(this.hoverTimer)
    const h = this._handlers
    window.removeEventListener('resize',     h.onResize)
    window.removeEventListener('scroll',     h.onScroll)
    window.removeEventListener('mousemove',  h.onMouseMove)
    window.removeEventListener('click',      h.onClick)
    window.removeEventListener('touchmove',  h.onTouchMove)
    window.removeEventListener('touchstart', h.onTouchStart)
    window.removeEventListener('touchend',   h.onTouchEnd)
  }
}