// Drawable multi-point LFO curve editor (Vital-style):
//  - click empty space: add a point
//  - drag a point: move it (first/last points are pinned to x=0 / x=1)
//  - right-click a point: delete it
//  - drag the middle of a segment vertically: bend it (power curve)
//  - Ctrl while dragging: snap to a 16x8 grid

import type { SynthEngine } from '../audio/engine'
import { evalLfoShape, MAX_LFO_POINTS, type LfoPoint } from '../shared/messages'
import { el } from './common'

const HIT = 10

export class LfoEditor {
  readonly root: HTMLElement
  private readonly canvas: HTMLCanvasElement
  private readonly cx: CanvasRenderingContext2D
  private w = 0
  private h = 0
  private dragPoint = -1
  private dragSegment = -1
  private dragStartPower = 0
  private dragStartY = 0

  constructor(private readonly engine: SynthEngine, private lfo: number) {
    this.root = el('div', 'lfo-editor')
    this.canvas = el('canvas')
    this.root.appendChild(this.canvas)
    this.cx = this.canvas.getContext('2d')!

    new ResizeObserver(() => this.resize()).observe(this.root)

    this.canvas.addEventListener('pointerdown', e => this.onDown(e))
    this.canvas.addEventListener('pointermove', e => this.onMove(e))
    const up = () => {
      this.dragPoint = -1
      this.dragSegment = -1
    }
    this.canvas.addEventListener('pointerup', up)
    this.canvas.addEventListener('pointercancel', up)
    this.canvas.addEventListener('contextmenu', e => e.preventDefault())
  }

  setLfo(lfo: number): void {
    this.lfo = lfo
    this.draw()
  }

  private get points(): LfoPoint[] {
    return this.engine.lfoShapes[this.lfo]
  }

  private resize(): void {
    const dpr = window.devicePixelRatio || 1
    this.w = this.root.clientWidth
    this.h = this.root.clientHeight
    this.canvas.width = this.w * dpr
    this.canvas.height = this.h * dpr
    this.canvas.style.width = `${this.w}px`
    this.canvas.style.height = `${this.h}px`
    this.cx.setTransform(dpr, 0, 0, dpr, 0, 0)
    this.draw()
  }

  private toX(x: number): number {
    return x * this.w
  }
  private toY(y: number): number {
    return (1 - y) * this.h
  }

  private pointAt(px: number, py: number): number {
    return this.points.findIndex(p => Math.hypot(this.toX(p.x) - px, this.toY(p.y) - py) < HIT)
  }

  private segmentAt(px: number, py: number): number {
    const pts = this.points
    for (let i = 0; i < pts.length - 1; i++) {
      const mx = (pts[i].x + pts[i + 1].x) / 2
      const my = evalLfoShape(pts, mx)
      if (Math.hypot(this.toX(mx) - px, this.toY(my) - py) < HIT) return i
    }
    return -1
  }

  private onDown(e: PointerEvent): void {
    const rect = this.canvas.getBoundingClientRect()
    const px = e.clientX - rect.left
    const py = e.clientY - rect.top
    const pi = this.pointAt(px, py)

    if (e.button === 2) {
      if (pi > 0 && pi < this.points.length - 1) {
        const pts = this.points.slice()
        pts.splice(pi, 1)
        this.commit(pts)
      }
      return
    }
    if (pi >= 0) {
      this.dragPoint = pi
      this.canvas.setPointerCapture(e.pointerId)
      return
    }
    const si = this.segmentAt(px, py)
    if (si >= 0) {
      this.dragSegment = si
      this.dragStartPower = this.points[si].power
      this.dragStartY = py
      this.canvas.setPointerCapture(e.pointerId)
      return
    }
    // add a point
    if (this.points.length >= MAX_LFO_POINTS) return
    const pts = this.points.slice()
    const x = Math.max(0.001, Math.min(0.999, px / this.w))
    const y = Math.max(0, Math.min(1, 1 - py / this.h))
    let insert = pts.findIndex(p => p.x > x)
    if (insert < 0) insert = pts.length - 1
    pts.splice(insert, 0, { x, y, power: 0 })
    this.commit(pts)
    this.dragPoint = insert
    this.canvas.setPointerCapture(e.pointerId)
  }

  private onMove(e: PointerEvent): void {
    const rect = this.canvas.getBoundingClientRect()
    const px = e.clientX - rect.left
    const py = e.clientY - rect.top

    if (this.dragPoint >= 0) {
      const pts = this.points.slice().map(p => ({ ...p }))
      const p = pts[this.dragPoint]
      let x = px / this.w
      let y = 1 - py / this.h
      if (e.ctrlKey || e.metaKey) {
        x = Math.round(x * 16) / 16
        y = Math.round(y * 8) / 8
      }
      if (this.dragPoint === 0) x = 0
      else if (this.dragPoint === pts.length - 1) x = 1
      else x = Math.max(pts[this.dragPoint - 1].x + 0.002, Math.min(pts[this.dragPoint + 1].x - 0.002, x))
      p.x = Math.max(0, Math.min(1, x))
      p.y = Math.max(0, Math.min(1, y))
      this.commit(pts)
      return
    }
    if (this.dragSegment >= 0) {
      const pts = this.points.slice().map(p => ({ ...p }))
      const delta = (this.dragStartY - py) / 80
      const sign = pts[this.dragSegment + 1].y >= pts[this.dragSegment].y ? 1 : -1
      pts[this.dragSegment].power = Math.max(-1, Math.min(1, this.dragStartPower + delta * sign))
      this.commit(pts)
      return
    }
    // hover cursor
    const pi = this.pointAt(px, py)
    const si = pi < 0 ? this.segmentAt(px, py) : -1
    this.canvas.style.cursor = pi >= 0 ? 'grab' : si >= 0 ? 'ns-resize' : 'crosshair'
  }

  private commit(pts: LfoPoint[]): void {
    this.engine.setLfoShape(this.lfo, pts)
    this.draw()
  }

  draw(): void {
    const c = this.cx
    const w = this.w
    const h = this.h
    if (!w || !h) return
    c.clearRect(0, 0, w, h)

    // grid
    c.strokeStyle = '#23252d'
    c.lineWidth = 1
    for (let i = 1; i < 16; i++) {
      c.beginPath()
      c.moveTo((i / 16) * w, 0)
      c.lineTo((i / 16) * w, h)
      c.stroke()
    }
    for (let i = 1; i < 4; i++) {
      c.beginPath()
      c.moveTo(0, (i / 4) * h)
      c.lineTo(w, (i / 4) * h)
      c.stroke()
    }

    const pts = this.points

    // curve + fill
    c.beginPath()
    c.moveTo(0, this.toY(evalLfoShape(pts, 0)))
    const steps = Math.max(64, w)
    for (let i = 1; i <= steps; i++) {
      const x = i / steps
      c.lineTo(this.toX(x), this.toY(evalLfoShape(pts, x)))
    }
    c.strokeStyle = '#4cd97b'
    c.lineWidth = 2
    c.stroke()
    c.lineTo(w, h)
    c.lineTo(0, h)
    c.closePath()
    c.fillStyle = '#4cd97b18'
    c.fill()

    // points + segment handles
    for (let i = 0; i < pts.length - 1; i++) {
      const mx = (pts[i].x + pts[i + 1].x) / 2
      c.beginPath()
      c.arc(this.toX(mx), this.toY(evalLfoShape(pts, mx)), 3, 0, 2 * Math.PI)
      c.fillStyle = '#4cd97b66'
      c.fill()
    }
    for (const p of pts) {
      c.beginPath()
      c.arc(this.toX(p.x), this.toY(p.y), 4.5, 0, 2 * Math.PI)
      c.fillStyle = '#e8eaf0'
      c.fill()
      c.strokeStyle = '#4cd97b'
      c.stroke()
    }

    // live output level marker
    const live = this.engine.sourceValues[6 + this.lfo] ?? 0
    c.beginPath()
    c.moveTo(0, this.toY(live))
    c.lineTo(w, this.toY(live))
    c.strokeStyle = '#4cd97b40'
    c.stroke()
  }
}
