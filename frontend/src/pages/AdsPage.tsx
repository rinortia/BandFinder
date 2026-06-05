import { useCallback, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../api/client'
import AdCard from '../components/AdCard'
import { useAuth } from '../context/AuthContext'
import type { Ad } from '../types'
import { loadFilters, saveFilters } from '../utils/storage'

export default function AdsPage() {
  const { isLoggedIn } = useAuth()
  const [searchParams] = useSearchParams()
  const [ads, setAds] = useState<Ad[]>([])
  const [filters, setFilters] = useState<Record<string, string>>(() => ({
    ...loadFilters('ad'),
    ...(searchParams.get('type') ? { type: searchParams.get('type')! } : {}),
  }))

  const load = useCallback(async () => {
    const data = await api.ads.list(filters)
    setAds(data)
  }, [filters])

  useEffect(() => {
    load().catch(() => {})
  }, [load])

  const updateFilter = (key: string, value: string) => {
    const next = { ...filters, [key]: value }
    if (!value) delete next[key]
    setFilters(next)
    saveFilters('ad', next)
  }

  return (
    <div className="page">
      <div className="container">
        <div className="page-header-row">
          <h1>Объявления</h1>
          {isLoggedIn && (
            <Link to="/ads/create" className="btn btn-primary">Создать объявление</Link>
          )}
        </div>

        <div className="filters-bar">
          <input
            placeholder="Поиск по тексту..."
            value={filters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value)}
          />
          <select
            value={filters.type || ''}
            onChange={(e) => updateFilter('type', e.target.value)}
          >
            <option value="">Все типы</option>
            <option value="LOOKING_FOR_BAND">Ищу группу</option>
            <option value="LOOKING_FOR_MUSICIAN">Ищу музыканта</option>
          </select>
          <input
            placeholder="Город"
            value={filters.city || ''}
            onChange={(e) => updateFilter('city', e.target.value)}
          />
          <input
            placeholder="Жанр"
            value={filters.genre || ''}
            onChange={(e) => updateFilter('genre', e.target.value)}
          />
        </div>

        <div className="grid-cards grid-cards--ads">
          {ads.map((ad) => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
        {ads.length === 0 && <p className="empty-state">Объявления не найдены</p>}
      </div>
    </div>
  )
}
