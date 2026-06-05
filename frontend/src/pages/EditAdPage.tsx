import { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { api } from '../api/client'
import AdFormPage from './AdFormPage'

function mapAdToInitial(ad: import('../types').Ad) {
  return {
    type: ad.type,
    icon: ad.icon,
    city: ad.city,
    genre: ad.genre,
    instrument: ad.instrument || '',
    about: ad.about || '',
    lookingFor: ad.lookingFor || '',
    description: ad.description || '',
    contact: ad.contact || '',
    status: ad.status,
  }
}

export default function EditAdPage() {
  const { id } = useParams()
  const [initial, setInitial] = useState<Record<string, unknown> | null>(null)

  useEffect(() => {
    if (!id) return

    let cancelled = false
    setInitial(null)

    api.ads
      .get(Number(id))
      .then((ad) => {
        if (!cancelled) setInitial(mapAdToInitial(ad))
      })
      .catch(() => {
        if (!cancelled) setInitial({})
      })

    return () => {
      cancelled = true
    }
  }, [id])

  if (!id) return <Navigate to="/ads" replace />
  if (!initial) {
    return (
      <div className="page container">
        <p className="empty-state">Загрузка...</p>
      </div>
    )
  }

  return <AdFormPage key={id} adId={Number(id)} initial={initial} />
}
