import { useState, useEffect, useRef } from 'react'
import * as fabric from 'fabric'
import { SHIRT_COLORS, AREAS, PRINT_AREAS, CANVAS_W, CANVAS_H } from '../lib/constants'
import { detectColorsOffscreen } from '../lib/colorDetection'
import AppBar from './AppBar'
import Btn from './Btn'
import SLabel from './SLabel'
import Alert from './Alert'
import Modal from './Modal'
import Icon from './Icon'
import TShirtBackground from './TShirtBackground'

export default function EditorScreen({ onConfirm, onBack, savedState }) {
  const [shirtColor, setShirtColor] = useState(savedState?.shirtColor || 'azul_marino')
  const [activeArea, setActiveArea] = useState(savedState?.activeArea || 'frente')
  const [canvasStates, setCanvasStates] = useState(savedState?.canvasStates || {})
  const [designs, setDesigns] = useState(savedState?.designs || [])
  const [lowResWarning, setLowResWarning] = useState(false)
  const [uploadModal, setUploadModal] = useState(null)
  const [hasSeenUploadModal, setHasSeenUploadModal] = useState(savedState?.hasSeenUploadModal || false)

  const [confirmModal, setConfirmModal] = useState(false)
  const [colorsByArea, setColorsByArea] = useState({})
  const [detectingColors, setDetectingColors] = useState(false)
  const [editingArea, setEditingArea] = useState(null)
  const [editValue, setEditValue] = useState('')

  const canvasRef = useRef(null)
  const fabricRef = useRef(null)
  const fileInputRef = useRef(null)
  const activeAreaRef = useRef(activeArea)
  const canvasStatesRef = useRef(canvasStates)

  activeAreaRef.current = activeArea
  canvasStatesRef.current = canvasStates

  const colorHex = SHIRT_COLORS.find(c => c.id === shirtColor)?.hex || '#1E3A5F'
  const colorLabel = SHIRT_COLORS.find(c => c.id === shirtColor)?.label

  // Init Fabric
  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: CANVAS_W, height: CANVAS_H, backgroundColor: '', preserveObjectStacking: true,
    })
    fabricRef.current = canvas

    const saved = canvasStatesRef.current['frente']
    if (saved) {
      const clean = { ...saved, objects: (saved.objects || []).filter(o => o.name !== '__guide') }
      canvas.loadFromJSON(clean, () => { canvas.renderAll(); updateDesignList() })
    }
    return () => { canvas.dispose() }
  }, [])

  const updateDesignList = () => {
    if (!fabricRef.current) return
    const objs = fabricRef.current.getObjects().filter(o => o.name !== '__guide')
    setDesigns(prev => {
      const otherAreas = prev.filter(d => d.area !== activeAreaRef.current)
      const currentArea = prev.filter(d => d.area === activeAreaRef.current)
      const existingIds = new Set(prev.map(d => d.id))
      const newItems = objs.filter(o => !existingIds.has(o.name))
        .map(o => ({ id: o.name, filename: o._filename || o.name, area: activeAreaRef.current }))
      const updatedCurrent = [...currentArea.filter(d => objs.find(o => o.name === d.id)), ...newItems]
      return [...otherAreas, ...updatedCurrent]
    })
  }

  // Switch area
  const switchArea = (area) => {
    if (!fabricRef.current || area === activeArea) return
    const json = fabricRef.current.toJSON(['name', '_filename'])
    const newStates = { ...canvasStatesRef.current, [activeArea]: json }
    setCanvasStates(newStates)
    canvasStatesRef.current = newStates
    setActiveArea(area)

    fabricRef.current.clear()

    const saved = newStates[area]
    if (saved) {
      const clean = { ...saved, objects: (saved.objects || []).filter(o => o.name !== '__guide') }
      fabricRef.current.loadFromJSON(clean, () => {
        fabricRef.current.renderAll()
        updateDesignList()
      })
    } else {
      fabricRef.current.renderAll()
    }
  }

  // Upload
  const handleUploadClick = () => {
    if (!hasSeenUploadModal) setUploadModal('msg1')
    else fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    e.target.value = ''
    if (!['image/png', 'image/svg+xml'].includes(file.type)) { alert('Solo PNG o SVG.'); return }
    if (file.size > 10 * 1024 * 1024) { alert('Maximo 10 MB.'); return }
    const reader = new FileReader()
    reader.onload = (ev) => {
      const pa = PRINT_AREAS[activeAreaRef.current]
      fabric.FabricImage.fromURL(ev.target.result).then((img) => {
        if (file.type === 'image/png') {
          const dpi = (img.width / (activeAreaRef.current.startsWith('manga') ? 7.4 : 29.7)) * 2.54
          if (dpi < 150) setLowResWarning(true)
        }
        const maxW = pa.w * 0.85, maxH = pa.h * 0.85
        const scale = Math.min(maxW / (img.width || 1), maxH / (img.height || 1))
        const id = 'design-' + Date.now()
        img.set({
          left: pa.x + pa.w / 2, top: pa.y + pa.h / 2,
          originX: 'center', originY: 'center',
          scaleX: scale, scaleY: scale,
          name: id, _filename: file.name,
          cornerColor: '#1D6BFF', cornerStyle: 'circle',
          borderColor: '#1D6BFF', transparentCorners: false,
        })
        fabricRef.current?.add(img)
        fabricRef.current?.setActiveObject(img)
        fabricRef.current?.renderAll()
        setDesigns(prev => [...prev, { id, filename: file.name, area: activeAreaRef.current }])
      })
    }
    reader.readAsDataURL(file)
  }

  const deleteDesign = (id) => {
    const obj = fabricRef.current?.getObjects().find(o => o.name === id)
    if (obj) { fabricRef.current.remove(obj); fabricRef.current.renderAll() }
    setDesigns(prev => prev.filter(d => d.id !== id))
  }

  // Confirm → detect colors
  const handleConfirmClick = async () => {
    const json = fabricRef.current?.toJSON(['name', '_filename'])
    const allStates = { ...canvasStatesRef.current, [activeArea]: json }
    setCanvasStates(allStates)
    canvasStatesRef.current = allStates

    setDetectingColors(true)
    setConfirmModal(true)
    setEditingArea(null)
    setEditValue('')

    const areasWithContent = AREAS.filter(a =>
      designs.some(d => d.area === a.id) ||
      (allStates[a.id]?.objects || []).filter(o => o.name !== '__guide').length > 0
    )

    const results = {}
    await Promise.all(areasWithContent.map(async (a) => {
      const detected = await detectColorsOffscreen(allStates[a.id], a.id)
      results[a.id] = detected
    }))

    setColorsByArea(results)
    setDetectingColors(false)
  }

  const setAreaColor = (areaId, val) => {
    const v = Math.max(1, parseInt(val) || 1)
    setColorsByArea(prev => ({ ...prev, [areaId]: v }))
  }

  const doConfirm = () => {
    const snap = (() => { try { return fabricRef.current?.toDataURL({ format: 'png', multiplier: 0.5 }) } catch (e) { return null } })()
    const json = fabricRef.current?.toJSON(['name', '_filename'])
    const allStates = { ...canvasStatesRef.current, [activeArea]: json }
    onConfirm({
      shirtColor, designs, colorsByArea,
      colorCount: Object.values(colorsByArea).reduce((a, b) => a + b, 0) || 1,
      canvasStates: allStates, activeArea,
      hasSeenUploadModal: true, canvasSnapshot: snap,
    })
    setConfirmModal(false)
  }

  const areasWithDesigns = AREAS.filter(a => designs.some(d => d.area === a.id))
  const hasDesigns = designs.length > 0

  return (
    <div className="min-h-full bg-dark-bg flex flex-col">
      <AppBar title="Personaliza tu remera" onBack={onBack} step={2} totalSteps={4} />
      <input ref={fileInputRef} type="file" accept=".png,.svg,image/png,image/svg+xml" className="hidden" onChange={handleFileChange} />

      {/* Color selector */}
      <div className="px-4 pt-3.5">
        <div className="flex items-center gap-2 flex-wrap">
          <SLabel>Color:</SLabel>
          {SHIRT_COLORS.map(c => (
            <button key={c.id} onClick={() => setShirtColor(c.id)} title={c.label}
              className="w-7 h-7 rounded-full outline-none transition-all shrink-0 cursor-pointer border-none"
              style={{
                background: c.hex,
                border: shirtColor === c.id ? '3px solid #1D6BFF' : '2px solid rgba(255,255,255,0.08)',
                boxShadow: shirtColor === c.id ? '0 0 0 2px rgba(29,107,255,0.35)' : 'none',
              }} />
          ))}
          <span className="text-xs text-text-secondary ml-0.5">{colorLabel}</span>
        </div>
      </div>

      {/* Area tabs */}
      <div className="px-4 pt-3 flex gap-1.5">
        {AREAS.map(a => {
          const hasContent = designs.some(d => d.area === a.id)
          return (
            <button key={a.id} onClick={() => switchArea(a.id)}
              className={`
                flex-1 py-2.5 px-1 text-[11px] font-semibold border-none rounded-lg cursor-pointer
                transition-all relative
                ${activeArea === a.id
                  ? 'bg-accent text-white shadow-[0_2px_12px_rgba(29,107,255,0.35)]'
                  : 'bg-dark-surface text-text-secondary'
                }
              `}>
              {a.short}
              {hasContent && a.id !== activeArea && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-success" />
              )}
            </button>
          )
        })}
      </div>

      {/* Canvas */}
      <div className="relative mx-auto mt-2 drop-shadow-[0_8px_32px_rgba(0,0,0,0.5)]" style={{ width: CANVAS_W }}>
        <TShirtBackground color={colorHex} area={activeArea} />
        <canvas ref={canvasRef} className="block relative z-[1]" />
      </div>

      {/* Low-res warning */}
      {lowResWarning && (
        <div className="px-4 pt-2">
          <Alert type="warn">Imagen de baja resolucion — puede verse pixelada al imprimir.</Alert>
        </div>
      )}

      {/* Upload button */}
      <div className="px-4 pt-2">
        <Btn onClick={handleUploadClick} variant="secondary" fullWidth icon="upload">
          Subir diseno a {AREAS.find(a => a.id === activeArea)?.label}
        </Btn>
      </div>

      {/* Design list */}
      {designs.length > 0 && (
        <div className="px-4 pt-2">
          <SLabel>Disenos agregados</SLabel>
          <div className="flex flex-col gap-1.5">
            {designs.map(d => (
              <div key={d.id} className="flex items-center gap-2.5 py-2.5 px-3 bg-dark-surface rounded-[10px] border border-dark-border">
                <Icon name="image" size={16} color="#7A96BF" />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] text-text-primary overflow-hidden text-ellipsis whitespace-nowrap">{d.filename}</div>
                  <div className="text-[11px] text-accent font-semibold">{AREAS.find(a => a.id === d.area)?.label}</div>
                </div>
                <button onClick={() => deleteDesign(d.id)}
                  className="bg-transparent border-none cursor-pointer p-1 flex items-center">
                  <Icon name="trash" size={15} color="#FF4D6A" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="px-4 pt-2 pb-8 mt-auto">
        <Btn onClick={handleConfirmClick} disabled={!hasDesigns} fullWidth>
          Confirmar diseno →
        </Btn>
        {!hasDesigns && <div className="text-center text-xs text-text-muted mt-2">Subi al menos un diseno para continuar</div>}
      </div>

      {/* Modal: tip 1 */}
      <Modal open={uploadModal === 'msg1'} noClose title="Antes de subir tu diseno">
        <Alert type="info">Para la mejor calidad de impresion, subi tus archivos en la mayor resolucion disponible.</Alert>
        <div className="h-5" />
        <Btn fullWidth onClick={() => setUploadModal('msg2')}>Entendido</Btn>
        <div className="h-2" />
      </Modal>

      {/* Modal: tip 2 */}
      <Modal open={uploadModal === 'msg2'} noClose title="Una cosa mas">
        <Alert type="success">No te preocupes si las ubicaciones no quedan perfectas. Te enviaremos una prueba antes de producir.</Alert>
        <div className="h-5" />
        <Btn fullWidth onClick={() => { setUploadModal(null); setHasSeenUploadModal(true); setTimeout(() => fileInputRef.current?.click(), 100) }}>
          Subir diseno
        </Btn>
        <div className="h-2" />
      </Modal>

      {/* Modal: confirm colors */}
      <Modal open={confirmModal} onClose={() => setConfirmModal(false)} title="Colores por area de impresion">
        {detectingColors ? (
          <div className="text-center py-8 text-text-secondary text-sm">
            Detectando colores...
          </div>
        ) : (
          <>
            <div className="mb-4">
              <Alert type="info">Revisa la cantidad de colores por cada area. Esto afecta el costo de impresion.</Alert>
            </div>
            <div className="flex flex-col gap-2 mb-4">
              {areasWithDesigns.map(a => {
                const detected = colorsByArea[a.id] || 1
                const isEditing = editingArea === a.id
                return (
                  <div key={a.id} className="bg-[#152035] rounded-xl py-3 px-3.5"
                    style={{ border: `1px solid ${isEditing ? '#1D6BFF55' : '#1C3050'}` }}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-[13px] font-semibold text-text-primary">{a.label}</div>
                      <div className="flex items-center gap-2">
                        {isEditing ? (
                          <>
                            <input type="number" min={1} max={20}
                              value={editValue}
                              onChange={e => setEditValue(e.target.value)}
                              autoFocus
                              className="w-15 bg-dark-surface border-[1.5px] border-accent rounded-lg py-1.5 px-2 text-[15px] font-bold text-text-primary outline-none text-center" />
                            <Btn small onClick={() => {
                              if (parseInt(editValue) > 0) setAreaColor(a.id, editValue)
                              setEditingArea(null); setEditValue('')
                            }}>OK</Btn>
                          </>
                        ) : (
                          <>
                            <span className="text-[22px] font-extrabold text-accent leading-none">{detected}</span>
                            <span className="text-xs text-text-secondary">color{detected !== 1 ? 'es' : ''}</span>
                            <button onClick={() => { setEditingArea(a.id); setEditValue(String(detected)) }}
                              className="bg-transparent border border-dark-border rounded-lg py-1.5 px-2.5 text-xs text-text-secondary cursor-pointer">
                              Editar
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <Btn fullWidth onClick={doConfirm}>Confirmar y ver cotizacion →</Btn>
            <div className="h-2" />
          </>
        )}
      </Modal>
    </div>
  )
}
