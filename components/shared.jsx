// ─── SHARED COMPONENTS ─────────────────────────────────────────────────────
// Icons, Modal, Button, AppBar, Chip — exported to window

const Icon = ({ name, size = 20, color = 'currentColor' }) => {
  const icons = {
    arrow_left: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>,
    upload: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
    trash: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    x: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    warning: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    info: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
    zap: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    layers: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
    whatsapp: <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
    copy: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>,
    search: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    chevron_right: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
    image: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
    palette: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill={color}/><circle cx="17.5" cy="10.5" r=".5" fill={color}/><circle cx="8.5" cy="7.5" r=".5" fill={color}/><circle cx="6.5" cy="12.5" r=".5" fill={color}/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>,
    clock: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    logout: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    eye: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    filter: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  };
  return icons[name] || null;
};

// ── Modal ──────────────────────────────────────────────────────────────────
const Modal = ({ open, onClose, title, children, actions, noClose }) => {
  if (!open) return null;
  return (
    <div style={{position:'fixed',inset:0,zIndex:200,display:'flex',alignItems:'flex-end',justifyContent:'center',background:'rgba(0,0,0,0.7)',backdropFilter:'blur(4px)'}}
      onClick={noClose ? undefined : onClose}>
      <div style={{
        width:'100%', maxWidth:480, background:'#111E35', borderRadius:'20px 20px 0 0',
        padding:'8px 0 0', maxHeight:'90vh', overflowY:'auto',
      }} onClick={e => e.stopPropagation()}>
        {/* Handle bar */}
        <div style={{width:40,height:4,background:'#1C3050',borderRadius:2,margin:'0 auto 20px'}}/>
        {title && <div style={{fontSize:18,fontWeight:700,color:'#E8EEFF',padding:'0 24px 16px',lineHeight:1.3}}>{title}</div>}
        <div style={{padding:'0 24px'}}>{children}</div>
        {actions && <div style={{padding:'20px 24px 32px',display:'flex',flexDirection:'column',gap:10}}>{actions}</div>}
      </div>
    </div>
  );
};

// ── Button ─────────────────────────────────────────────────────────────────
const Btn = ({ children, onClick, variant = 'primary', disabled, icon, fullWidth, small, style: extraStyle = {} }) => {
  const base = {
    display:'flex', alignItems:'center', justifyContent:'center', gap:8,
    fontFamily:'inherit', fontWeight:600, cursor: disabled ? 'not-allowed' : 'pointer',
    border:'none', borderRadius:12, transition:'all 0.15s', outline:'none',
    fontSize: small ? 14 : 16, padding: small ? '10px 16px' : '15px 20px',
    width: fullWidth ? '100%' : undefined, opacity: disabled ? 0.4 : 1,
    ...extraStyle,
  };
  const styles = {
    primary: { background: disabled ? '#1C3050' : '#1D6BFF', color:'#fff', boxShadow: disabled ? 'none' : '0 4px 20px rgba(29,107,255,0.35)' },
    secondary: { background:'#152035', color:'#8BAAC8', border:'1px solid #1C3050' },
    ghost: { background:'transparent', color:'#7A96BF' },
    danger: { background:'#2A1020', color:'#FF4D6A', border:'1px solid #FF4D6A33' },
    success: { background:'#0D2A1F', color:'#14CC88', border:'1px solid #14CC8833' },
  };
  return (
    <button style={{...base, ...styles[variant]}} onClick={disabled ? undefined : onClick}>
      {icon && <Icon name={icon} size={18} />}
      {children}
    </button>
  );
};

// ── AppBar ─────────────────────────────────────────────────────────────────
const AppBar = ({ title, onBack, step, totalSteps, rightAction }) => (
  <div style={{display:'flex',alignItems:'center',padding:'12px 16px',gap:12,borderBottom:'1px solid #0E1A2E',background:'#080F1E',position:'sticky',top:0,zIndex:50}}>
    {onBack && (
      <button onClick={onBack} style={{background:'#111E35',border:'none',width:36,height:36,borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',flexShrink:0}}>
        <Icon name="arrow_left" size={18} color="#7A96BF"/>
      </button>
    )}
    <div style={{flex:1}}>
      <div style={{fontSize:16,fontWeight:600,color:'#E8EEFF'}}>{title}</div>
      {step && <div style={{fontSize:12,color:'#3D5878',marginTop:1}}>Paso {step} de {totalSteps}</div>}
    </div>
    {rightAction}
  </div>
);

// ── Pill Badge ─────────────────────────────────────────────────────────────
const Badge = ({ children, color = '#1D6BFF' }) => (
  <span style={{display:'inline-block',fontSize:11,fontWeight:700,padding:'3px 8px',borderRadius:6,background:color+'22',color,letterSpacing:'0.04em',textTransform:'uppercase'}}>
    {children}
  </span>
);

// ── Toast / Inline Alert ───────────────────────────────────────────────────
const Alert = ({ type = 'warn', children }) => {
  const cfg = {
    warn:  { bg:'#2A1E0A', border:'#F59E0B33', icon:'warning', color:'#F59E0B' },
    error: { bg:'#2A0A12', border:'#FF4D6A33', icon:'x',       color:'#FF4D6A' },
    info:  { bg:'#0A1830', border:'#1D6BFF33', icon:'info',     color:'#7AADFF' },
    success: { bg:'#0A2118', border:'#14CC8833', icon:'check', color:'#14CC88' },
  }[type];
  return (
    <div style={{display:'flex',gap:10,alignItems:'flex-start',padding:'12px 14px',borderRadius:10,background:cfg.bg,border:`1px solid ${cfg.border}`,fontSize:13,color:cfg.color,lineHeight:1.5}}>
      <Icon name={cfg.icon} size={16} color={cfg.color}/>
      <span>{children}</span>
    </div>
  );
};

// ── Divider ────────────────────────────────────────────────────────────────
const Divider = ({ label }) => (
  <div style={{display:'flex',alignItems:'center',gap:12,margin:'4px 0'}}>
    <div style={{flex:1,height:1,background:'#1C3050'}}/>
    {label && <span style={{fontSize:11,color:'#3D5878',fontWeight:600,letterSpacing:'0.06em',textTransform:'uppercase'}}>{label}</span>}
    <div style={{flex:1,height:1,background:'#1C3050'}}/>
  </div>
);

// ── Section label ──────────────────────────────────────────────────────────
const SLabel = ({ children }) => (
  <div style={{fontSize:11,fontWeight:700,color:'#3D5878',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:10}}>
    {children}
  </div>
);

Object.assign(window, { Icon, Modal, Btn, AppBar, Badge, Alert, Divider, SLabel });
