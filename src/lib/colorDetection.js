import * as fabric from 'fabric'
import { CANVAS_W, CANVAS_H, PRINT_AREAS } from './constants'

export function detectColorsOffscreen(canvasJson, areaId) {
  return new Promise((resolve) => {
    const pa = PRINT_AREAS[areaId]
    const objs = (canvasJson?.objects || []).filter(o => o.name !== '__guide')
    if (!objs.length) { resolve(0); return }

    const el = document.createElement('canvas')
    el.style.display = 'none'
    document.body.appendChild(el)
    const fc = new fabric.Canvas(el, { width: CANVAS_W, height: CANVAS_H, backgroundColor: '' })
    const clean = { ...canvasJson, objects: objs }

    fc.loadFromJSON(clean, () => {
      try {
        const dataURL = fc.toDataURL({ format: 'png', left: pa.x, top: pa.y, width: pa.w, height: pa.h, multiplier: 0.5 })
        const img = new Image()
        img.onload = () => {
          const c = document.createElement('canvas')
          c.width = img.width; c.height = img.height
          const ctx = c.getContext('2d')
          ctx.drawImage(img, 0, 0)
          const data = ctx.getImageData(0, 0, c.width, c.height).data
          const colorSet = new Set()
          for (let i = 0; i < data.length; i += 20) {
            if (data[i + 3] < 30) continue
            const r = Math.round(data[i] / 28) * 28
            const g = Math.round(data[i + 1] / 28) * 28
            const b = Math.round(data[i + 2] / 28) * 28
            colorSet.add(`${r}|${g}|${b}`)
          }
          fc.dispose(); document.body.removeChild(el)
          resolve(Math.max(1, Math.min(colorSet.size, 12)))
        }
        img.onerror = () => { fc.dispose(); document.body.removeChild(el); resolve(1) }
        img.src = dataURL
      } catch (e) { fc.dispose(); document.body.removeChild(el); resolve(1) }
    })
  })
}
