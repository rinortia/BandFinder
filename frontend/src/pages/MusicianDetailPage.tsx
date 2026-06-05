import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import type { MusicianProfile } from '../types'
import { pluralAge } from '../utils/format'
import FavoriteButton from '../components/FavoriteButton'
import { resolvePhotoUrl } from '../utils/photo'

export default function MusicianDetailPage() {
  const { id } = useParams()
  const { isLoggedIn } = useAuth()
  const [musician, setMusician] = useState<MusicianProfile | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    if (!id) return
    api.profiles.get(Number(id)).then(setMusician).catch(() => {})
    if (isLoggedIn) {
      api.favorites.list().then((favs) => {
        setIsFavorite(favs.some((f) => f.targetType === 'musician' && f.targetId === Number(id)))
      }).catch(() => {})
    }
  }, [id, isLoggedIn])

  const toggleFavorite = async () => {
    if (!isLoggedIn || !musician) return
    try {
      if (isFavorite) {
        await api.favorites.removeByTarget('musician', musician.id)
        setIsFavorite(false)
      } else {
        await api.favorites.add({ targetType: 'musician', targetId: musician.id })
        setIsFavorite(true)
      }
    } catch {
      /* ignore */
    }
  }

  if (!musician) {
    return <div className="page container"><p className="empty-state">Загрузка...</p></div>
  }

  return (
    <div className="page">
      <div className="container">
        <Link to="/musicians" className="back-link">← Назад к каталогу</Link>
        <div className="detail-card card">
          <div className="detail-grid">
            <img
              className="detail-photo"
              src={resolvePhotoUrl(musician.photo)}
              alt={musician.name}
            />
            <div>
              <div className="detail-card-header">
                <h1>{musician.name}</h1>
                {isLoggedIn && (
                  <FavoriteButton active={isFavorite} onClick={toggleFavorite} />
                )}
              </div>
              <p className="detail-role">{musician.instrument}</p>
              <p>📍 {musician.city}{musician.age ? ` · ${pluralAge(musician.age)}` : ''}</p>
              {musician.genres && <p><strong>Жанры:</strong> {musician.genres}</p>}
              <p><strong>Опыт:</strong> {musician.experience}</p>
              {musician.description && (
                <p><strong>О себе:</strong> {musician.description}</p>
              )}
              {musician.contact && (
                <p><strong>Как со мной связаться:</strong> {musician.contact}</p>
              )}
              {musician.demoUrl && (
                <p>
                  <strong>Демо:</strong>{' '}
                  <a href={musician.demoUrl} target="_blank" rel="noreferrer">
                    {musician.demoUrl}
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
