import type { Cursor } from '../MouseFollowing'

class Particle {
  x: number
  y: number
  particleTrailWidth: number
  strokeColor: string
  rotateSpeed: number
  t: number = Math.random() * 150
  theta: number = Math.random() * Math.PI * 2
  constructor(
    x: number,
    y: number,
    particleTrailWidth: number,
    strokeColor: string,
    rotateSpeed: number,
  ) {
    this.x = x
    this.y = y
    this.particleTrailWidth = particleTrailWidth
    this.strokeColor = strokeColor
    this.rotateSpeed = rotateSpeed
  }

  rotate = (cursor: Cursor, context: CanvasRenderingContext2D) => {
    const ls = {
      x: this.x,
      y: this.y,
    }
    this.theta += this.rotateSpeed
    this.x = cursor.x + Math.cos(this.theta) * this.t
    this.y = cursor.y + Math.sin(this.theta) * this.t

    context.beginPath()
    context.lineWidth = this.particleTrailWidth
    context.strokeStyle = this.strokeColor
    context.moveTo(ls.x, ls.y)
    context.lineTo(this.x, this.y)
    context.stroke()
  }
}

export default Particle
