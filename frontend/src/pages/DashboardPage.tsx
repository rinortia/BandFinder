import { type FormEvent, useCallback, useEffect, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '../api/client'
import PhotoUpload from '../components/PhotoUpload'
import { useAuth } from '../context/AuthContext'
import type { Ad, Favorite } from '../types'
import { adDescription, adShortText, adTitle, adTypeLabel, pluralAge, statusLabel } from '../utils/format'
import { resolvePhotoUrl } from '../utils/photo'
import './DashboardPage.css'

type Tab = 'profile' | 'ads' | 'favorites'

export default function DashboardPage() {
  const { user, isLoggedIn, logout, refreshUser } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const tab = (searchParams.get('tab') as Tab) || 'profile'
  const [ads, setAds] = useState<Ad[]>([])
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [editOpen, setEditOpen] = useState(false)
  const navigate = useNavigate()

  const loadAds = useCallback(async () => {
    if (!user) return
    const data = await api.ads.list({ userId: String(user.id), status: '' })
    setAds(data)
  }, [user?.id])

  const loadFavorites = useCallback(async () => {
    const data = await api.favorites.list()
    setFavorites(data)
  }, [])

  useEffect(() => {
    if (!isLoggedIn || !user) return

    let cancelled = false
    ;(async () => {
      try {
        const data = await api.ads.list({ userId: String(user.id), status: '' })
        if (!cancelled) setAds(data)
      } catch {
        /* ignore */
      }
    })()

    return () => {
      cancelled = true
    }
  }, [isLoggedIn, user?.id, location.key, tab])

  useEffect(() => {
    if (isLoggedIn) {
      loadFavorites().catch(() => {})
    }
  }, [isLoggedIn, loadFavorites])

  if (!isLoggedIn) return <Navigate to="/login" replace />

  const setTab = (t: Tab) => setSearchParams({ tab: t })

  const handleDeleteAd = async (id: number) => {
    if (!confirm('Удалить объявление?')) return
    await api.ads.remove(id)
    loadAds()
  }

  const handleRemoveFavorite = async (id: number) => {
    await api.favorites.remove(id)
    loadFavorites()
  }

  const profile = user?.profile

  return (
    <div className="dashboard">
      <div className="container dashboard-inner">
        <aside className="dashboard-sidebar card">
          <h3>Личный кабинет</h3>
          <nav>
            <button type="button" className={tab === 'profile' ? 'active' : ''} onClick={() => setTab('profile')}>
              Профиль
            </button>
            <button type="button" className={tab === 'ads' ? 'active' : ''} onClick={() => setTab('ads')}>
              Мои объявления
            </button>
            <button type="button" className={tab === 'favorites' ? 'active' : ''} onClick={() => setTab('favorites')}>
              Избранное
            </button>
          </nav>
          <button
            type="button"
            className="logout-btn"
            onClick={() => {
              logout()
              navigate('/')
            }}
          >
            Выход
          </button>
        </aside>

        <div className="dashboard-content">
          {tab === 'profile' && profile && (
            <div className="card profile-card">
              <div className="profile-header">
                <h2>Профиль</h2>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setEditOpen(true)}>
                  Редактировать профиль
                </button>
              </div>
              <div className="profile-grid">
                <img
                  src={resolvePhotoUrl(profile.photo)}
                  alt={user.name}
                  className="profile-avatar"
                />
                <div>
                  <h3>{user.name}</h3>
                  <p className="profile-role">{profile.instrument}</p>
                  <p>📍 {profile.city}{user.age ? ` · ${pluralAge(user.age)}` : ''}</p>
                  {profile.genres && <p><strong>Жанры:</strong> {profile.genres}</p>}
                  <p><strong>Опыт:</strong> {profile.experience}</p>
                  {profile.description && <p><strong>О себе:</strong> {profile.description}</p>}
                  {profile.contact && (
                    <p><strong>Как со мной связаться:</strong> {profile.contact}</p>
                  )}
                  {profile.demoUrl && (
                    <p>
                      <strong>Демо:</strong>{' '}
                      <a href={profile.demoUrl} target="_blank" rel="noreferrer">{profile.demoUrl}</a>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {tab === 'ads' && (
            <div className="card">
              <div className="profile-header">
                <h2>Мои объявления</h2>
                <Link to="/ads/create" className="btn btn-primary btn-sm">Создать объявление</Link>
              </div>
              {ads.length === 0 && <p className="empty-state">У вас пока нет объявлений</p>}
              <div className="ads-list">
                {ads.map((ad) => (
                  <div key={ad.id} className="ad-list-item">
                    <div>
                      <div className="ad-list-badges">
                        <span className="tag">{adTypeLabel(ad.type)}</span>
                        <span className={`status-badge status-${ad.status}`}>{statusLabel(ad.status)}</span>
                      </div>
                      <p><strong>{adTitle(ad)}</strong></p>
                      {adDescription(ad) && <p>{adDescription(ad)}</p>}
                      <small>📍 {ad.city} · {ad.genre}</small>
                    </div>
                    <div className="ad-list-actions">
                      <Link to={`/ads/${ad.id}/edit`} className="btn btn-ghost btn-sm">Редактировать</Link>
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDeleteAd(ad.id)}>
                        Удалить
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'favorites' && (
            <div className="card">
              <h2>Избранное</h2>
              {favorites.length === 0 && <p className="empty-state">Избранное пусто</p>}
              <div className="favorites-list">
                {favorites.map((fav) => (
                  <div key={fav.id} className="favorite-item">
                    {fav.targetType === 'musician' && fav.data && 'instrument' in fav.data && (
                      <>
                        <div>
                          <strong>{(fav.data as import('../types').MusicianProfile).name}</strong>
                          <p>{fav.data.instrument} · {fav.data.city}</p>
                        </div>
                        <div className="ad-list-actions">
                          <Link to={`/musicians/${fav.targetId}`} className="btn btn-ghost btn-sm">Открыть</Link>
                          <button type="button" className="btn btn-danger btn-sm" onClick={() => handleRemoveFavorite(fav.id)}>
                            Удалить
                          </button>
                        </div>
                      </>
                    )}
                    {fav.targetType === 'ad' && fav.data && 'type' in fav.data && (
                      <>
                        <div>
                          <span className="tag">{adTypeLabel(fav.data.type)}</span>
                          <p>{adShortText(fav.data)}</p>
                        </div>
                        <div className="ad-list-actions">
                          <Link to={`/ads/${fav.targetId}`} className="btn btn-ghost btn-sm">Открыть</Link>
                          <button type="button" className="btn btn-danger btn-sm" onClick={() => handleRemoveFavorite(fav.id)}>
                            Удалить
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {editOpen && profile && (
        <ProfileEditModal
          user={user}
          profile={profile}
          onClose={() => setEditOpen(false)}
          onPhotoUpdated={refreshUser}
          onSaved={() => {
            refreshUser()
            setEditOpen(false)
          }}
        />
      )}
    </div>
  )
}

function ProfileEditModal({
  user,
  profile,
  onClose,
  onSaved,
  onPhotoUpdated,
}: {
  user: { name: string; age: number | null }
  profile: {
    city: string
    instrument: string
    genres: string
    experience: string
    photo?: string | null
    demoUrl?: string | null
    description?: string | null
    contact?: string | null
  }
  onClose: () => void
  onSaved: () => void
  onPhotoUpdated: () => void
}) {
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: user.name,
    age: user.age?.toString() || '',
    city: profile.city,
    instrument: profile.instrument,
    genres: profile.genres,
    experience: profile.experience,
    photo: profile.photo || '',
    demoUrl: profile.demoUrl || '',
    description: profile.description || '',
    contact: profile.contact || '',
  })

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await api.profiles.updateMe({
        ...form,
        age: parseInt(form.age, 10),
      })
      onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сохранения')
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Редактировать профиль</h2>
          <button type="button" className="modal-close" onClick={onClose}>×</button>
        </div>
        {error && <div className="form-alert">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Имя *</label>
              <input required value={form.name} onChange={(e) => update('name', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Возраст *</label>
              <input type="number" required min={14} value={form.age} onChange={(e) => update('age', e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Город *</label>
              <input required value={form.city} onChange={(e) => update('city', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Инструмент *</label>
              <input required value={form.instrument} onChange={(e) => update('instrument', e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Жанры</label>
              <input value={form.genres} onChange={(e) => update('genres', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Опыт *</label>
              <input required value={form.experience} onChange={(e) => update('experience', e.target.value)} />
            </div>
          </div>
          <PhotoUpload
            value={form.photo}
            onChange={(url) => {
              update('photo', url)
              onPhotoUpdated()
            }}
            onUpload={(file) => api.profiles.uploadPhoto(file).then((p) => p.photo || '')}
          />
          <div className="form-group">
            <label>Демо (URL)</label>
            <input value={form.demoUrl} onChange={(e) => update('demoUrl', e.target.value)} />
          </div>
          <div className="form-group">
            <label>О себе</label>
            <textarea rows={3} value={form.description} onChange={(e) => update('description', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Как со мной связаться</label>
            <input
              value={form.contact}
              onChange={(e) => update('contact', e.target.value)}
              placeholder="+7 ... или @telegram"
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Отмена</button>
            <button type="submit" className="btn btn-primary">Сохранить</button>
          </div>
        </form>
      </div>
    </div>
  )
}
