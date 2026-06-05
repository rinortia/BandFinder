import { AD_ICONS, type AdIconId } from '../constants/adIcons'
import AdIcon from './AdIcon'
import './AdIconPicker.css'

interface AdIconPickerProps {
  value: string
  onChange: (icon: AdIconId) => void
}

export default function AdIconPicker({ value, onChange }: AdIconPickerProps) {
  return (
    <div className="ad-icon-picker" role="radiogroup" aria-label="Выбор иконки">
      {AD_ICONS.map((icon) => (
        <button
          key={icon.id}
          type="button"
          role="radio"
          aria-checked={value === icon.id}
          aria-label={icon.label}
          className={`ad-icon-picker__item ${value === icon.id ? 'selected' : ''}`}
          onClick={() => onChange(icon.id)}
        >
          <AdIcon icon={icon.id} />
          <span>{icon.label}</span>
        </button>
      ))}
    </div>
  )
}
