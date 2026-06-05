import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import AdCard from '../components/AdCard'
import MusicianCard from '../components/MusicianCard'
import type { Ad, MusicianProfile } from '../types'
import './HomePage.css'

export default function HomePage() {
  const [ads, setAds] = useState<Ad[]>([])
  const [musicians, setMusicians] = useState<MusicianProfile[]>([])

  useEffect(() => {
    api.ads.list({ limit: '4' }).then(setAds).catch(() => {})
    api.profiles.list({}).then((data) => setMusicians(data.slice(0, 4))).catch(() => {})
  }, [])

  return (
    <>
      <section className="hero-section">
        <div className="container">
          <div className="hero">
            <div className="hero-overlay" />
            <div className="hero-content">
              <h1>Найди свою группу</h1>
              <p>Платформа для поиска музыкантов и создания музыкальных коллективов</p>
              <div className="hero-actions">
                <Link to="/ads?type=LOOKING_FOR_BAND" className="btn btn-primary">
                  Найти группу
                </Link>
                <Link to="/ads?type=LOOKING_FOR_MUSICIAN" className="btn btn-white">
                  Найти музыканта
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="page">
        <div className="container">
          <section className="home-section">
            <div className="section-title">
              <h2>Последние объявления</h2>
              <Link to="/ads">Смотреть все →</Link>
            </div>
            <div className="grid-cards grid-cards--ads">
              {ads.map((ad) => (
                <AdCard key={ad.id} ad={ad} compact />
              ))}
            </div>
            {ads.length === 0 && <p className="empty-state">Объявлений пока нет</p>}
          </section>

          <section className="home-section">
            <div className="section-title">
              <h2>Новые музыканты</h2>
              <Link to="/musicians">Смотреть все →</Link>
            </div>
            <div className="grid-cards grid-cards--musicians">
              {musicians.map((m) => (
                <MusicianCard key={m.id} musician={m} />
              ))}
            </div>
            {musicians.length === 0 && <p className="empty-state">Музыкантов пока нет</p>}
          </section>
        </div>
      </div>
    </>
  )
}
