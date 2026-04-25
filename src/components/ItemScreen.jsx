import AppBar from './AppBar'
import Badge from './Badge'
import TShirtSVG from './TShirtSVG'

const items = [
  { id: 'remera',    label: 'Remera',    enabled: true,  color: '#1A3A6B' },
  { id: 'tote',      label: 'Tote Bag',  enabled: false, color: '#2A1E0E' },
  { id: 'hoodie',    label: 'Hoodie',    enabled: false, color: '#1A1A2E' },
  { id: 'gorra',     label: 'Gorra',     enabled: false, color: '#0E2A1A' },
  { id: 'boligrafo', label: 'Boligrafo', enabled: false, color: '#2A0E1A' },
]

function ItemCard({ item, onSelect }) {
  return (
    <div
      onClick={() => item.enabled && onSelect(item.id)}
      className={`
        rounded-2xl p-5 flex flex-col items-center gap-3 relative transition-all
        ${item.enabled
          ? 'bg-dark-surface border border-dark-border cursor-pointer'
          : 'bg-[#0C1626] border border-dark-border-subtle cursor-default opacity-55'
        }
      `}
    >
      {!item.enabled && (
        <div className="absolute top-2 right-2">
          <Badge color="#7A96BF">Proximamente</Badge>
        </div>
      )}
      <TShirtSVG color={item.color} size={72} />
      <div className={`text-sm font-semibold ${item.enabled ? 'text-text-primary' : 'text-text-muted'}`}>
        {item.label}
      </div>
      {item.enabled && (
        <div className="text-xs text-accent font-medium">Disponible →</div>
      )}
    </div>
  )
}

export default function ItemScreen({ onSelect, onBack }) {
  return (
    <div className="min-h-full bg-dark-bg flex flex-col">
      <AppBar title="Que queres personalizar?" onBack={onBack} step={1} totalSteps={4} />
      <div className="p-4 flex-1">
        <p className="text-sm text-text-secondary mb-5 leading-relaxed">
          Por ahora solo remeras estan disponibles. Mas productos vienen pronto!
        </p>
        <div className="grid grid-cols-2 gap-3">
          {items.map(item => <ItemCard key={item.id} item={item} onSelect={onSelect} />)}
        </div>
      </div>
    </div>
  )
}
