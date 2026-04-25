// ─── EDITOR SCREEN — Fabric.js canvas editor ──────────────────────────────

const SHIRT_COLORS = [
  { id: 'blanco',      hex: '#F5F5F0', label: 'Blanco'      },
  { id: 'negro',       hex: '#1A1A1A', label: 'Negro'       },
  { id: 'gris',        hex: '#6B7280', label: 'Gris'        },
  { id: 'azul_marino', hex: '#1E3A5F', label: 'Azul marino' },
  { id: 'rojo',        hex: '#9B1C1C', label: 'Rojo'        },
  { id: 'verde',       hex: '#14532D', label: 'Verde'       },
  { id: 'celeste',     hex: '#1E6FAA', label: 'Celeste'     },
  { id: 'bordo',       hex: '#6B1C3C', label: 'Bordó'       },
];

const AREAS = [
  { id: 'frente',    label: 'Frente',     short: 'Frente'  },
  { id: 'espalda',   label: 'Espalda',    short: 'Espalda' },
  { id: 'manga_izq', label: 'Manga Izq.', short: 'M. Izq.' },
  { id: 'manga_der', label: 'Manga Der.', short: 'M. Der.' },
];

const PRINT_AREAS = {
  frente:    { x: 75,  y: 80,  w: 140, h: 180 },
  espalda:   { x: 75,  y: 80,  w: 140, h: 180 },
  manga_izq: { x: 88,  y: 105, w: 90,  h: 118 },
  manga_der: { x: 88,  y: 105, w: 90,  h: 118 },
};

const CANVAS_W = 290;
const CANVAS_H = 330;

// ── T-shirt background SVGs ─────────────────────────────────────────────────
const TShirtBackground = ({ color, area }) => {
  const shadow = 'rgba(0,0,0,0.28)';
  const highlight = 'rgba(255,255,255,0.06)';

  if (area === 'manga_izq') return (
    <svg width={CANVAS_W} height={CANVAS_H} viewBox="0 0 290 330"
      style={{position:'absolute',top:0,left:0,pointerEvents:'none'}}>
      <defs>
        <linearGradient id="slv_l" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.10)"/>
          <stop offset="100%" stopColor="rgba(0,0,0,0.15)"/>
        </linearGradient>
      </defs>
      <path d="M 30 50 C 30 50 200 30 250 45 L 260 180 C 260 195 240 210 220 210 L 50 230 C 30 230 20 215 20 200 Z"
        fill={color}/>
      <path d="M 30 50 C 30 50 200 30 250 45 L 260 180 C 260 195 240 210 220 210 L 50 230 C 30 230 20 215 20 200 Z"
        fill="url(#slv_l)"/>
      <path d="M 20 200 C 20 215 30 230 50 230 L 220 210 C 240 210 260 195 260 180 L 255 190 C 255 200 238 212 220 212 L 50 232 C 32 232 22 218 22 205 Z"
        fill={shadow} opacity="0.5"/>
      <path d="M 30 50 C 90 42 160 36 250 45" stroke={highlight} strokeWidth="1" fill="none"/>
      <ellipse cx="30" cy="55" rx="18" ry="12" fill={shadow} opacity="0.4" transform="rotate(-10 30 55)"/>
    </svg>
  );

  if (area === 'manga_der') return (
    <svg width={CANVAS_W} height={CANVAS_H} viewBox="0 0 290 330"
      style={{position:'absolute',top:0,left:0,pointerEvents:'none'}}>
      <defs>
        <linearGradient id="slv_r" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.10)"/>
          <stop offset="100%" stopColor="rgba(0,0,0,0.15)"/>
        </linearGradient>
      </defs>
      <path d="M 260 50 C 260 50 90 30 40 45 L 30 180 C 30 195 50 210 70 210 L 240 230 C 260 230 270 215 270 200 Z"
        fill={color}/>
      <path d="M 260 50 C 260 50 90 30 40 45 L 30 180 C 30 195 50 210 70 210 L 240 230 C 260 230 270 215 270 200 Z"
        fill="url(#slv_r)"/>
      <path d="M 270 200 C 270 215 260 230 240 230 L 70 210 C 50 210 30 195 30 180 L 35 190 C 35 200 52 212 70 212 L 240 232 C 258 232 268 218 268 205 Z"
        fill={shadow} opacity="0.5"/>
      <path d="M 260 50 C 200 42 130 36 40 45" stroke={highlight} strokeWidth="1" fill="none"/>
      <ellipse cx="260" cy="55" rx="18" ry="12" fill={shadow} opacity="0.4" transform="rotate(10 260 55)"/>
    </svg>
  );

  return (
    <svg width={CANVAS_W} height={CANVAS_H} viewBox="0 0 290 330"
      style={{position:'absolute',top:0,left:0,pointerEvents:'none'}}>
      <defs>
        <linearGradient id="shirt_grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.08)"/>
          <stop offset="100%" stopColor="rgba(0,0,0,0.18)"/>
        </linearGradient>
        <linearGradient id="collar_grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(0,0,0,0.3)"/>
          <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
        </linearGradient>
      </defs>
      <path d="M 96 18 Q 145 60 194 18 L 282 58 L 262 122 L 224 108 L 224 308 L 66 308 L 66 108 L 28 122 L 8 58 Z"
        fill={color}/>
      <path d="M 96 18 Q 145 60 194 18 L 282 58 L 262 122 L 224 108 L 224 308 L 66 308 L 66 108 L 28 122 L 8 58 Z"
        fill="url(#shirt_grad)"/>
      <path d="M 8 58 L 28 122 L 66 108 L 80 60 Z" fill={shadow} opacity="0.35"/>
      <path d="M 282 58 L 262 122 L 224 108 L 210 60 Z" fill={shadow} opacity="0.20"/>
      <path d="M 66 280 L 224 280 L 224 308 L 66 308 Z" fill={shadow} opacity="0.15"/>
      <path d="M 96 18 Q 145 60 194 18 Q 168 14 145 14 Q 122 14 96 18 Z" fill="url(#collar_grad)"/>
      <line x1="96" y1="18" x2="28" y2="122" stroke={highlight} strokeWidth="1"/>
      <line x1="194" y1="18" x2="262" y2="122" stroke={highlight} strokeWidth="1"/>
      {area === 'espalda' && (
        <text x="145" y="324" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.2)"
          fontFamily="DM Sans, sans-serif" fontWeight="600" letterSpacing="0.08em">ESPALDA</text>
      )}
    </svg>
  );
};

// ── Detect colors from canvas JSON offscreen ───────────────────────────────
const detectColorsOffscreen = (canvasJson, areaId) => new Promise((resolve) => {
  const pa = PRINT_AREAS[areaId];
  const objs = (canvasJson?.objects || []).filter(o => o.name !== '__guide');
  if (!objs.length) { resolve(0); return; }

  const el = document.createElement('canvas');
  el.style.display = 'none';
  document.body.appendChild(el);
  const fc = new fabric.Canvas(el, { width: CANVAS_W, height: CANVAS_H, backgroundColor: '' });
  const clean = { ...canvasJson, objects: objs };

  fc.loadFromJSON(clean, () => {
    try {
      const dataURL = fc.toDataURL({ format:'png', left:pa.x, top:pa.y, width:pa.w, height:pa.h, multiplier:0.5 });
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = img.width; c.height = img.height;
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, c.width, c.height).data;
        const colorSet = new Set();
        for (let i = 0; i < data.length; i += 20) {
          if (data[i+3] < 30) continue;
          const r = Math.round(data[i]/28)*28;
          const g = Math.round(data[i+1]/28)*28;
          const b = Math.round(data[i+2]/28)*28;
          colorSet.add(`${r}|${g}|${b}`);
        }
        fc.dispose(); document.body.removeChild(el);
        resolve(Math.max(1, Math.min(colorSet.size, 12)));
      };
      img.onerror = () => { fc.dispose(); document.body.removeChild(el); resolve(1); };
      img.src = dataURL;
    } catch(e) { fc.dispose(); document.body.removeChild(el); resolve(1); }
  });
});

// ── Editor Screen ───────────────────────────────────────────────────────────
const EditorScreen = ({ onConfirm, onBack, savedState }) => {
  const [shirtColor,  setShirtColor]  = React.useState(savedState?.shirtColor || 'azul_marino');
  const [activeArea,  setActiveArea]  = React.useState(savedState?.activeArea  || 'frente');
  const [canvasStates, setCanvasStates] = React.useState(savedState?.canvasStates || {});
  const [designs,     setDesigns]     = React.useState(savedState?.designs || []);
  const [lowResWarning, setLowResWarning] = React.useState(false);
  const [uploadModal,   setUploadModal]  = React.useState(null);
  const [hasSeenUploadModal, setHasSeenUploadModal] = React.useState(savedState?.hasSeenUploadModal || false);

  // Color confirm modal
  const [confirmModal,   setConfirmModal]   = React.useState(false);
  const [colorsByArea,   setColorsByArea]   = React.useState({});   // { frente: 2, espalda: 1 }
  const [detectingColors, setDetectingColors] = React.useState(false);
  const [editingArea,    setEditingArea]    = React.useState(null);
  const [editValue,      setEditValue]      = React.useState('');

  const canvasRef      = React.useRef(null);
  const fabricRef      = React.useRef(null);
  const fileInputRef   = React.useRef(null);
  const activeAreaRef  = React.useRef(activeArea);
  const canvasStatesRef = React.useRef(canvasStates);

  activeAreaRef.current   = activeArea;
  canvasStatesRef.current = canvasStates;

  const colorHex   = SHIRT_COLORS.find(c => c.id === shirtColor)?.hex || '#1E3A5F';
  const colorLabel = SHIRT_COLORS.find(c => c.id === shirtColor)?.label;

  // ── Init Fabric (no guide) ─────────────────────────────────────────────────
  React.useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: CANVAS_W, height: CANVAS_H, backgroundColor: '', preserveObjectStacking: true,
    });
    fabricRef.current = canvas;

    const saved = canvasStatesRef.current['frente'];
    if (saved) {
      const clean = { ...saved, objects: (saved.objects||[]).filter(o => o.name !== '__guide') };
      canvas.loadFromJSON(clean, () => { canvas.renderAll(); updateDesignList(); });
    }
    return () => { canvas.dispose(); };
  }, []);

  const updateDesignList = () => {
    if (!fabricRef.current) return;
    const objs = fabricRef.current.getObjects().filter(o => o.name !== '__guide');
    setDesigns(prev => {
      // Only update designs for the current area — keep other areas intact
      const otherAreas   = prev.filter(d => d.area !== activeAreaRef.current);
      const currentArea  = prev.filter(d => d.area === activeAreaRef.current);
      const existingIds  = new Set(prev.map(d => d.id)); // check ALL areas to avoid duplicates
      const newItems     = objs.filter(o => !existingIds.has(o.name))
        .map(o => ({ id: o.name, filename: o._filename || o.name, area: activeAreaRef.current }));
      const updatedCurrent = [...currentArea.filter(d => objs.find(o => o.name === d.id)), ...newItems];
      return [...otherAreas, ...updatedCurrent];
    });
  };

  // ── Switch area ────────────────────────────────────────────────────────────
  const switchArea = (area) => {
    if (!fabricRef.current || area === activeArea) return;
    const json = fabricRef.current.toJSON(['name', '_filename']);
    const newStates = { ...canvasStatesRef.current, [activeArea]: json };
    setCanvasStates(newStates);
    canvasStatesRef.current = newStates;
    setActiveArea(area);

    fabricRef.current.clear();

    const saved = newStates[area];
    if (saved) {
      const clean = { ...saved, objects: (saved.objects||[]).filter(o => o.name !== '__guide') };
      fabricRef.current.loadFromJSON(clean, () => {
        fabricRef.current.renderAll();
        updateDesignList();
      });
    } else {
      fabricRef.current.renderAll();
    }
  };

  // ── Upload ─────────────────────────────────────────────────────────────────
  const handleUploadClick = () => {
    if (!hasSeenUploadModal) setUploadModal('msg1');
    else fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = '';
    if (!['image/png','image/svg+xml'].includes(file.type)) { alert('Solo PNG o SVG.'); return; }
    if (file.size > 10*1024*1024) { alert('Máximo 10 MB.'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const pa = PRINT_AREAS[activeAreaRef.current];
      fabric.Image.fromURL(ev.target.result, (img) => {
        if (file.type === 'image/png') {
          const dpi = (img.width / (activeAreaRef.current.startsWith('manga') ? 7.4 : 29.7)) * 2.54;
          if (dpi < 150) setLowResWarning(true);
        }
        const maxW = pa.w * 0.85, maxH = pa.h * 0.85;
        const scale = Math.min(maxW / (img.width||1), maxH / (img.height||1));
        const id = 'design-' + Date.now();
        img.set({
          left: pa.x + pa.w/2, top: pa.y + pa.h/2,
          originX: 'center', originY: 'center',
          scaleX: scale, scaleY: scale,
          name: id, _filename: file.name,
          cornerColor: '#1D6BFF', cornerStyle: 'circle',
          borderColor: '#1D6BFF', transparentCorners: false,
        });
        fabricRef.current?.add(img);
        fabricRef.current?.setActiveObject(img);
        fabricRef.current?.renderAll();
        setDesigns(prev => [...prev, { id, filename: file.name, area: activeAreaRef.current }]);
      });
    };
    reader.readAsDataURL(file);
  };

  const deleteDesign = (id) => {
    const obj = fabricRef.current?.getObjects().find(o => o.name === id);
    if (obj) { fabricRef.current.remove(obj); fabricRef.current.renderAll(); }
    setDesigns(prev => prev.filter(d => d.id !== id));
  };

  // ── Open confirm modal → detect colors per area ────────────────────────────
  const handleConfirmClick = async () => {
    // Save current canvas first
    const json = fabricRef.current?.toJSON(['name','_filename']);
    const allStates = { ...canvasStatesRef.current, [activeArea]: json };
    setCanvasStates(allStates);
    canvasStatesRef.current = allStates;

    setDetectingColors(true);
    setConfirmModal(true);
    setEditingArea(null);
    setEditValue('');

    // Detect colors for each area that has designs
    const areasWithDesigns = AREAS.filter(a =>
      designs.some(d => d.area === a.id) ||
      (allStates[a.id]?.objects||[]).filter(o => o.name !== '__guide').length > 0
    );

    const results = {};
    await Promise.all(areasWithDesigns.map(async (a) => {
      const detected = await detectColorsOffscreen(allStates[a.id], a.id);
      results[a.id] = detected;
    }));

    setColorsByArea(results);
    setDetectingColors(false);
  };

  const setAreaColor = (areaId, val) => {
    const v = Math.max(1, parseInt(val)||1);
    setColorsByArea(prev => ({ ...prev, [areaId]: v }));
  };

  const doConfirm = () => {
    const snap = (() => { try { return fabricRef.current?.toDataURL({ format:'png', multiplier:0.5 }); } catch(e) { return null; } })();
    const json = fabricRef.current?.toJSON(['name','_filename']);
    const allStates = { ...canvasStatesRef.current, [activeArea]: json };
    onConfirm({
      shirtColor, designs, colorsByArea,
      colorCount: Object.values(colorsByArea).reduce((a,b) => a+b, 0) || 1,
      canvasStates: allStates, activeArea,
      hasSeenUploadModal: true, canvasSnapshot: snap,
    });
    setConfirmModal(false);
  };

  const areasWithDesigns = AREAS.filter(a =>
    designs.some(d => d.area === a.id)
  );

  const hasDesigns = designs.length > 0;

  return (
    <div style={{minHeight:'100%', background:'#080F1E', display:'flex', flexDirection:'column'}}>
      <AppBar title="Personalizá tu remera" onBack={onBack} step={2} totalSteps={4}/>
      <input ref={fileInputRef} type="file" accept=".png,.svg,image/png,image/svg+xml" style={{display:'none'}} onChange={handleFileChange}/>

      {/* Color selector */}
      <div style={{padding:'14px 16px 0'}}>
        <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
          <SLabel style={{margin:0}}>Color:</SLabel>
          {SHIRT_COLORS.map(c => (
            <button key={c.id} onClick={() => setShirtColor(c.id)} title={c.label}
              style={{width:28,height:28,borderRadius:999,
                border: shirtColor===c.id ? '3px solid #1D6BFF':'2px solid rgba(255,255,255,0.08)',
                background:c.hex,cursor:'pointer',
                boxShadow: shirtColor===c.id ? '0 0 0 2px rgba(29,107,255,0.35)':'none',
                outline:'none',transition:'all 0.12s',flexShrink:0}}/>
          ))}
          <span style={{fontSize:12,color:'#7A96BF',marginLeft:2}}>{colorLabel}</span>
        </div>
      </div>

      {/* Area tabs */}
      <div style={{padding:'12px 16px 0',display:'flex',gap:6}}>
        {AREAS.map(a => {
          const hasContent = designs.some(d => d.area === a.id);
          return (
            <button key={a.id} onClick={() => switchArea(a.id)}
              style={{flex:1,padding:'9px 4px',fontSize:11,fontWeight:600,fontFamily:'inherit',
                border:'none',borderRadius:8,cursor:'pointer',transition:'all 0.12s',position:'relative',
                background: activeArea===a.id ? '#1D6BFF':'#111E35',
                color: activeArea===a.id ? '#fff':'#7A96BF',
                boxShadow: activeArea===a.id ? '0 2px 12px rgba(29,107,255,0.35)':'none',
              }}>
              {a.short}
              {hasContent && a.id !== activeArea && (
                <span style={{position:'absolute',top:4,right:4,width:6,height:6,borderRadius:999,background:'#14CC88'}}/>
              )}
            </button>
          );
        })}
      </div>

      {/* Canvas — no guide */}
      <div style={{position:'relative',margin:'8px auto 0',width:CANVAS_W,
        filter:'drop-shadow(0 8px 32px rgba(0,0,0,0.5))'}}>
        <TShirtBackground color={colorHex} area={activeArea}/>
        <canvas ref={canvasRef} style={{display:'block',position:'relative',zIndex:1}}/>
      </div>

      {/* Low-res warning only */}
      {lowResWarning && (
        <div style={{padding:'8px 16px'}}>
          <Alert type="warn">Imagen de baja resolución — puede verse pixelada al imprimir.</Alert>
        </div>
      )}

      {/* Upload button */}
      <div style={{padding:'8px 16px 8px'}}>
        <Btn onClick={handleUploadClick} variant="secondary" fullWidth icon="upload">
          Subir diseño a {AREAS.find(a => a.id === activeArea)?.label}
        </Btn>
      </div>

      {/* Design list */}
      {designs.length > 0 && (
        <div style={{padding:'0 16px 8px'}}>
          <SLabel>Diseños agregados</SLabel>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            {designs.map(d => (
              <div key={d.id} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',
                background:'#111E35',borderRadius:10,border:'1px solid #1C3050'}}>
                <Icon name="image" size={16} color="#7A96BF"/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,color:'#E8EEFF',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d.filename}</div>
                  <div style={{fontSize:11,color:'#1D6BFF',fontWeight:600}}>{AREAS.find(a => a.id === d.area)?.label}</div>
                </div>
                <button onClick={() => deleteDesign(d.id)}
                  style={{background:'transparent',border:'none',cursor:'pointer',padding:4,display:'flex',alignItems:'center'}}>
                  <Icon name="trash" size={15} color="#FF4D6A"/>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div style={{padding:'8px 16px 32px',marginTop:'auto'}}>
        <Btn onClick={handleConfirmClick} disabled={!hasDesigns} fullWidth>
          Confirmar diseño →
        </Btn>
        {!hasDesigns && <div style={{textAlign:'center',fontSize:12,color:'#3D5878',marginTop:8}}>Subí al menos un diseño para continuar</div>}
      </div>

      {/* ── Modal: tip 1 ──────────────────────────────────────────────────── */}
      <Modal open={uploadModal === 'msg1'} noClose title="Antes de subir tu diseño">
        <Alert type="info">Para la mejor calidad de impresión, subí tus archivos en la mayor resolución disponible.</Alert>
        <div style={{height:20}}/>
        <Btn fullWidth onClick={() => setUploadModal('msg2')}>Entendido</Btn>
        <div style={{height:8}}/>
      </Modal>

      {/* ── Modal: tip 2 ──────────────────────────────────────────────────── */}
      <Modal open={uploadModal === 'msg2'} noClose title="Una cosa más">
        <Alert type="success">No te preocupes si las ubicaciones no quedan perfectas. Te enviaremos una prueba antes de producir.</Alert>
        <div style={{height:20}}/>
        <Btn fullWidth onClick={() => { setUploadModal(null); setHasSeenUploadModal(true); setTimeout(() => fileInputRef.current?.click(), 100); }}>
          Subir diseño
        </Btn>
        <div style={{height:8}}/>
      </Modal>

      {/* ── Modal: confirm colors por área ───────────────────────────────── */}
      <Modal open={confirmModal} onClose={() => setConfirmModal(false)} title="Colores por área de impresión">
        {detectingColors ? (
          <div style={{textAlign:'center',padding:'32px 0',color:'#7A96BF',fontSize:14}}>
            Detectando colores…
          </div>
        ) : (
          <>
            <div style={{marginBottom:16}}>
              <Alert type="info">Revisá la cantidad de colores por cada área. Esto afecta el costo de impresión.</Alert>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:16}}>
              {areasWithDesigns.map(a => {
                const detected = colorsByArea[a.id] || 1;
                const isEditing = editingArea === a.id;
                return (
                  <div key={a.id} style={{background:'#152035',borderRadius:12,padding:'12px 14px',
                    border:`1px solid ${isEditing ? '#1D6BFF55':'#1C3050'}`}}>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
                      <div style={{fontSize:13,fontWeight:600,color:'#E8EEFF'}}>{a.label}</div>
                      <div style={{display:'flex',alignItems:'center',gap:8}}>
                        {isEditing ? (
                          <>
                            <input type="number" min={1} max={20}
                              value={editValue}
                              onChange={e => setEditValue(e.target.value)}
                              autoFocus
                              style={{width:60,background:'#111E35',border:'1.5px solid #1D6BFF',
                                borderRadius:8,padding:'6px 8px',fontSize:15,fontWeight:700,
                                color:'#E8EEFF',fontFamily:'inherit',outline:'none',textAlign:'center'}}/>
                            <Btn small onClick={() => {
                              if (parseInt(editValue) > 0) setAreaColor(a.id, editValue);
                              setEditingArea(null); setEditValue('');
                            }}>OK</Btn>
                          </>
                        ) : (
                          <>
                            <span style={{fontSize:22,fontWeight:800,color:'#1D6BFF',lineHeight:1}}>{detected}</span>
                            <span style={{fontSize:12,color:'#7A96BF'}}>color{detected!==1?'es':''}</span>
                            <button onClick={() => { setEditingArea(a.id); setEditValue(String(detected)); }}
                              style={{background:'transparent',border:'1px solid #1C3050',borderRadius:8,
                                padding:'5px 10px',fontSize:12,color:'#7A96BF',cursor:'pointer',fontFamily:'inherit'}}>
                              Editar
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <Btn fullWidth onClick={doConfirm}>Confirmar y ver cotización →</Btn>
            <div style={{height:8}}/>
          </>
        )}
      </Modal>
    </div>
  );
};

Object.assign(window, { EditorScreen, TShirtBackground, SHIRT_COLORS, AREAS, PRINT_AREAS, CANVAS_W, CANVAS_H });
