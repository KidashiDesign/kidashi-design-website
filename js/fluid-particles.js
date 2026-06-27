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
      particleColor:       options.particleColor        ?? '#555555',
      activeColor:         options.activeColor          ?? '#ffffff',
      maxBlastRadius:      options.maxBlastRadius       ?? 300,
      hoverDelay:          options.hoverDelay           ?? 100,
      interactionDistance: options.interactionDistance  ?? 10,
    }

    this.ctx         = null
    this.particles   = []
    this.mouse       = { x: 0, y: 0, prevX: 0, prevY: 0 }
    this.blast       = { active: false, x: 0, y: 0, radius: 0 }
    this.rafId       = 0
    this.hoverTimer  = null
    this._handlers   = {}

    this._init()
  }

  /* ── Particle ─────────────────────────────────────── */
  _createParticle(x, y) {
    const opts = this.opts
    return {
      x, y,
      baseX:    x,
      baseY:    y,
      size:     Math.random() * opts.particleSize + 0.5,
      density:  Math.random() * 3 + 1,
      color:    opts.particleColor,
      vx:       0,
      vy:       0,
      get friction() { return 0.9 - 0.01 * this.density },
    }
  }

  _drawParticle(p) {
    const ctx = this.ctx
    ctx.fillStyle = p.color
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx.closePath()
    ctx.fill()
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
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist < opts.interactionDistance) {
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
      const bdist = Math.sqrt(bdx * bdx + bdy * bdy)
      if (bdist < blast.radius) {
        const bfx    = bdx / (bdist || 1)
        const bfy    = bdy / (bdist || 1)
        const bforce = (blast.radius - bdist) / blast.radius
        p.vx += bfx * bforce * 15
        p.vy += bfy * bforce * 15
        const intensity = Math.min(255, Math.floor(255 - bdist))
        p.color = `rgba(${intensity},100,255,0.8)`
      }
    }

    this._drawParticle(p)
  }

  /* ── Setup ────────────────────────────────────────── */
  _initParticles() {
    this.particles = []
    const count = Math.floor(
      (window.innerWidth * window.innerHeight) / this.opts.particleDensity
    )
    for (let i = 0; i < count; i++) {
      this.particles.push(this._createParticle(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight
      ))
    }
  }

  _resize() {
    const pr = window.devicePixelRatio || 1
    this.canvas.width  = window.innerWidth  * pr
    this.canvas.height = window.innerHeight * pr
    this.canvas.style.width  = `${window.innerWidth}px`
    this.canvas.style.height = `${window.innerHeight}px`
    this.ctx.setTransform(pr, 0, 0, pr, 0, 0)
    this._initParticles()
  }

  /* ── Blast ────────────────────────────────────────── */
  _triggerBlast(x, y) {
    this.blast = { active: true, x, y, radius: 0 }
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
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
    for (const p of this.particles) this._updateParticle(p)
    this.rafId = requestAnimationFrame(() => this._animate())
  }

  /* ── Init ─────────────────────────────────────────── */
  _init() {
    this.ctx = this.canvas.getContext('2d', { alpha: true })
    this.ctx.globalCompositeOperation = 'lighter'

    const opts = this.opts
    let lastMove = 0

    const onResize = () => this._resize()

    const onMouseMove = (e) => {
      const now = performance.now()
      if (now - lastMove < 10) return
      lastMove = now

      const prevX = this.mouse.x, prevY = this.mouse.y
      this.mouse = { x: e.clientX, y: e.clientY, prevX, prevY }

      const d = Math.hypot(e.clientX - prevX, e.clientY - prevY)
      if (d < 5) {
        if (!this.hoverTimer) {
          this.hoverTimer = setTimeout(() => this._triggerBlast(e.clientX, e.clientY), opts.hoverDelay)
        }
      } else {
        if (this.hoverTimer) { clearTimeout(this.hoverTimer); this.hoverTimer = null }
      }
    }

    const onClick = (e) => this._triggerBlast(e.clientX, e.clientY)

    const onTouchMove = (e) => {
      if (!e.touches[0]) return
      const prevX = this.mouse.x, prevY = this.mouse.y
      this.mouse = { x: e.touches[0].clientX, y: e.touches[0].clientY, prevX, prevY }
    }

    const onTouchStart = (e) => {
      if (!e.touches[0]) return
      const x = e.touches[0].clientX, y = e.touches[0].clientY
      this.hoverTimer = setTimeout(() => this._triggerBlast(x, y), opts.hoverDelay)
    }

    const onTouchEnd = () => {
      if (this.hoverTimer) { clearTimeout(this.hoverTimer); this.hoverTimer = null }
    }

    window.addEventListener('resize',     onResize)
    window.addEventListener('mousemove',  onMouseMove)
    window.addEventListener('click',      onClick)
    window.addEventListener('touchmove',  onTouchMove,  { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend',   onTouchEnd)

    this._handlers = { onResize, onMouseMove, onClick, onTouchMove, onTouchStart, onTouchEnd }

    this._resize()
    this._animate()
  }

  /* ── Cleanup ──────────────────────────────────────── */
  destroy() {
    cancelAnimationFrame(this.rafId)
    if (this.hoverTimer) clearTimeout(this.hoverTimer)
    const h = this._handlers
    window.removeEventListener('resize',     h.onResize)
    window.removeEventListener('mousemove',  h.onMouseMove)
    window.removeEventListener('click',      h.onClick)
    window.removeEventListener('touchmove',  h.onTouchMove)
    window.removeEventListener('touchstart', h.onTouchStart)
    window.removeEventListener('touchend',   h.onTouchEnd)
  }
}
