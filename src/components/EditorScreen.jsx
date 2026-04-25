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

  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: CANVAS_W, height: CANVAS_H, backgroundColor: '', preserveObjectStacking: true,
    })
    fabricRef.current = canvas

    const saved = canvasStatesRef.current['frente']
    if (saved) {
      const clean = { ...saved, objects: (saved.objects || []).filter(o => o.name !== '__guide') }
      canvas.loadFromJSON(clean).then(() => { canvas.renderAll(); updateDesignList() })
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
      fabricRef.current.loadFromJSON(clean).then(() => {
        fabricRef.current.renderAll()
        updateDesignList()
      })
    } else {
      fabricRef.current.renderAll()
    }
  }

  const handleUploadClick = () => {
    if (!hasSeenUploadModal) setUploadModal('msg1')
    else fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    e.target.value = ''
    if (!['image/png', 'image/svg+xml'].includes(file.type)) { alert('Solo PNG o SVG.'); return }
    if (file.size > 10 * 1024 * 1024) { alert('Máximo 10 MB.'); return }
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
    const snap = (() => { try { return fabricRef.current?.toDataURL({ format: 'png', multiplier: 0.5 }) } catch { return null } })()
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
    <div style={{ minHeight: '100%', background: '#080F1E', display: 'flex', flexDirection: 'column' }}>
      <AppBar title="Personalizá tu remera" onBack={onBack} step={2} totalSteps={4} />
      <input ref={fileInputRef} type="file" accept=".png,.svg,image/png,image/svg+xml" style={{ display: 'none' }} onChange={handleFileChange} />

      {/* Color selector */}
      <div style={{ padding: '16px 18px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#3D5878', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Color:</span>
          {SHIRT_COLORS.map(c => (
            <button key={c.id} onClick={() => setShirtColor(c.id)} title={c.label}
              style={{
                width: 28, height: 28, borderRadius: 999, outline: 'none',
                transition: 'all 0.12s', flexShrink: 0, cursor: 'pointer',
                background: c.hex,
                border: shirtColor === c.id ? '3px solid #1D6BFF' : '2px solid rgba(255,255,255,0.08)',
                boxShadow: shirtColor === c.id ? '0 0 0 2px rgba(29,107,255,0.35)' : 'none',
              }} />
          ))}
          <span style={{ fontSize: 12, color: '#7A96BF', marginLeft: 4 }}>{colorLabel}</span>
        </div>
      </div>

      {/* Area tabs */}
      <div style={{ padding: '12px 18px 0', display: 'flex', gap: 6 }}>
        {AREAS.map(a => {
          const hasContent = designs.some(d => d.area === a.id)
          return (
            <button key={a.id} onClick={() => switchArea(a.id)}
              style={{
                flex: 1, padding: '10px 4px', fontSize: 11, fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                border: 'none', borderRadius: 9, cursor: 'pointer', transition: 'all 0.12s', position: 'relative',
                background: activeArea === a.id ? '#1D6BFF' : '#111E35',
                color: activeArea === a.id ? '#fff' : '#7A96BF',
                boxShadow: activeArea === a.id ? '0 2px 12px rgba(29,107,255,0.35)' : 'none',
              }}>
              {a.short}
              {hasContent && a.id !== activeArea && (
                <span style={{ position: 'absolute', top: 4, right: 4, width: 6, height: 6, borderRadius: 999, background: '#14CC88' }} />
              )}
            </button>
          )
        })}
      </div>

      {/* Canvas */}
      <div style={{ position: 'relative', margin: '10px auto 0', width: CANVAS_W, filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.5))' }}>
        <TShirtBackground color={colorHex} area={activeArea} />
        <canvas ref={canvasRef} style={{ display: 'block', position: 'relative', zIndex: 1 }} />
      </div>

      {/* Low-res warning */}
      {lowResWarning && (
        <div style={{ padding: '8px 18px 0' }}>
          <Alert type="warn">Imagen de baja resolución — puede verse pixelada al imprimir.</Alert>
        </div>
      )}

      {/* Upload button */}
      <div style={{ padding: '10px 18px 0' }}>
        <Btn onClick={handleUploadClick} variant="secondary" fullWidth icon="upload">
          Subir diseño a {AREAS.find(a => a.id === activeArea)?.label}
        </Btn>
      </div>

      {/* Design list */}
      {designs.length > 0 && (
        <div style={{ padding: '14px 18px 0' }}>
          <SLabel>Diseños agregados</SLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {designs.map(d => (
              <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', background: '#111E35', borderRadius: 10, border: '1px solid #1C3050' }}>
                <Icon name="image" size={16} color="#7A96BF" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: '#E8EEFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.filename}</div>
                  <div style={{ fontSize: 11, color: '#1D6BFF', fontWeight: 600, marginTop: 2 }}>{AREAS.find(a => a.id === d.area)?.label}</div>
                </div>
                <button onClick={() => deleteDesign(d.id)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}>
                  <Icon name="trash" size={15} color="#FF4D6A" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div style={{ padding: '14px 18px 36px', marginTop: 'auto' }}>
        <Btn onClick={handleConfirmClick} disabled={!hasDesigns} fullWidth>
          Confirmar diseño →
        </Btn>
        {!hasDesigns && (
          <div style={{ textAlign: 'center', fontSize: 12, color: '#3D5878', marginTop: 10 }}>
            Subí al menos un diseño para continuar
          </div>
        )}
      </div>

      {/* Modal: tip 1 */}
      <Modal open={uploadModal === 'msg1'} noClose title="Antes de subir tu diseño">
        <Alert type="info">Para la mejor calidad de impresión, subí tus archivos en la mayor resolución disponible.</Alert>
        <div style={{ height: 20 }} />
        <Btn fullWidth onClick={() => setUploadModal('msg2')}>Entendido</Btn>
        <div style={{ height: 8 }} />
      </Modal>

      {/* Modal: tip 2 */}
      <Modal open={uploadModal === 'msg2'} noClose title="Una cosa más">
        <Alert type="success">No te preocupes si las ubicaciones no quedan perfectas. Te enviaremos una prueba antes de producir.</Alert>
        <div style={{ height: 20 }} />
        <Btn fullWidth onClick={() => { setUploadModal(null); setHasSeenUploadModal(true); setTimeout(() => fileInputRef.current?.click(), 100) }}>
          Subir diseño
        </Btn>
        <div style={{ height: 8 }} />
      </Modal>

      {/* Modal: confirm colors */}
      <Modal open={confirmModal} onClose={() => setConfirmModal(false)} title="Colores por área de impresión">
        {detectingColors ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: '#7A96BF', fontSize: 14 }}>
            Detectando colores…
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 16 }}>
              <Alert type="info">Revisá la cantidad de colores por cada área. Esto afecta el costo de impresión.</Alert>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {areasWithDesigns.map(a => {
                const detected = colorsByArea[a.id] || 1
                const isEditing = editingArea === a.id
                return (
                  <div key={a.id} style={{ background: '#152035', borderRadius: 12, padding: '12px 14px', border: `1px solid ${isEditing ? '#1D6BFF55' : '#1C3050'}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#E8EEFF' }}>{a.label}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {isEditing ? (
                          <>
                            <input type="number" min={1} max={20} value={editValue}
                              onChange={e => setEditValue(e.target.value)} autoFocus
                              style={{ width: 60, background: '#111E35', border: '1.5px solid #1D6BFF', borderRadius: 8, padding: '6px 8px', fontSize: 15, fontWeight: 700, color: '#E8EEFF', fontFamily: 'inherit', outline: 'none', textAlign: 'center' }} />
                            <Btn small onClick={() => { if (parseInt(editValue) > 0) setAreaColor(a.id, editValue); setEditingArea(null); setEditValue('') }}>OK</Btn>
                          </>
                        ) : (
                          <>
                            <span style={{ fontSize: 22, fontWeight: 800, color: '#1D6BFF', lineHeight: 1 }}>{detected}</span>
                            <span style={{ fontSize: 12, color: '#7A96BF' }}>color{detected !== 1 ? 'es' : ''}</span>
                            <button onClick={() => { setEditingArea(a.id); setEditValue(String(detected)) }}
                              style={{ background: 'transparent', border: '1px solid #1C3050', borderRadius: 8, padding: '5px 10px', fontSize: 12, color: '#7A96BF', cursor: 'pointer', fontFamily: 'inherit' }}>
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
            <Btn fullWidth onClick={doConfirm}>Confirmar y ver cotización →</Btn>
            <div style={{ height: 8 }} />
          </>
        )}
      </Modal>
    </div>
  )
}
