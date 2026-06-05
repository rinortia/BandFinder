import './FavoriteButton.css'

interface FavoriteButtonProps {
  active: boolean
  onClick: () => void
  variant?: 'overlay' | 'detail'
}

export default function FavoriteButton({
  active,
  onClick,
  variant = 'detail',
}: FavoriteButtonProps) {
  return (
    <button
      type="button"
      className={`favorite-btn favorite-btn--${variant} ${active ? 'active' : ''}`}
      onClick={onClick}
      aria-label={active ? 'Убрать из избранного' : 'В избранное'}
      aria-pressed={active}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 4a2 2 0 0 0-2 2v14l7-4 7 4V6a2 2 0 0 0-2-2H7z" />
      </svg>
    </button>
  )
}
