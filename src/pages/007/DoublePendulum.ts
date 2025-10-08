const G = 1.2 // gravitational acceleration
const M = 1.0 // mass
const L = 1.0 // length
const barWidth = 0.04
const barLength = 0.23
const massRadius = 0.035
const tailThickness = 0.012
// WebGL stuff
const quad = new Float32Array([-1, -1, +1, -1, -1, +1, +1, +1])

const massShader = {
  vert: `
attribute vec2 a_point;
uniform   vec2 u_center;
uniform   vec2 u_aspect;
varying   vec2 v_point;
void main() {
    v_point = a_point;
    gl_Position = vec4(a_point * ${massRadius} / u_aspect + u_center, 0, 1);
}`,
  frag: `
uniform vec2 u_aspect;
uniform vec3 u_color;
varying vec2 v_point;
void main() {
    float dist = distance(vec2(0, 0), v_point);
    float v = smoothstep(1.0, 0.9, dist);
    gl_FragColor = vec4(u_color, v);
}`,
}

const barShader = {
  vert: `
attribute vec2  a_point;
uniform   float u_angle;
uniform   vec2  u_attach;
uniform   vec2  u_aspect;
void main() {
    mat2 rotate = mat2(+cos(u_angle), +sin(u_angle),
                       -sin(u_angle), +cos(u_angle));
    vec2 pos = rotate * (a_point * vec2(1, ${barWidth}) + vec2(1, 0));
    gl_Position = vec4((pos * ${barLength} / u_aspect + u_attach), 0, 1);
}`,
  frag: `
uniform vec3 u_color;
void main() {
    gl_FragColor = vec4(u_color, 1);
}`,
}

const tailShader = {
  vert: `
attribute vec2  a_point;
attribute float a_alpha;
uniform   vec2  u_aspect;
varying   float v_alpha;
void main() {
    v_alpha = a_alpha;
    gl_Position = vec4(a_point * vec2(1, -1) / u_aspect, 0, 1);
}`,
  frag: `
uniform vec3  u_color;
uniform float u_cutoff;
varying float v_alpha;
void main() {
    float icutoff = 1.0 - u_cutoff;
    gl_FragColor = vec4(u_color, max(0.0, v_alpha - u_cutoff) / icutoff);
}`,
}

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

function clear2d(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

function normalize(v0: number, v1: number) {
  const d = Math.sqrt(v0 * v0 + v1 * v1)
  return [v0 / d, v1 / d]
}

function sub(a0: number, a1: number, b0: number, b1: number) {
  return [a0 - b0, a1 - b1]
}

function add(a0: number, a1: number, b0: number, b1: number) {
  return [a0 + b0, a1 + b1]
}

function dot(ax: number, ay: number, bx: number, by: number) {
  return ax * bx + ay * by
}
/* Convert tail line into a triangle strip.
 * https://forum.libcinder.org/topic/smooth-thick-lines-using-geometry-shader
 */
function polyline(hist: History, poly: Float32Array) {
  const w = tailThickness
  let i = -1
  let x0 = 0
  let y0 = 0
  let xf = 0
  let yf = 0

  hist.visit((x1, y1, x2, y2) => {
    if (++i === 0) {
      const [lx, ly] = sub(x2, y2, x1, y1)
      const [nx, ny] = normalize(-ly, lx)
      poly[0] = x1 + w * nx
      poly[1] = y1 + w * ny
      poly[2] = x1 - w * nx
      poly[3] = y1 - w * ny
    } else {
      let [ax, ay] = sub(x1, y1, x0, y0)
      ;[ax, ay] = normalize(ax, ay)
      let [bx, by] = sub(x2, y2, x1, y1)
      ;[bx, by] = normalize(bx, by)
      let [tx, ty] = add(ax, ay, bx, by)
      ;[tx, ty] = normalize(tx, ty)
      const [mx, my] = [-ty, tx]
      const [lx, ly] = sub(x1, y1, x0, y0)
      const [nx, ny] = normalize(-ly, lx)
      const len = Math.min(w, w / dot(mx, my, nx, ny))
      poly[i * 4 + 0] = x1 + mx * len
      poly[i * 4 + 1] = y1 + my * len
      poly[i * 4 + 2] = x1 - mx * len
      poly[i * 4 + 3] = y1 - my * len
    }
    x0 = x1
    y0 = y1
    xf = x2
    yf = y2
  })

  const [lx, ly] = sub(xf, yf, x0, y0)
  const [nx, ny] = normalize(-ly, lx)
  i++
  poly[i * 4 + 0] = xf + w * nx
  poly[i * 4 + 1] = yf + w * ny
  poly[i * 4 + 2] = xf - w * nx
  poly[i * 4 + 3] = yf - w * ny
}

function compile(gl: WebGLRenderingContext, vert: any, frag: any) {
  const v = gl.createShader(gl.VERTEX_SHADER)!
  gl.shaderSource(v, `precision mediump float;${vert}`)

  const f = gl.createShader(gl.FRAGMENT_SHADER)!
  gl.shaderSource(f, `precision mediump float;${frag}`)
  gl.compileShader(v)

  if (!gl.getShaderParameter(v, gl.COMPILE_STATUS))
    throw new Error(gl.getShaderInfoLog(v)!)
  gl.compileShader(f)
  if (!gl.getShaderParameter(f, gl.COMPILE_STATUS))
    throw new Error(gl.getShaderInfoLog(f)!)
  const p = gl.createProgram()
  gl.attachShader(p, v)
  gl.attachShader(p, f)
  gl.linkProgram(p)
  if (!gl.getProgramParameter(p, gl.LINK_STATUS))
    throw new Error(gl.getProgramInfoLog(p)!)
  gl.deleteShader(v)
  gl.deleteShader(f)
  const result = {
    program: p,
  } as any
  const nattrib = gl.getProgramParameter(p, gl.ACTIVE_ATTRIBUTES)
  for (let a = 0; a < nattrib; a++) {
    const name = gl.getActiveAttrib(p, a)!.name

    result[name] = gl.getAttribLocation(p, name)
  }
  const nuniform = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS)
  for (let u = 0; u < nuniform; u++) {
    const name = gl.getActiveUniform(p, u)!.name
    result[name] = gl.getUniformLocation(p, name)
  }
  return result
}

function draw3d(
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  webgl: GLRenderer,
  pendulums: Pendulum[],
) {
  const w = gl.canvas.width
  const h = gl.canvas.height
  const z = Math.min(w, h)
  const ax = w / z
  const ay = h / z
  const d = barLength * 2

  const tail = webgl.tail
  gl.useProgram(tail.program)
  gl.uniform2f(tail.u_aspect, ax / d, ay / d)
  gl.bindBuffer(gl.ARRAY_BUFFER, webgl.alpha)
  gl.enableVertexAttribArray(tail.a_alpha)
  gl.vertexAttribPointer(tail.a_alpha, 1, gl.FLOAT, false, 0, 0)
  gl.bindBuffer(gl.ARRAY_BUFFER, webgl.tailb)
  gl.enableVertexAttribArray(tail.a_point)
  gl.vertexAttribPointer(tail.a_point, 2, gl.FLOAT, false, 0, 0)
  for (let i = 0; i < pendulums.length; i++) {
    const p = pendulums[i]
    if (p.endTail.length) {
      polyline(p.endTail, webgl.tailpoly)
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, webgl.tailpoly)
      gl.uniform3fv(tail.u_color, p.tailColor)
      const cutoff = 1 - (p.endTail.length * 2) / p.endTail.v.length
      gl.uniform1f(tail.u_cutoff, cutoff)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, p.endTail.length * 2)
    }
  }

  const mass = webgl.mass
  gl.useProgram(mass.program)
  gl.uniform2f(mass.u_aspect, ax, ay)
  gl.bindBuffer(gl.ARRAY_BUFFER, webgl.quad)
  gl.enableVertexAttribArray(mass.a_point)
  gl.vertexAttribPointer(mass.a_point, 2, gl.FLOAT, false, 0, 0)
  for (let i = 0; i < pendulums.length; i++) {
    const p = pendulums[i]
    let [x1, y1, x2, y2] = p.positions()
    x1 *= d / ax
    y1 *= d / ay
    x2 *= d / ax
    y2 *= d / ay
    gl.uniform3fv(mass.u_color, p.massColor)
    gl.uniform2f(mass.u_center, x1, y1)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    gl.uniform2f(mass.u_center, x2, y2)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }

  const bar = webgl.bar
  gl.useProgram(bar.program)
  gl.uniform2f(bar.u_aspect, ax, ay)
  gl.enableVertexAttribArray(bar.a_point)
  /* Quad buffer still bound from previous draws */
  gl.vertexAttribPointer(bar.a_point, 2, gl.FLOAT, false, 0, 0)
  for (let i = 0; i < pendulums.length; i++) {
    const p = pendulums[i]
    let [x1, y1, _x2, _y2] = p.positions()
    const [a1, a2, _p1, _p2] = p.state()
    x1 *= d / ax
    y1 *= d / ay
    gl.uniform3fv(bar.u_color, p.massColor)
    gl.uniform2f(bar.u_attach, 0, 0)
    gl.uniform1f(bar.u_angle, a1 - Math.PI / 2)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    gl.uniform2f(bar.u_attach, x1, y1)
    gl.uniform1f(bar.u_angle, a2 - Math.PI / 2)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }
}

function clear3d(gl: WebGLRenderingContext | WebGL2RenderingContext) {
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
  gl.clear(gl.COLOR_BUFFER_BIT)
}

class GLRenderer {
  gl: WebGLRenderingContext
  quad: WebGLBuffer
  tailb: WebGLBuffer
  alpha: WebGLBuffer
  tailpoly: Float32Array
  mass: any
  bar: any
  tail: any

  constructor(gl: WebGLRenderingContext, tailLen: number) {
    this.gl = gl

    gl.clearColor(1, 1, 1, 1)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    this.quad = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quad)
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW)

    this.tailb = gl.createBuffer()
    this.tailpoly = new Float32Array(tailLen * 4)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.tailb)
    gl.bufferData(gl.ARRAY_BUFFER, this.tailpoly.byteLength, gl.STREAM_DRAW)

    this.alpha = gl.createBuffer()
    const alpha = new Float32Array(tailLen * 2)
    for (let i = 0; i < alpha.length; i++) {
      const v = (i + 1) / alpha.length
      alpha[i] = 1 - v
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, this.alpha)
    gl.bufferData(gl.ARRAY_BUFFER, alpha, gl.STATIC_DRAW)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.alpha)
    gl.bufferData(gl.ARRAY_BUFFER, alpha, gl.STATIC_DRAW)

    this.mass = compile(gl, massShader.vert, massShader.frag)
    this.bar = compile(gl, barShader.vert, barShader.frag)
    this.tail = compile(gl, tailShader.vert, tailShader.frag)
  }

  renderAll(pendulums: Pendulum[]) {
    clear3d(this.gl)
    draw3d(this.gl, this, pendulums)
  }
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

  clone(tailMax?: number) {
    let cp2
    if (this.p2 === 0.0) {
      cp2 = Math.random() * 1e-12
    } else {
      cp2 = this.p2 * (1 - Math.random() * 1e-10)
    }

    const init: [number, number, number, number] = [
      this.a1,
      this.a2,
      this.p1,
      cp2,
    ]

    return new Pendulum(tailMax, init)
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
  glRenderer: GLRenderer | null = null
  state: Pendulum[] = [new Pendulum()]

  constructor({
    useWebGL: _useWebGL,
    canvas,
  }: {
    useWebGL?: boolean
    canvas: HTMLCanvasElement
  }) {
    this.canvas = canvas

    const gl = this.canvas.getContext('webgl')
    if (!gl) {
      this.mode = '2d-only'
      this.ctx = canvas.getContext('2d')
      return
    }

    this.mode = '3d'
    this.gl = gl
    this.glRenderer = new GLRenderer(gl, 400)
  }

  render(t: number) {
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

    if (this.mode === '3d' && this.gl && this.glRenderer) {
      this.glRenderer.renderAll(this.state)
    } else if (this.ctx) {
      clear2d(this.ctx)
      for (let i = 0; i < this.state.length; i++) {
        this.state[i].draw2d(this.ctx)
      }
    }

    this.last = t

    window.requestAnimationFrame(this.render.bind(this))
  }
}
