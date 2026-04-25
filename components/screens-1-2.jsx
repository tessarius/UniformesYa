// ─── SCREENS 1 & 2: BIENVENIDA + SELECCIÓN DE ITEM ────────────────────────

const TShirtSVG = ({ color = '#1E3A5F', size = 80 }) => (
  <svg width={size} height={size * 1.1} viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M 68 14 Q 100 46 132 14 L 196 46 L 178 92 L 152 80 L 152 212 L 48 212 L 48 80 L 22 92 L 4 46 Z"
      fill={color} stroke="rgba(255,255,255,0.08)" strokeWidth="1.5"/>
    <path d="M 68 14 Q 100 46 132 14 Q 116 12 100 12 Q 84 12 68 14 Z"
      fill="rgba(0,0,0,0.2)"/>
  </svg>
);

// ── Screen 1: Bienvenida ───────────────────────────────────────────────────
const WelcomeScreen = ({ onStart }) => {
  const steps = [
    { icon: 'layers',  label: 'Elegí tu item',       desc: 'Remera, hoodie, tote bag y más' },
    { icon: 'upload',  label: 'Subí tu diseño',       desc: 'PNG o SVG en alta calidad' },
    { icon: 'zap',     label: 'Cotizá al instante',   desc: 'Precio en tiempo real' },
    { icon: 'whatsapp',label: 'Solicitá por WhatsApp', desc: 'Confirmamos y producimos' },
  ];

  return (
    <div style={{minHeight:'100%', display:'flex', flexDirection:'column', background:'#080F1E'}}>
      {/* Hero */}
      <div style={{padding:'48px 24px 32px', textAlign:'center', position:'relative', overflow:'hidden'}}>
        {/* Background glow */}
        <div style={{position:'absolute',top:-60,left:'50%',transform:'translateX(-50%)',width:300,height:300,
          background:'radial-gradient(circle, rgba(29,107,255,0.18) 0%, transparent 70%)',pointerEvents:'none'}}/>

        {/* Logo placeholder */}
        <div style={{display:'inline-flex',alignItems:'center',gap:10,marginBottom:32,position:'relative'}}>
          <div style={{width:40,height:40,borderRadius:10,background:'linear-gradient(135deg,#1D6BFF,#0A3FCC)',
            display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 20px rgba(29,107,255,0.5)'}}>
            <Icon name="zap" size={20} color="#fff"/>
          </div>
          <span style={{fontSize:22,fontWeight:800,color:'#E8EEFF',letterSpacing:'-0.03em'}}>UniformesYA</span>
        </div>

        {/* T-shirts visual */}
        <div style={{display:'flex',justifyContent:'center',gap:-16,marginBottom:28,position:'relative'}}>
          {['#1A3A6B','#1E1E1E','#4A5568','#8B1A1A'].map((c,i) => (
            <div key={i} style={{marginLeft: i > 0 ? -12 : 0, filter:`drop-shadow(0 4px 16px rgba(0,0,0,0.5))`}}>
              <TShirtSVG color={c} size={60}/>
            </div>
          ))}
        </div>

        <h1 style={{fontSize:28,fontWeight:800,color:'#E8EEFF',lineHeight:1.2,margin:'0 0 12px',letterSpacing:'-0.02em'}}>
          Diseñá tu remera y<br/><span style={{color:'#1D6BFF'}}>cotizá al instante</span>
        </h1>
        <p style={{fontSize:15,color:'#7A96BF',lineHeight:1.6,margin:'0 0 32px',maxWidth:280,marginLeft:'auto',marginRight:'auto'}}>
          Subí tu diseño, ubicalo en la remera y recibí tu presupuesto en segundos.
        </p>
        <Btn onClick={onStart} style={{maxWidth:280,margin:'0 auto'}}>
          Empezar ahora
        </Btn>
      </div>

      {/* Steps */}
      <div style={{flex:1,padding:'32px 24px',display:'flex',flexDirection:'column',gap:0}}>
        <SLabel>Cómo funciona</SLabel>
        <div style={{display:'flex',flexDirection:'column',gap:0}}>
          {steps.map((s, i) => (
            <div key={i} style={{display:'flex',gap:16,paddingBottom:i < steps.length-1 ? 20 : 0, position:'relative'}}>
              {/* Timeline line */}
              {i < steps.length - 1 && (
                <div style={{position:'absolute',left:20,top:40,width:1,height:'calc(100% - 20px)',background:'#1C3050'}}/>
              )}
              <div style={{width:40,height:40,borderRadius:12,background:'#111E35',border:'1px solid #1C3050',
                display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,position:'relative',zIndex:1}}>
                <Icon name={s.icon} size={18} color="#1D6BFF"/>
              </div>
              <div style={{paddingTop:8}}>
                <div style={{fontSize:15,fontWeight:600,color:'#E8EEFF',marginBottom:2}}>{s.label}</div>
                <div style={{fontSize:13,color:'#7A96BF'}}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{padding:'20px 24px',borderTop:'1px solid #0E1A2E',textAlign:'center'}}>
        <p style={{fontSize:12,color:'#3D5878',margin:0}}>
          Asunción, Paraguay · uniformesya@gmail.com
        </p>
      </div>
    </div>
  );
};

// ── Screen 2: Selección de Item ─────────────────────────────────────────────
const ItemScreen = ({ onSelect, onBack }) => {
  const items = [
    { id: 'remera',   label: 'Remera',     enabled: true,  color:'#1A3A6B' },
    { id: 'tote',     label: 'Tote Bag',   enabled: false, color:'#2A1E0E' },
    { id: 'hoodie',   label: 'Hoodie',     enabled: false, color:'#1A1A2E' },
    { id: 'gorra',    label: 'Gorra',      enabled: false, color:'#0E2A1A' },
    { id: 'boligrafo',label: 'Bolígrafo',  enabled: false, color:'#2A0E1A' },
  ];

  const ItemCard = ({ item }) => (
    <div onClick={() => item.enabled && onSelect(item.id)}
      style={{
        background: item.enabled ? '#111E35' : '#0C1626',
        border: `1px solid ${item.enabled ? '#1C3050' : '#0E1A2E'}`,
        borderRadius:16, padding:'20px 16px', cursor: item.enabled ? 'pointer' : 'default',
        display:'flex', flexDirection:'column', alignItems:'center', gap:12,
        opacity: item.enabled ? 1 : 0.55, position:'relative', transition:'all 0.15s',
      }}>
      {!item.enabled && (
        <div style={{position:'absolute',top:8,right:8}}>
          <Badge color="#7A96BF">Próximamente</Badge>
        </div>
      )}
      <TShirtSVG color={item.color} size={72}/>
      <div style={{fontSize:14,fontWeight:600,color: item.enabled ? '#E8EEFF' : '#3D5878'}}>
        {item.label}
      </div>
      {item.enabled && (
        <div style={{fontSize:12,color:'#1D6BFF',fontWeight:500}}>Disponible →</div>
      )}
    </div>
  );

  return (
    <div style={{minHeight:'100%',background:'#080F1E',display:'flex',flexDirection:'column'}}>
      <AppBar title="¿Qué querés personalizar?" onBack={onBack} step={1} totalSteps={4}/>
      <div style={{padding:'24px 16px',flex:1}}>
        <p style={{fontSize:14,color:'#7A96BF',margin:'0 0 20px',lineHeight:1.6}}>
          Por ahora solo remeras están disponibles. ¡Más productos vienen pronto!
        </p>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          {items.map(item => <ItemCard key={item.id} item={item}/>)}
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { WelcomeScreen, ItemScreen, TShirtSVG });
