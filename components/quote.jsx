// ─── QUOTE + CONFIRMATION SCREENS ─────────────────────────────────────────

const QUALITIES = [
  { id: 'economica', label: 'Económica', desc: 'Remera básica de algodón 160g'  },
  { id: 'superior',  label: 'Superior',  desc: 'Algodón peinado 190g, mayor durabilidad' },
  { id: 'premium',   label: 'Premium',   desc: 'Algodón ring-spun 220g, tela premium'   },
];

const DELIVERY_TIERS = [
  { id: 'estandar', label: 'Estándar', days: 15, surcharge: 0.00, color: '#14CC88' },
  { id: 'rapido',   label: 'Rápido',   days: 7,  surcharge: 0.20, color: '#F59E0B' },
  { id: 'express',  label: 'Express',  days: 3,  surcharge: 0.40, color: '#FF4D6A' },
];

const PRICE_PER_UNIT = { economica: 45000, superior: 65000, premium: 95000 };

const STD_SIZES   = ['S','M','L','XL','XXL'];
const KIDS_SIZES  = ['2','4','6','8','10','12'];
const EXTRA_SIZES = ['3XL','4XL'];
const OTHER_SIZES = [...KIDS_SIZES, ...EXTRA_SIZES];

const fmtGs = (n) => 'Gs. ' + Math.round(n).toLocaleString('es-PY');

// ── Business day helpers ───────────────────────────────────────────────────
const addBusinessDays = (date, days) => {
  const d = new Date(date);
  let added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) added++;
  }
  return d;
};

const countBusinessDays = (from, to) => {
  let count = 0;
  const d = new Date(from);
  d.setDate(d.getDate() + 1);
  while (d <= to) {
    if (d.getDay() !== 0 && d.getDay() !== 6) count++;
    d.setDate(d.getDate() + 1);
  }
  return count;
};

const toDateInput = (d) => d.toISOString().split('T')[0];

const tierForDays = (days) => {
  if (days >= 15) return DELIVERY_TIERS[0];
  if (days >= 7)  return DELIVERY_TIERS[1];
  if (days >= 3)  return DELIVERY_TIERS[2];
  return null;
};

const areaLabel = (id) => ({
  frente:'Frente', espalda:'Espalda', manga_izq:'Manga Izq.', manga_der:'Manga Der.'
}[id] || id);

// ── QuoteScreen ─────────────────────────────────────────────────────────────
const QuoteScreen = ({ editorData, onConfirm, onBack }) => {
  const [quality,    setQuality]    = React.useState('superior');
  const [quantities, setQuantities] = React.useState({});
  const [showOtros,  setShowOtros]  = React.useState(false);

  const today   = React.useMemo(() => { const d = new Date(); d.setHours(0,0,0,0); return d; }, []);
  const minDate = React.useMemo(() => addBusinessDays(today, 3), []);
  const [selectedDate, setSelectedDate] = React.useState('');

  const delivDate = new Date(selectedDate + 'T00:00:00');
  const bussDays  = selectedDate ? countBusinessDays(today, delivDate) : 0;
  const tier      = bussDays > 0 ? tierForDays(bussDays) : null;
  const tooSoon   = bussDays > 0 && bussDays < 3;

  const totalUnits   = Object.values(quantities).reduce((a,b) => a+b, 0);
  const basePrice    = PRICE_PER_UNIT[quality] || 0;
  const pricePerUnit = Math.round(basePrice * (1 + (tier?.surcharge || 0)));
  const total        = pricePerUnit * totalUnits;
  const canContinue  = totalUnits >= 10 && tier && !tooSoon;

  const setQty = (size, val) => {
    const v = Math.max(0, parseInt(val) || 0);
    setQuantities(prev => ({ ...prev, [size]: v }));
  };

  // Keep "otros" visible if any other-size has qty > 0
  const hasOtroQty = OTHER_SIZES.some(s => (quantities[s]||0) > 0);
  const showOtrosSection = showOtros || hasOtroQty;

  const SizeRow = ({ sz }) => (
    <div style={{display:'flex',alignItems:'center',background:'#111E35',
      borderRadius:12,border:'1px solid #1C3050',overflow:'hidden',height:52}}>
      <div style={{width:52,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',
        borderRight:'1px solid #1C3050',height:'100%'}}>
        <span style={{fontSize:14,fontWeight:700,color:'#E8EEFF'}}>{sz}</span>
      </div>
      <button onClick={() => setQty(sz, (quantities[sz]||0)-1)}
        style={{width:44,height:'100%',background:'transparent',border:'none',cursor:'pointer',
          color:'#7A96BF',fontSize:22,display:'flex',alignItems:'center',justifyContent:'center',
          fontFamily:'inherit',flexShrink:0}}>
        −
      </button>
      <input type="number" min={0} value={quantities[sz] || ''}
        placeholder="0"
        onChange={e => setQty(sz, e.target.value)}
        style={{flex:1,background:'transparent',border:'none',fontSize:16,fontWeight:600,
          color:'#E8EEFF',fontFamily:'inherit',outline:'none',textAlign:'center',
          padding:'0',minWidth:0}}/>
      <button onClick={() => setQty(sz, (quantities[sz]||0)+1)}
        style={{width:44,height:'100%',background:'transparent',border:'none',cursor:'pointer',
          color:'#1D6BFF',fontSize:22,display:'flex',alignItems:'center',justifyContent:'center',
          fontFamily:'inherit',flexShrink:0}}>
        +
      </button>
    </div>
  );

  return (
    <div style={{minHeight:'100%',background:'#080F1E',display:'flex',flexDirection:'column'}}>
      <AppBar title="Cotización" onBack={onBack} step={3} totalSteps={4}/>

      <div style={{flex:1,overflowY:'auto',padding:'20px 16px 140px'}}>

        {/* ── Design summary ───────────────────────────────────────────── */}
        {editorData?.designs?.length > 0 && (
          <div style={{marginBottom:24}}>
            <SLabel>Tu diseño</SLabel>
            <div style={{background:'#111E35',border:'1px solid #1C3050',borderRadius:14,
              padding:'12px 14px',display:'flex',flexDirection:'column',gap:10}}>

              {/* One row per design with location */}
              {editorData.designs.map((d, i) => (
                <div key={d.id} style={{display:'flex',alignItems:'center',gap:12}}>
                  {/* Thumbnail — white bg */}
                  <div style={{width:48,height:48,borderRadius:8,background:'#FFFFFF',
                    flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',
                    overflow:'hidden',border:'1px solid rgba(0,0,0,0.08)'}}>
                    {editorData.canvasSnapshot && i === 0
                      ? <img src={editorData.canvasSnapshot} style={{width:'100%',height:'100%',objectFit:'contain'}} alt=""/>
                      : <Icon name="image" size={20} color="#CCCCCC"/>
                    }
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,color:'#E8EEFF',fontWeight:500,
                      overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d.filename}</div>
                    <div style={{fontSize:11,color:'#1D6BFF',fontWeight:600,marginTop:2}}>
                      {areaLabel(d.area)}
                    </div>
                  </div>
                  {/* Colors for this area */}
                  {editorData.colorsByArea?.[d.area] && (
                    <div style={{flexShrink:0,textAlign:'right'}}>
                      <span style={{fontSize:13,fontWeight:700,color:'#E8EEFF'}}>{editorData.colorsByArea[d.area]}</span>
                      <span style={{fontSize:11,color:'#7A96BF',display:'block'}}>col.</span>
                    </div>
                  )}
                </div>
              ))}

              <Divider/>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:12}}>
                <span style={{color:'#7A96BF'}}>Remera</span>
                <div style={{display:'flex',alignItems:'center',gap:6}}>
                  <div style={{width:12,height:12,borderRadius:999,
                    background:SHIRT_COLORS_REF[editorData?.shirtColor]||'#1E3A5F',
                    border:'1px solid rgba(255,255,255,0.15)'}}/>
                  <span style={{color:'#E8EEFF',fontWeight:600}}>{SHIRT_COLORS_LABELS[editorData?.shirtColor]||'—'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Quality — compact chips ───────────────────────────────────── */}
        <div style={{marginBottom:24}}>
          <SLabel>Calidad de la remera</SLabel>
          <div style={{display:'flex',gap:8}}>
            {QUALITIES.map(q => (
              <button key={q.id} onClick={() => setQuality(q.id)}
                style={{flex:1,padding:'10px 6px',fontFamily:'inherit',fontWeight:600,
                  fontSize:13,cursor:'pointer',lineHeight:1.3,
                  border: quality===q.id ? '1.5px solid #1D6BFF':'1px solid #1C3050',
                  borderRadius:10,
                  background: quality===q.id ? 'rgba(29,107,255,0.15)':'#111E35',
                  color: quality===q.id ? '#7AADFF':'#8BAAC8',
                  transition:'all 0.12s'}}>
                {q.label}
              </button>
            ))}
          </div>
          <div style={{fontSize:12,color:'#7A96BF',marginTop:8,lineHeight:1.5}}>
            {QUALITIES.find(q => q.id === quality)?.desc}
          </div>
        </div>

        {/* ── Size quantities — full width ──────────────────────────────── */}
        <div style={{marginBottom:16}}>
          <SLabel>Cantidad por talle</SLabel>
          {totalUnits > 0 && totalUnits < 10 && (
            <div style={{marginBottom:10}}>
              <Alert type="warn">Mínimo 10 unidades. Llevás {totalUnits}, faltan {10-totalUnits}.</Alert>
            </div>
          )}
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            {STD_SIZES.map(sz => <SizeRow key={sz} sz={sz}/>)}
          </div>

          {/* Otros talles */}
          {!showOtrosSection && (
            <button onClick={() => setShowOtros(true)}
              style={{marginTop:8,width:'100%',padding:'12px',background:'transparent',
                border:'1px dashed #1C3050',borderRadius:12,cursor:'pointer',fontFamily:'inherit',
                fontSize:13,fontWeight:600,color:'#7A96BF',
                display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
              <Icon name="layers" size={15} color="#7A96BF"/>
              Otros talles (niños · 3XL · 4XL)
            </button>
          )}

          {showOtrosSection && (
            <div style={{marginTop:8}}>
              <div style={{fontSize:11,fontWeight:700,color:'#3D5878',letterSpacing:'0.07em',
                textTransform:'uppercase',margin:'8px 0 6px'}}>Talles niños</div>
              <div style={{display:'flex',flexDirection:'column',gap:6}}>
                {KIDS_SIZES.map(sz => <SizeRow key={sz} sz={sz}/>)}
              </div>
              <div style={{fontSize:11,fontWeight:700,color:'#3D5878',letterSpacing:'0.07em',
                textTransform:'uppercase',margin:'12px 0 6px'}}>Talles especiales</div>
              <div style={{display:'flex',flexDirection:'column',gap:6}}>
                {EXTRA_SIZES.map(sz => <SizeRow key={sz} sz={sz}/>)}
              </div>
            </div>
          )}

          <div style={{textAlign:'right',fontSize:13,color:'#7A96BF',marginTop:8}}>
            Total: <strong style={{color:'#E8EEFF'}}>{totalUnits} unidades</strong>
          </div>
        </div>

        {/* ── Delivery date — al final antes del resumen ────────────────── */}
        <div style={{marginBottom:20}}>
          <SLabel>¿Cuándo lo necesitás?</SLabel>
          <div style={{background:'#111E35',border:`1px solid ${tooSoon?'#FF4D6A33':'#1C3050'}`,
            borderRadius:14,padding:'14px 16px',marginBottom:10}}>
            <label style={{fontSize:12,color:'#7A96BF',display:'block',marginBottom:8}}>
              Fecha de entrega deseada
            </label>
            <input type="date"
              value={selectedDate}
              min={toDateInput(minDate)}
              onChange={e => setSelectedDate(e.target.value)}
              style={{width:'100%',background:'#152035',border:'1px solid #1C3050',borderRadius:10,
                padding:'12px 14px',fontSize:15,color: selectedDate ? '#E8EEFF':'#3D5878',
                fontFamily:'DM Sans, sans-serif',outline:'none',boxSizing:'border-box',colorScheme:'dark'}}/>
            {tooSoon && (
              <div style={{marginTop:10}}>
                <Alert type="error">Necesitamos al menos 3 días hábiles para producir tu pedido.</Alert>
              </div>
            )}
          </div>

          {/* All tiers always visible, active one highlighted */}
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {DELIVERY_TIERS.map(t => {
              const isActive = tier?.id === t.id && !tooSoon && selectedDate;
              return (
                <div key={t.id} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 14px',
                  borderRadius:12,border: isActive ? `1.5px solid ${t.color}` : '1px solid #1C3050',
                  background: isActive ? `${t.color}10` : '#111E35',
                  transition:'all 0.2s'}}>
                  <div style={{width:10,height:10,borderRadius:999,flexShrink:0,
                    background: isActive ? t.color : '#1C3050',
                    boxShadow: isActive ? `0 0 8px ${t.color}` : 'none',
                    transition:'all 0.2s'}}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:700,color: isActive ? t.color : '#8BAAC8'}}>
                      {t.label}
                    </div>
                    <div style={{fontSize:12,color:'#7A96BF'}}>{t.days} días hábiles</div>
                  </div>
                  {t.surcharge > 0
                    ? <Badge color={isActive ? t.color : '#3D5878'}>+{t.surcharge*100}%</Badge>
                    : <Badge color={isActive ? t.color : '#3D5878'}>Sin recargo</Badge>
                  }
                </div>
              );
            })}
          </div>
          {selectedDate && bussDays > 0 && !tooSoon && tier && (
            <div style={{textAlign:'center',fontSize:12,color:'#7A96BF',marginTop:8}}>
              {bussDays} días hábiles → modalidad <strong style={{color:tier.color}}>{tier.label}</strong>
            </div>
          )}
        </div>

        {/* ── Price summary ─────────────────────────────────────────────── */}
        <div style={{background:'#111E35',borderRadius:16,border:'1px solid #1C3050',padding:'16px'}}>
          <SLabel>Resumen de precio</SLabel>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {[
              ['Calidad', QUALITIES.find(q=>q.id===quality)?.label||'—'],
              ['Entrega', tier ? `${tier.label}${tier.surcharge>0?' (+'+tier.surcharge*100+'%)':''}` : '—'],
              ['Precio / uni.', fmtGs(pricePerUnit)],
              ['Cantidad', `${totalUnits} uds.`],
            ].map(([k,v]) => (
              <div key={k} style={{display:'flex',justifyContent:'space-between'}}>
                <span style={{fontSize:13,color:'#7A96BF'}}>{k}</span>
                <span style={{fontSize:13,color:'#E8EEFF',fontWeight:500}}>{v}</span>
              </div>
            ))}
            <div style={{height:1,background:'#1C3050',margin:'4px 0'}}/>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{fontSize:15,fontWeight:700,color:'#E8EEFF'}}>Total estimado</span>
              <span style={{fontSize:18,fontWeight:800,color:'#1D6BFF'}}>{totalUnits>0 ? fmtGs(total) : '—'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div style={{position:'sticky',bottom:0,
        background:'linear-gradient(to top, #080F1E 80%, transparent)',padding:'16px 16px 32px'}}>
        <Btn fullWidth disabled={!canContinue}
          onClick={() => onConfirm({ quality, delivery:tier?.id, deliveryDate:selectedDate, bussDays, tier, quantities, totalUnits, pricePerUnit, total, colorCount:editorData?.colorCount||1, colorsByArea:editorData?.colorsByArea||{} })}>
          {canContinue
            ? 'Continuar →'
            : totalUnits < 10
              ? `Mínimo 10 unidades (faltan ${10-totalUnits})`
              : tooSoon ? 'Elegí una fecha válida'
              : 'Seleccioná una fecha de entrega'}
        </Btn>
      </div>
    </div>
  );
};

// ─── CONFIRMATION + WHATSAPP ───────────────────────────────────────────────
const ConfirmationScreen = ({ editorData, quoteData, onBack, onDone }) => {
  const [name,  setName]  = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [sent,  setSent]  = React.useState(false);
  const [nameErr,  setNameErr]  = React.useState('');
  const [phoneErr, setPhoneErr] = React.useState('');
  const [quoteCode] = React.useState(() => `UY-2026-${Math.floor(Math.random()*9000)+1000}`);

  const qual = QUALITIES.find(q => q.id === quoteData?.quality);
  const tier = quoteData?.tier;
  const validatePhone = (v) => /^(09[5-9]\d{7}|0[2-9]\d{6,7})$/.test(v.replace(/\s/g,''));

  const handleSend = () => {
    let ok = true;
    if (!name.trim()) { setNameErr('El nombre es requerido.'); ok = false; } else setNameErr('');
    if (!validatePhone(phone)) { setPhoneErr('Ingresá un número paraguayo válido (ej: 0981 123 456).'); ok = false; } else setPhoneErr('');
    if (!ok) return;

    const talles = Object.entries(quoteData?.quantities||{})
      .filter(([,v])=>v>0).map(([s,v]) => `  • ${s}: ${v} uds.`).join('\n');
    const ubicaciones = (editorData?.designs||[])
      .map(d => `  • ${areaLabel(d.area)}: ${d.filename}${editorData?.colorsByArea?.[d.area] ? ` (${editorData.colorsByArea[d.area]} col.)` : ''}`).join('\n');

    const msg = encodeURIComponent(
`*Nueva cotización UniformesYA*
Código: ${quoteCode}
━━━━━━━━━━━━━━━━━━
Cliente: ${name.trim()}
Teléfono: ${phone.trim()}
━━━━━━━━━━━━━━━━━━
Item: Remera ${SHIRT_COLORS_LABELS[editorData?.shirtColor]||''}
Calidad: ${qual?.label||'—'}
Diseños:
${ubicaciones}
━━━━━━━━━━━━━━━━━━
Talles:
${talles}
Total: ${quoteData?.totalUnits||0} uds.
━━━━━━━━━━━━━━━━━━
Entrega: ${tier?.label||'—'} · ${quoteData?.bussDays||'—'} días hábiles
Fecha solicitada: ${quoteData?.deliveryDate||'—'}
Total estimado: ${fmtGs(quoteData?.total||0)}
`);
    const a = document.createElement('a');
    a.href = `https://wa.me/595983545225?text=${msg}`;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setSent(true);
    if (onDone) setTimeout(onDone, 3500);
  };

  if (sent) return (
    <div style={{minHeight:'100%',background:'#080F1E',display:'flex',flexDirection:'column',
      alignItems:'center',justifyContent:'center',padding:32,textAlign:'center'}}>
      <div style={{width:80,height:80,borderRadius:999,background:'rgba(20,204,136,0.15)',
        border:'2px solid #14CC88',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:24}}>
        <Icon name="check" size={36} color="#14CC88"/>
      </div>
      <h2 style={{fontSize:24,fontWeight:800,color:'#E8EEFF',margin:'0 0 12px'}}>¡Cotización enviada!</h2>
      <p style={{fontSize:15,color:'#7A96BF',lineHeight:1.7,margin:'0 0 24px'}}>
        Te contactaremos por WhatsApp a la brevedad para confirmar tu pedido.
      </p>
      <div style={{background:'#111E35',border:'1px solid #1C3050',borderRadius:12,
        padding:'14px 20px',display:'inline-flex',gap:10,alignItems:'center'}}>
        <Icon name="copy" size={16} color="#7A96BF"/>
        <span style={{fontSize:14,color:'#7A96BF'}}>Código: </span>
        <span style={{fontSize:16,fontWeight:700,color:'#1D6BFF',letterSpacing:'0.04em'}}>{quoteCode}</span>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:'100%',background:'#080F1E',display:'flex',flexDirection:'column'}}>
      <AppBar title="Confirmar y solicitar" onBack={onBack} step={4} totalSteps={4}/>

      <div style={{flex:1,padding:'20px 16px 120px',overflowY:'auto'}}>
        <div style={{background:'#111E35',border:'1px solid #1C3050',borderRadius:16,padding:'16px',marginBottom:20}}>
          <SLabel>Resumen del pedido</SLabel>
          {[
            ['Código',   quoteCode],
            ['Remera',   SHIRT_COLORS_LABELS[editorData?.shirtColor]||'—'],
            ['Calidad',  qual?.label||'—'],
            ['Diseños',  (editorData?.designs||[]).map(d => areaLabel(d.area)).join(' · ')||'—'],
            ['Talles',   Object.entries(quoteData?.quantities||{}).filter(([,v])=>v>0).map(([s,v])=>`${s}:${v}`).join(' · ')||'—'],
            ['Fecha',    quoteData?.deliveryDate||'—'],
            ['Entrega',  `${tier?.label||'—'} (${quoteData?.bussDays||'—'} días hábiles)`],
            ['Total',    fmtGs(quoteData?.total||0)],
          ].map(([k,v]) => (
            <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid #0E1A2E'}}>
              <span style={{fontSize:13,color:'#7A96BF'}}>{k}</span>
              <span style={{fontSize:13,color:'#E8EEFF',fontWeight:500,textAlign:'right',maxWidth:'60%'}}>{v}</span>
            </div>
          ))}
        </div>

        <SLabel>Tus datos</SLabel>
        <div style={{display:'flex',flexDirection:'column',gap:12,marginBottom:16}}>
          <div>
            <label style={{fontSize:12,color:'#7A96BF',display:'block',marginBottom:6}}>Nombre completo *</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Ej: María González"
              style={{width:'100%',background:'#111E35',border:`1px solid ${nameErr?'#FF4D6A':'#1C3050'}`,
                borderRadius:10,padding:'13px 14px',fontSize:15,color:'#E8EEFF',
                fontFamily:'inherit',outline:'none',boxSizing:'border-box'}}/>
            {nameErr && <div style={{fontSize:12,color:'#FF4D6A',marginTop:4}}>{nameErr}</div>}
          </div>
          <div>
            <label style={{fontSize:12,color:'#7A96BF',display:'block',marginBottom:6}}>Teléfono / WhatsApp *</label>
            <input value={phone} onChange={e => setPhone(e.target.value)}
              placeholder="Ej: 0981 123 456" type="tel"
              style={{width:'100%',background:'#111E35',border:`1px solid ${phoneErr?'#FF4D6A':'#1C3050'}`,
                borderRadius:10,padding:'13px 14px',fontSize:15,color:'#E8EEFF',
                fontFamily:'inherit',outline:'none',boxSizing:'border-box'}}/>
            {phoneErr && <div style={{fontSize:12,color:'#FF4D6A',marginTop:4}}>{phoneErr}</div>}
          </div>
        </div>
        <Alert type="info">Al enviar se abrirá WhatsApp con todos los detalles de tu pedido.</Alert>
      </div>

      <div style={{position:'sticky',bottom:0,
        background:'linear-gradient(to top, #080F1E 80%, transparent)',padding:'16px 16px 32px'}}>
        <Btn fullWidth icon="whatsapp" onClick={handleSend}>Enviar por WhatsApp</Btn>
      </div>
    </div>
  );
};

const SHIRT_COLORS_REF = {
  blanco:'#F5F5F0',negro:'#1A1A1A',gris:'#6B7280',
  azul_marino:'#1E3A5F',rojo:'#9B1C1C',verde:'#14532D',
  celeste:'#1E6FAA',bordo:'#6B1C3C',
};
const SHIRT_COLORS_LABELS = {
  blanco:'Blanco',negro:'Negro',gris:'Gris',
  azul_marino:'Azul marino',rojo:'Rojo',verde:'Verde',
  celeste:'Celeste',bordo:'Bordó',
};

Object.assign(window, { QuoteScreen, ConfirmationScreen, fmtGs, QUALITIES, DELIVERY_TIERS, SHIRT_COLORS_REF, SHIRT_COLORS_LABELS, areaLabel });
