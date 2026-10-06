/* ============================================================
   KIDASHI DESIGN — fluid-particles.js
   Canvas-based particle system with mouse/touch interaction.
   Usage:
     const fp = new FluidParticles('#my-canvas', { options })
     fp.destroy() // cleanup
   ============================================================ */

class FluidParticles {
  constructor(canvasSelector, options = {}) {
    this.canvas = typeof canvasSelector === 'string'
      ? document.querySelector(canvasSelector)
      : canvasSelector

    if (!this.canvas) return

    this.opts = {
      particleDensity:     options.particleDensity     ?? 100,
      particleSize:        options.particleSize         ?? 1,
      particleColor:       options.particleColor        ?? '#333333',   // CI: dark grey
      activeColor:         options.activeColor          ?? '#71805f',   // CI: olive
      maxBlastRadius:      options.maxBlastRadius       ?? 300,
      hoverDelay:          options.hoverDelay           ?? 100,
      interactionDistance: options.interactionDistance  ?? 10,
    }

    // Squared radius lets the per-particle hover test skip Math.sqrt
    this.opts.interactionSq = this.opts.interactionDistance * this.opts.interactionDistance

    this.ctx         = null
    this.particles   = []
    this.w           = 0
    this.h           = 0
    // Start far outside the canvas so nothing is pushed around before the first mouse move
    this.mouse       = { x: -9999, y: -9999, prevX: -9999, prevY: -9999 }
    this.blast       = { active: false, x: 0, y: 0, radius: 0 }
    this.rafId       = 0
    this.hoverTimer  = null
    this._handlers   = {}
    this._rect       = null
    this._rectDirty  = true
    this._tick       = () => this._animate()

    this._blastColors = this._buildBlastColors()

    this._init()
  }

  /* ── Colors ───────────────────────────────────────── */
  _parseHex(hex) {
    const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(hex).trim())
    if (!m) return null
    let h = m[1]
    if (h.length === 3) h = h.replace(/./g, '$&$&')
    const n = parseInt(h, 16)
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
  }

  // One ready-made color string per blast intensity (0 = blast edge, 255 = blast center),
  // fading from the base color to the active color. Built once so the animation loop
  // never has to assemble strings.
  _buildBlastColors() {
    const from = this._parseHex(this.opts.particleColor)
    const to   = this._parseHex(this.opts.activeColor)
    const table = new Array(256)
    for (let i = 0; i < 256; i++) {
      if (!from || !to) {
        table[i] = this.opts.activeColor
        continue
      }
      const t = i / 255
      const r = Math.round(from[0] + (to[0] - from[0]) * t)
      const g = Math.round(from[1] + (to[1] - from[1]) * t)
      const b = Math.round(from[2] + (to[2] - from[2]) * t)
      table[i] = `rgba(${r},${g},${b},0.8)`
    }
    return table
  }

  /* ── Particle ─────────────────────────────────────── */
  _createParticle(x, y) {
    const opts    = this.opts
    const density = Math.random() * 3 + 1
    const size    = Math.random() * opts.particleSize + 0.5
    return {
      x, y,
      baseX:    x,
      baseY:    y,
      size:     size,
      side:     size * 1.7725,   // √π · size: square with the same area as a circle of radius `size`
      density,
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

    const dx     = mouse.x - p.x
    const dy     = mouse.y - p.y
    const distSq = dx * dx + dy * dy

    if (distSq < opts.interactionSq) {
      const dist  = Math.sqrt(distSq) || 1
      const force = (opts.interactionDistance - dist) / opts.interactionDistance
      p.x    -= (dx / dist) * force * p.density * 0.6
      p.y    -= (dy / dist) * force * p.density * 0.6
      p.color = opts.activeColor
    } else {
      p.x    -= (p.x - p.baseX) / 20
      p.y    -= (p.y - p.baseY) / 20
      p.color = opts.particleColor
    }

    if (blast.active) {
      const bdx     = p.x - blast.x
      const bdy     = p.y - blast.y
      const bdistSq = bdx * bdx + bdy * bdy
      if (bdistSq < blast.radius * blast.radius) {
        const bdist  = Math.sqrt(bdistSq) || 1
        const bforce = (blast.radius - bdist) / blast.radius
        p.vx += (bdx / bdist) * bforce * 15
        p.vy += (bdy / bdist) * bforce * 15
        p.color = this._blastColors[Math.max(0, 255 - Math.floor(bdist))]
      }
    }
  }

  /* ── Setup ────────────────────────────────────────── */
  _measure() {
    const parent = this.canvas.parentElement
    this.w = parent ? parent.offsetWidth  : window.innerWidth
    this.h = parent ? parent.offsetHeight : window.innerHeight
  }

  // The canvas position only changes on scroll/resize, so the rect is read lazily
  // (and at most once per change) instead of on every pointer event.
  _getRect() {
    if (this._rectDirty || !this._rect) {
      this._rect      = this.canvas.getBoundingClientRect()
      this._rectDirty = false
    }
    return this._rect
  }

  _initParticles() {
    const w = this.w, h = this.h
    const count = Math.floor((w * h) / this.opts.particleDensity)
    this.particles = new Array(count)
    for (let i = 0; i < count; i++) {
      this.particles[i] = this._createParticle(
        Math.random() * w,
        Math.random() * h
      )
    }
  }

  _resize() {
    const pr = window.devicePixelRatio || 1
    this._measure()
    this.canvas.width  = this.w * pr
    this.canvas.height = this.h * pr
    this.canvas.style.width  = `${this.w}px`
    this.canvas.style.height = `${this.h}px`
    this.ctx.setTransform(pr, 0, 0, pr, 0, 0)
    this._rectDirty = true
    this._initParticles()
  }

  /* ── Blast ────────────────────────────────────────── */
  _triggerBlast(x, y) {
    const blast = this.blast
    blast.active = true
    blast.x      = x
    blast.y      = y
    blast.radius = 0

    const start    = performance.now()
    const duration = 300
    const maxR     = this.opts.maxBlastRadius

    const expand = (ts) => {
      const p = Math.min((ts - start) / duration, 1)
      blast.radius = p * (2 - p) * maxR   // easeOutQuad
      if (p < 1) {
        requestAnimationFrame(expand)
      } else {
        setTimeout(() => { blast.active = false }, 100)
      }
    }
    requestAnimationFrame(expand)

    if (this.hoverTimer) { clearTimeout(this.hoverTimer); this.hoverTimer = null }
  }

  /* ── Animation loop ───────────────────────────────── */
  _animate() {
    const ctx       = this.ctx
    const particles = this.particles
    ctx.clearRect(0, 0, this.w, this.h)

    // Particles are 1–3px dots: a filled square is visually the same as a circle
    // here and much cheaper. Its side is chosen so the area equals the circle's.
    // fillStyle is only touched when the color changes.
    let current = null
    for (let i = 0, n = particles.length; i < n; i++) {
      const p = particles[i]
      this._updateParticle(p)
      if (p.color !== current) {
        ctx.fillStyle = p.color
        current = p.color
      }
      ctx.fillRect(p.x - p.side / 2, p.y - p.side / 2, p.side, p.side)
    }

    this.rafId = requestAnimationFrame(this._tick)
  }

  /* ── Init ─────────────────────────────────────────── */
  _init() {
    this.ctx = this.canvas.getContext('2d', { alpha: true })
    this.ctx.globalCompositeOperation = 'lighter'

    const opts = this.opts
    let lastMove = 0

    const onResize = () => this._resize()
    const onScroll = () => { this._rectDirty = true }

    const onMouseMove = (e) => {
      const now = performance.now()
      if (now - lastMove < 10) return
      lastMove = now

      const rect  = this._getRect()
      const mouse = this.mouse
      mouse.prevX = mouse.x
      mouse.prevY = mouse.y
      mouse.x     = e.clientX - rect.left
      mouse.y     = e.clientY - rect.top

      const d = Math.hypot(mouse.x - mouse.prevX, mouse.y - mouse.prevY)
      if (d < 5) {
        if (!this.hoverTimer) {
          this.hoverTimer = setTimeout(() => this._triggerBlast(e.clientX, e.clientY), opts.hoverDelay)
        }
      } else {
        if (this.hoverTimer) { clearTimeout(this.hoverTimer); this.hoverTimer = null }
      }
    }

    const onClick = (e) => {
      const rect = this._getRect()
      this._triggerBlast(e.clientX - rect.left, e.clientY - rect.top)
    }

    const onTouchMove = (e) => {
      if (!e.touches[0]) return
      const rect  = this._getRect()
      const mouse = this.mouse
      mouse.prevX = mouse.x
      mouse.prevY = mouse.y
      mouse.x     = e.touches[0].clientX - rect.left
      mouse.y     = e.touches[0].clientY - rect.top
    }

    const onTouchStart = (e) => {
      if (!e.touches[0]) return
      const rect = this._getRect()
      const x = e.touches[0].clientX - rect.left
      const y = e.touches[0].clientY - rect.top
      this.hoverTimer = setTimeout(() => this._triggerBlast(x, y), opts.hoverDelay)
    }

    const onTouchEnd = () => {
      if (this.hoverTimer) { clearTimeout(this.hoverTimer); this.hoverTimer = null }
    }

    window.addEventListener('resize',     onResize)
    window.addEventListener('scroll',     onScroll,     { passive: true })
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
