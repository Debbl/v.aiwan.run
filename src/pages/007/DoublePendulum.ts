const G = 1.2 // gravitational acceleration
const M = 1.0 // mass
const L = 1.0 // length
const barWidth = 0.04
const barLength = 0.23
const massRadius = 0.035
const tailThickness = 0.012

function derivative(a1: number, a2: number, p1: number, p2: number) {
  const ml2 = M * L * L
  const cos12 = Math.cos(a1 - a2)
  const sin12 = Math.sin(a1 - a2)
  const da1 = ((6 / ml2) * (2 * p1 - 3 * cos12 * p2)) / (16 - 9 * cos12 * cos12)
  const da2 = ((6 / ml2) * (8 * p2 - 3 * cos12 * p1)) / (16 - 9 * cos12 * cos12)
  const dp1 = (ml2 / -2) * (+da1 * da2 * sin12 + ((3 * G) / L) * Math.sin(a1))
  const dp2 = (ml2 / -2) * (-da1 * da2 * sin12 + ((3 * G) / L) * Math.sin(a2))
  return [da1, da2, dp1, dp2]
}

// Update pendulum by timestamp
function rk4(
  k1a1: number,
  k1a2: number,
  k1p1: number,
  k1p2: number,
  dt: number,
) {
  const [k1da1, k1da2, k1dp1, k1dp2] = derivative(k1a1, k1a2, k1p1, k1p2)

  const k2a1 = k1a1 + (k1da1 * dt) / 2
  const k2a2 = k1a2 + (k1da2 * dt) / 2
  const k2p1 = k1p1 + (k1dp1 * dt) / 2
  const k2p2 = k1p2 + (k1dp2 * dt) / 2

  const [k2da1, k2da2, k2dp1, k2dp2] = derivative(k2a1, k2a2, k2p1, k2p2)

  const k3a1 = k1a1 + (k2da1 * dt) / 2
  const k3a2 = k1a2 + (k2da2 * dt) / 2
  const k3p1 = k1p1 + (k2dp1 * dt) / 2
  const k3p2 = k1p2 + (k2dp2 * dt) / 2

  const [k3da1, k3da2, k3dp1, k3dp2] = derivative(k3a1, k3a2, k3p1, k3p2)

  const k4a1 = k1a1 + k3da1 * dt
  const k4a2 = k1a2 + k3da2 * dt
  const k4p1 = k1p1 + k3dp1 * dt
  const k4p2 = k1p2 + k3dp2 * dt

  const [k4da1, k4da2, k4dp1, k4dp2] = derivative(k4a1, k4a2, k4p1, k4p2)

  return [
    k1a1 + ((k1da1 + 2 * k2da1 + 2 * k3da1 + k4da1) * dt) / 6,
    k1a2 + ((k1da2 + 2 * k2da2 + 2 * k3da2 + k4da2) * dt) / 6,
    k1p1 + ((k1dp1 + 2 * k2dp1 + 2 * k3dp1 + k4dp1) * dt) / 6,
    k1p2 + ((k1dp2 + 2 * k2dp2 + 2 * k3dp2 + k4dp2) * dt) / 6,
  ]
}

function color2style(color: [number, number, number]) {
  const r = Math.round(255 * color[0])
  const g = Math.round(255 * color[1])
  const b = Math.round(255 * color[2])
  return `rgb(${r},${g},${b})`
}

function draw2d(
  ctx: CanvasRenderingContext2D,
  midTail: History,
  endTail: History,
  a1: number,
  a2: number,
  massColor: [number, number, number],
  tailColor: [number, number, number],
  midTailColor: [number, number, number],
) {
  const w = ctx.canvas.width
  const h = ctx.canvas.height
  const cx = w / 2
  const cy = h / 2
  const z = Math.min(w, h)
  const d = z * barLength
  const x0 = Math.sin(a1) * d + cx
  const y0 = Math.cos(a1) * d + cy
  const x1 = Math.sin(a2) * d + x0
  const y1 = Math.cos(a2) * d + y0
  const massStyle = color2style(massColor)

  ctx.lineCap = 'butt'
  ctx.lineWidth = (z * tailThickness) / 2

  // Draw middle point tail
  ctx.strokeStyle = color2style(midTailColor)
  let n = midTail.length
  midTail.visit((x0, y0, x1, y1) => {
    ctx.globalAlpha = (n-- / midTail.length) * 0.8
    ctx.beginPath()
    ctx.moveTo(x0 * d + cx, y0 * d + cy)
    ctx.lineTo(x1 * d + cx, y1 * d + cy)
    ctx.stroke()
  })

  // Draw end point tail
  ctx.strokeStyle = color2style(tailColor)
  n = endTail.length
  endTail.visit((x0, y0, x1, y1) => {
    ctx.globalAlpha = n-- / endTail.length
    ctx.beginPath()
    ctx.moveTo(x0 * d + cx, y0 * d + cy)
    ctx.lineTo(x1 * d + cx, y1 * d + cy)
    ctx.stroke()
  })

  ctx.lineWidth = (z * barWidth) / 4
  ctx.lineCap = 'round'
  ctx.lineJoin = 'bevel'
  ctx.strokeStyle = massStyle
  ctx.fillStyle = massStyle
  ctx.globalAlpha = 1.0

  ctx.beginPath()
  ctx.moveTo(cx, cy)
  ctx.lineTo(x0, y0)
  ctx.lineTo(x1, y1)
  ctx.stroke()

  // Draw center point (fixed point) - black
  ctx.beginPath()
  ctx.arc(cx, cy, (z * massRadius) / 2, 0, 2 * Math.PI)
  ctx.fill()

  // Draw middle point (first pendulum) - red
  ctx.fillStyle = color2style(midTailColor)
  ctx.beginPath()
  ctx.arc(x0, y0, (z * massRadius) / 2, 0, 2 * Math.PI)
  ctx.fill()

  // Draw end point (second pendulum) - green
  ctx.fillStyle = color2style(tailColor)
  ctx.beginPath()
  ctx.arc(x1, y1, (z * massRadius) / 2, 0, 2 * Math.PI)
  ctx.fill()
}

function _clear3d(gl: any) {
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
  gl.clear(gl.COLOR_BUFFER_BIT)
}

function clear2d(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

class History {
  i = 0
  length = 0
  v: Float32Array<ArrayBuffer>
  n: number

  constructor(n: number) {
    this.n = n
    this.v = new Float32Array(n * 2)
  }

  push(x: number, y: number) {
    const { i, length, v, n } = this

    v[i * 2 + 0] = x
    v[i * 2 + 1] = y

    this.i = (i + 1) % n
    if (length < n) this.length++
  }

  visit(cb: (x1: number, y1: number, x2: number, y2: number) => void) {
    const { i, length, v, n } = this

    for (let j = i + n - 2; j > i + n - length - 1; j--) {
      const a = (j + 1) % n
      const b = (j + 0) % n

      cb(v[a * 2], v[a * 2 + 1], v[b * 2], v[b * 2 + 1])
    }
  }
}

class Pendulum {
  midTail: History
  endTail: History
  tailColor: [number, number, number] = [0, 1, 0]
  midTailColor: [number, number, number] = [1, 0, 0]
  massColor: [number, number, number] = [0, 0, 0]
  a1 = (Math.random() * Math.PI) / 2 + (Math.PI * 3) / 4
  a2 = (Math.random() * Math.PI) / 2 + (Math.PI * 3) / 4
  p1 = 0.0
  p2 = 0.0

  constructor(tailMax = 400, init?: [number, number, number, number]) {
    if (init) {
      this.a1 = init[0]
      this.a2 = init[1]
      this.p1 = init[2]
      this.p2 = init[3]
    }
    this.midTail = new History(tailMax)
    this.endTail = new History(tailMax)
  }

  state() {
    return [this.a1, this.a2, this.p1, this.p2]
  }

  positions() {
    const x1 = +Math.sin(this.a1)
    const y1 = -Math.cos(this.a1)
    const x2 = +Math.sin(this.a2) + x1
    const y2 = -Math.cos(this.a2) + y1

    return [x1, y1, x2, y2]
  }

  step(dt: number) {
    ;[this.a1, this.a2, this.p1, this.p2] = rk4(
      this.a1,
      this.a2,
      this.p1,
      this.p2,
      dt,
    )

    // Record middle point position (first pendulum)
    this.midTail.push(Math.sin(this.a1), Math.cos(this.a1))

    // Record end point position (second pendulum)
    this.endTail.push(
      Math.sin(this.a1) + Math.sin(this.a2),
      Math.cos(this.a1) + Math.cos(this.a2),
    )
  }

  draw2d(ctx: CanvasRenderingContext2D) {
    draw2d(
      ctx,
      this.midTail,
      this.endTail,
      this.a1,
      this.a2,
      this.massColor,
      this.tailColor,
      this.midTailColor,
    )
  }

  // TODO
  clone(conf: any) {
    if (!conf) conf = {}
    let cp2
    if (this.p2 === 0.0) cp2 = Math.random() * 1e-12
    else cp2 = this.p2 * (1 - Math.random() * 1e-10)
    conf.init = [this.a1, this.a2, this.p1, cp2]

    return new Pendulum(conf)
  }
}

export class DoublePendulum {
  last = 0.0
  dtMax = 30.0 // ms
  running = true
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D | null = null
  mode: '2d-only' | '3d' = '2d-only'
  gl: WebGLRenderingContext | null = null
  state: Pendulum[] = [new Pendulum()]

  constructor({
    useWebGL: _useWebGL,
    canvas,
  }: {
    useWebGL?: boolean
    canvas: HTMLCanvasElement
  }) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
  }

  render(t: number) {
    if (!this.ctx) return

    const dt = Math.min(t - this.last, this.dtMax)
    const ww = window.innerWidth
    const wh = window.innerHeight

    if (this.canvas.width !== ww || this.canvas.height !== wh) {
      /* Only resize when necessary */
      this.canvas.width = ww
      this.canvas.height = wh
    }
    if (this.running) {
      for (let i = 0; i < this.state.length; i++) {
        this.state[i].step(dt / 1000.0)
      }
    }

    clear2d(this.ctx)
    for (let i = 0; i < this.state.length; i++) {
      this.state[i].draw2d(this.ctx)
    }

    this.last = t
    window.requestAnimationFrame(this.render.bind(this))
  }
}
