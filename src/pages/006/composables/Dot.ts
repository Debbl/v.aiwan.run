import type P5 from 'p5'

export interface Rect {
  i: number
  x: number
  color: [number, number, number]
  opacity: number
}

class Dot {
  s: P5
  itemsCount: number
  rect: Rect

  constructor(s: P5, itemsCount: number, i: number, x: number) {
    this.s = s
    this.itemsCount = itemsCount
    this.rect = { i, x, color: [148, 180, 159], opacity: 255 }
  }

  getX() {
    return this.rect.x
  }

  setColor(color: [number, number, number]) {
    this.rect = { ...this.rect, color }
  }

  setOpacity(opacity: number) {
    this.rect = { ...this.rect, opacity }
  }

  setValue(_value: number) {
    let value = _value
    const canvasLength = this.s.width

    if (value < -1) {
      value = -1
    } else if (value > 1) {
      value = 1
    }

    const itemWidth = canvasLength / this.itemsCount

    const itemCenter = [(this.rect.x + 0.5) * itemWidth, canvasLength / 2]
    this.s.fill([...this.rect.color, this.rect.opacity])

    this.s.rect(
      ...(itemCenter as [number, number]),
      itemWidth / 2 - 1,
      (canvasLength / 2) * value,
    )
  }
}

export default Dot
