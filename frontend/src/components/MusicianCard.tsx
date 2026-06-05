import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { MusicianProfile } from '../types'
import { resolvePhotoUrl } from '../utils/photo'
import FavoriteButton from './FavoriteButton'
import './MusicianCard.css'

interface MusicianCardProps {
  musician: MusicianProfile
  onFavorite?: (id: number) => void
  isFavorite?: boolean
}

export default function MusicianCard({ musician, onFavorite, isFavorite }: MusicianCardProps) {
  const { isLoggedIn } = useAuth()

  return (
    <article className="musician-card">
      <div className="musician-card-photo">
        <img
          src={resolvePhotoUrl(musician.photo)}
          alt={musician.name}
        />
        {isLoggedIn && onFavorite && (
          <FavoriteButton
            variant="overlay"
            active={!!isFavorite}
            onClick={() => onFavorite(musician.id)}
          />
        )}
      </div>
      <div className="musician-card-body">
        <h3>{musician.name}</h3>
        <p className="musician-role">{musician.instrument}</p>
        <p className="musician-meta">📍 {musician.city}</p>
        {musician.genres && (
          <p className="musician-genres">{musician.genres}</p>
        )}
        <p className="musician-exp">Опыт: {musician.experience}</p>
        <Link to={`/musicians/${musician.id}`} className="btn btn-outline btn-sm">
          Подробнее
        </Link>
      </div>
    </article>
  )
}
