import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import type { Ad } from '../types'
import { adTypeLabel, adDescription, adTitle, formatDate } from '../utils/format'
import AdIcon from '../components/AdIcon'
import FavoriteButton from '../components/FavoriteButton'

export default function AdDetailPage() {
  const { id } = useParams()
  const { isLoggedIn } = useAuth()
  const [ad, setAd] = useState<Ad | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    if (!id) return
    api.ads.get(Number(id)).then(setAd).catch(() => {})
    if (isLoggedIn) {
      api.favorites.list().then((favs) => {
        setIsFavorite(favs.some((f) => f.targetType === 'ad' && f.targetId === Number(id)))
      }).catch(() => {})
    }
  }, [id, isLoggedIn])

  const toggleFavorite = async () => {
    if (!isLoggedIn || !ad) return
    try {
      if (isFavorite) {
        await api.favorites.removeByTarget('ad', ad.id)
        setIsFavorite(false)
      } else {
        await api.favorites.add({ targetType: 'ad', targetId: ad.id })
        setIsFavorite(true)
      }
    } catch {
      /* ignore */
    }
  }

  if (!ad) {
    return <div className="page container"><p className="empty-state">Загрузка...</p></div>
  }

  return (
    <div className="page">
      <div className="container">
        <Link to="/ads" className="back-link">← Назад к объявлениям</Link>
        <div className="detail-card card">
          <div className="detail-card-header">
            <div className="detail-card-title-row">
              <div className="ad-card-icon detail-ad-icon">
                <AdIcon icon={ad.icon} />
              </div>
              <div>
                <span className="tag">{adTypeLabel(ad.type)}</span>
                <h1>{adTitle(ad)}</h1>
              </div>
            </div>
            {isLoggedIn && (
              <FavoriteButton active={isFavorite} onClick={toggleFavorite} />
            )}
          </div>
          <p className="detail-meta">📍 {ad.city} · {ad.genre} · {formatDate(ad.createdAt)}</p>
          {adDescription(ad) && <p>{adDescription(ad)}</p>}
          {ad.contact && <p><strong>Контакт:</strong> {ad.contact}</p>}
          {ad.user && <p><strong>Автор:</strong> {ad.user.name}</p>}
        </div>
      </div>
    </div>
  )
}
