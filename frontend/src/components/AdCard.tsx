import { Link } from 'react-router-dom'
import type { Ad } from '../types'
import { adDescription, adTitle, adTypeLabel, formatDate } from '../utils/format'
import AdIcon from './AdIcon'
import './AdCard.css'

interface AdCardProps {
  ad: Ad
  compact?: boolean
}

export default function AdCard({ ad, compact }: AdCardProps) {
  const title = adTitle(ad)
  const description = adDescription(ad)

  return (
    <article className={`ad-card ${compact ? 'ad-card--compact' : ''}`}>
      <span className="tag ad-card-type">{adTypeLabel(ad.type)}</span>
      <div className="ad-card-header">
        <div className="ad-card-icon">
          <AdIcon icon={ad.icon} />
        </div>
        <div className="ad-card-text">
          <h3>{title}</h3>
          {description && (
            <p className="ad-card-desc">{description}</p>
          )}
        </div>
      </div>
      <div className="ad-card-meta">
        <span>📍 {ad.city}</span>
        <span className="tag">{ad.genre}</span>
      </div>
      <div className="ad-card-footer">
        <span className="ad-card-date">{formatDate(ad.createdAt)}</span>
        <Link to={`/ads/${ad.id}`} className="btn btn-outline btn-sm">Подробнее</Link>
      </div>
    </article>
  )
}
