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
      particleOpacity:     options.particleOpacity      ?? 0.3,         // idle dots stay subtle
      activeColor:         options.activeColor          ?? '#71805f',   // CI: olive (bubble center)
      // Lighter CI tints for the bubble edge: sage (--secondary), light pistachio (--accent),
      // and a lightened olive (--primary)
      rimColors:           options.rimColors            ?? ['#a9b497', '#cbcfae', '#94a087'],
      maxBlastRadius:      options.maxBlastRadius       ?? 300,
      hoverDelay:          options.hoverDelay           ?? 100,
      interactionDistance: options.interactionDistance  ?? 10,
    }

    // Bubble = hover area around the cursor and the expanding blast. Dots inside it fade from
    // the active color (center) to a light rim color (edge), then back to the idle color
    // across a soft glow zone just outside the edge (fraction of the bubble radius).
    this._bubble = { steps: 48, glow: 0.25, grow: 0.5 }

    // Squared radii let the per-particle hover test skip Math.sqrt
    const R     = this.opts.interactionDistance
    const glowR = R * (1 + this._bubble.glow)
    this.opts.interactionSq = R * R
    this.opts.glowSq        = glowR * glowR

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

    this._buildColors()

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

  // Builds every color string the animation loop needs, once, so the loop never assembles strings:
  //   _baseColor     idle dot color (CI dark grey at a low opacity)
  //   _bubbleColors  [rim color][step]: step 0 = bubble center (active color), last step = end of
  //                  the edge glow; the rim color is reached at the bubble edge (radius 1)
  //   _growTable     [step]: size factor, peaking at the bubble edge so light dots stay visible
  _buildColors() {
    const opts   = this.opts
    const { steps, glow, grow } = this._bubble
    const base   = this._parseHex(opts.particleColor)
    const active = this._parseHex(opts.activeColor)
    const rims   = (opts.rimColors || []).map(c => this._parseHex(c)).filter(Boolean)

    this._levelScale = (steps - 1) / (1 + glow)   // bubble-radius fraction → table step
    this._growTable  = new Array(steps).fill(1)

    if (!base || !active || !rims.length) {
      // Unparsable colors: fall back to plain solid colors, no gradient
      this._baseColor    = opts.particleColor
      this._bubbleColors = [new Array(steps).fill(opts.activeColor)]
      return
    }

    const CENTER_ALPHA = 0.55
    const RIM_ALPHA    = 0.9
    const mix = (c1, a1, c2, a2, t) => {
      const r = Math.round(c1[0] + (c2[0] - c1[0]) * t)
      const g = Math.round(c1[1] + (c2[1] - c1[1]) * t)
      const b = Math.round(c1[2] + (c2[2] - c1[2]) * t)
      return `rgba(${r},${g},${b},${(a1 + (a2 - a1) * t).toFixed(3)})`
    }

    this._baseColor    = `rgba(${base[0]},${base[1]},${base[2]},${opts.particleOpacity})`
    this._bubbleColors = rims.map(rim => {
      const row = new Array(steps)
      for (let i = 0; i < steps; i++) {
        const u = (i / (steps - 1)) * (1 + glow)   // 0 = center, 1 = bubble edge, 1 + glow = glow end
        if (u <= 1) {
          row[i] = mix(active, CENTER_ALPHA, rim, RIM_ALPHA, u * u * (3 - 2 * u))
        } else {
          row[i] = mix(rim, RIM_ALPHA, base, opts.particleOpacity, (u - 1) / glow)
        }
      }
      return row
    })
    for (let i = 0; i < steps; i++) {
      const u = (i / (steps - 1)) * (1 + glow)
      const edge = u <= 1 ? u * u * (3 - 2 * u) : 1 - (u - 1) / glow
      this._growTable[i] = 1 + grow * edge
    }
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
      grow:     1,               // size factor while inside a bubble
      rim:      Math.floor(Math.random() * this._bubbleColors.length),   // this dot's edge color
      density,
      color:    this._baseColor,
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

    // Color step inside a bubble (see _buildColors); -1 = idle color
    let level = -1

    if (distSq < opts.interactionSq) {
      const dist  = Math.sqrt(distSq) || 1
      const force = (opts.interactionDistance - dist) / opts.interactionDistance
      p.x    -= (dx / dist) * force * p.density * 0.6
      p.y    -= (dy / dist) * force * p.density * 0.6
      level   = (dist / opts.interactionDistance * this._levelScale) | 0
    } else {
      p.x    -= (p.x - p.baseX) / 20
      p.y    -= (p.y - p.baseY) / 20
      if (distSq < opts.glowSq) {
        level = (Math.sqrt(distSq) / opts.interactionDistance * this._levelScale) | 0
      }
    }

    if (blast.active) {
      const bdx     = p.x - blast.x
      const bdy     = p.y - blast.y
      const bdistSq = bdx * bdx + bdy * bdy
      const glowR   = blast.radius * (1 + this._bubble.glow)
      if (bdistSq < glowR * glowR) {
        const bdist = Math.sqrt(bdistSq) || 1
        if (bdist < blast.radius) {
          const bforce = (blast.radius - bdist) / blast.radius
          p.vx += (bdx / bdist) * bforce * 15
          p.vy += (bdy / bdist) * bforce * 15
        }
        level = (bdist / blast.radius * this._levelScale) | 0
      }
    }

    if (level < 0) {
      p.color = this._baseColor
      p.grow  = 1
    } else {
      p.color = this._bubbleColors[p.rim][level]
      p.grow  = this._growTable[level]
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
      const side = p.side * p.grow
      ctx.fillRect(p.x - side / 2, p.y - side / 2, side, side)
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
