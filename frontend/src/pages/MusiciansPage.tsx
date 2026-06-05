import { useCallback, useEffect, useState } from 'react'
import { api } from '../api/client'
import MusicianCard from '../components/MusicianCard'
import { useAuth } from '../context/AuthContext'
import type { MusicianProfile } from '../types'
import { loadFilters, saveFilters } from '../utils/storage'

export default function MusiciansPage() {
  const { isLoggedIn } = useAuth()
  const [musicians, setMusicians] = useState<MusicianProfile[]>([])
  const [favorites, setFavorites] = useState<number[]>([])
  const [filters, setFilters] = useState<Record<string, string>>(() => loadFilters('musician'))

  const load = useCallback(async () => {
    const data = await api.profiles.list(filters)
    setMusicians(data)
  }, [filters])

  useEffect(() => {
    load().catch(() => {})
  }, [load])

  useEffect(() => {
    if (isLoggedIn) {
      api.favorites.list().then((favs) => {
        setFavorites(
          favs.filter((f) => f.targetType === 'musician').map((f) => f.targetId),
        )
      }).catch(() => {})
    }
  }, [isLoggedIn])

  const updateFilter = (key: string, value: string) => {
    const next = { ...filters, [key]: value }
    if (!value) delete next[key]
    setFilters(next)
    saveFilters('musician', next)
  }

  const toggleFavorite = async (id: number) => {
    if (!isLoggedIn) return
    try {
      if (favorites.includes(id)) {
        await api.favorites.removeByTarget('musician', id)
        setFavorites((prev) => prev.filter((f) => f !== id))
      } else {
        await api.favorites.add({ targetType: 'musician', targetId: id })
        setFavorites((prev) => [...prev, id])
      }
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="page">
      <div className="container">
        <h1>Музыканты</h1>

        <div className="filters-bar">
          <input
            placeholder="Поиск..."
            value={filters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value)}
          />
          <input
            placeholder="Город"
            value={filters.city || ''}
            onChange={(e) => updateFilter('city', e.target.value)}
          />
          <input
            placeholder="Инструмент"
            value={filters.instrument || ''}
            onChange={(e) => updateFilter('instrument', e.target.value)}
          />
          <input
            placeholder="Жанр"
            value={filters.genre || ''}
            onChange={(e) => updateFilter('genre', e.target.value)}
          />
          <input
            type="number"
            placeholder="Возраст от"
            value={filters.minAge || ''}
            onChange={(e) => updateFilter('minAge', e.target.value)}
          />
          <input
            type="number"
            placeholder="Возраст до"
            value={filters.maxAge || ''}
            onChange={(e) => updateFilter('maxAge', e.target.value)}
          />
          <select
            value={filters.sort || 'newest'}
            onChange={(e) => updateFilter('sort', e.target.value === 'newest' ? '' : e.target.value)}
          >
            <option value="newest">По новизне</option>
            <option value="experience">По опыту</option>
          </select>
        </div>

        <div className="grid-cards grid-cards--musicians">
          {musicians.map((m) => (
            <MusicianCard
              key={m.id}
              musician={m}
              isFavorite={favorites.includes(m.id)}
              onFavorite={toggleFavorite}
            />
          ))}
        </div>
        {musicians.length === 0 && <p className="empty-state">Музыканты не найдены</p>}
      </div>
    </div>
  )
}
