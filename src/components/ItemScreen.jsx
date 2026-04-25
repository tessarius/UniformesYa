import AppBar from './AppBar'
import Badge from './Badge'
import TShirtSVG from './TShirtSVG'

const items = [
  { id: 'remera',    label: 'Remera',    enabled: true,  color: '#1A3A6B' },
  { id: 'tote',      label: 'Tote Bag',  enabled: false, color: '#2A1E0E' },
  { id: 'hoodie',    label: 'Hoodie',    enabled: false, color: '#1A1A2E' },
  { id: 'gorra',     label: 'Gorra',     enabled: false, color: '#0E2A1A' },
  { id: 'boligrafo', label: 'Bolígrafo', enabled: false, color: '#2A0E1A' },
]

function ItemCard({ item, onSelect }) {
  return (
    <div
      onClick={() => item.enabled && onSelect(item.id)}
      style={{
        background: item.enabled ? '#111E35' : '#0C1626',
        border: `1px solid ${item.enabled ? '#1C3050' : '#0E1A2E'}`,
        borderRadius: 16, padding: '22px 16px',
        cursor: item.enabled ? 'pointer' : 'default',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        opacity: item.enabled ? 1 : 0.55, position: 'relative', transition: 'all 0.15s',
      }}
    >
      {!item.enabled && (
        <div style={{ position: 'absolute', top: 9, right: 9 }}>
          <Badge color="#7A96BF">Próximamente</Badge>
        </div>
      )}
      <TShirtSVG color={item.color} size={72} />
      <div style={{ fontSize: 14, fontWeight: 600, color: item.enabled ? '#E8EEFF' : '#3D5878' }}>
        {item.label}
      </div>
      {item.enabled && (
        <div style={{ fontSize: 12, color: '#1D6BFF', fontWeight: 500 }}>Disponible →</div>
      )}
    </div>
  )
}

export default function ItemScreen({ onSelect, onBack }) {
  return (
    <div style={{ minHeight: '100%', background: '#080F1E', display: 'flex', flexDirection: 'column' }}>
      <AppBar title="¿Qué querés personalizar?" onBack={onBack} step={1} totalSteps={4} />
      <div style={{ padding: '24px 18px', flex: 1 }}>
        <p style={{ fontSize: 14, color: '#7A96BF', marginBottom: 20, lineHeight: 1.6 }}>
          Por ahora solo remeras están disponibles. ¡Más productos vienen pronto!
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {items.map(item => <ItemCard key={item.id} item={item} onSelect={onSelect} />)}
        </div>
      </div>
    </div>
  )
}
