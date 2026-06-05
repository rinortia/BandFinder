import { type FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { clearAdDraft, loadAdDraft, saveAdDraft } from '../utils/storage'
import AdIconPicker from '../components/AdIconPicker'
import type { AdIconId } from '../constants/adIcons'

interface AdFormProps {
  initial?: Record<string, unknown>
  adId?: number
}

function createEmptyAdForm() {
  return {
    type: 'LOOKING_FOR_BAND',
    icon: '',
    city: '',
    genre: '',
    instrument: '',
    about: '',
    lookingFor: '',
    description: '',
    contact: '',
    status: 'active',
  }
}

function mapAdToForm(source?: Record<string, unknown> | null) {
  return { ...createEmptyAdForm(), ...(source || {}) }
}

export default function AdFormPage({ initial, adId }: AdFormProps) {
  const navigate = useNavigate()
  const { isLoggedIn } = useAuth()
  const [error, setError] = useState('')
  const [form, setForm] = useState(() => {
    if (adId) return mapAdToForm(initial)
    return mapAdToForm(loadAdDraft())
  })

  useEffect(() => {
    if (!isLoggedIn) navigate('/login')
  }, [isLoggedIn, navigate])

  const update = (key: string, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value }
      if (!adId) saveAdDraft(next)
      return next
    })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.icon) {
      setError('Выберите иконку объявления')
      return
    }
    try {
      if (adId) {
        await api.ads.update(adId, form)
        clearAdDraft()
      } else {
        await api.ads.create(form)
        clearAdDraft()
      }
      navigate('/dashboard?tab=ads', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сохранения')
    }
  }

  return (
    <div className="page">
      <div className="container auth-container auth-container--wide">
        <div className="card auth-card">
          <h1>{adId ? 'Редактировать объявление' : 'Создать объявление'}</h1>
          {error && <div className="form-alert">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Тип объявления</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="type"
                    checked={form.type === 'LOOKING_FOR_BAND'}
                    onChange={() => update('type', 'LOOKING_FOR_BAND')}
                  />
                  Ищу группу
                </label>
                <label>
                  <input
                    type="radio"
                    name="type"
                    checked={form.type === 'LOOKING_FOR_MUSICIAN'}
                    onChange={() => update('type', 'LOOKING_FOR_MUSICIAN')}
                  />
                  Ищу музыканта
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>Иконка *</label>
              <AdIconPicker
                value={form.icon}
                onChange={(icon: AdIconId) => update('icon', icon)}
              />
            </div>

            {form.type === 'LOOKING_FOR_BAND' ? (
              <>
                <div className="form-group">
                  <label>Инструмент *</label>
                  <input required value={form.instrument} onChange={(e) => update('instrument', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>О себе *</label>
                  <textarea required rows={4} value={form.about} onChange={(e) => update('about', e.target.value)} />
                </div>
              </>
            ) : (
              <>
                <div className="form-group">
                  <label>Кого ищете *</label>
                  <input required value={form.lookingFor} onChange={(e) => update('lookingFor', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Описание проекта *</label>
                  <textarea required rows={4} value={form.description} onChange={(e) => update('description', e.target.value)} />
                </div>
              </>
            )}

            <div className="form-row">
              <div className="form-group">
                <label>Жанр *</label>
                <input required value={form.genre} onChange={(e) => update('genre', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Город *</label>
                <input required value={form.city} onChange={(e) => update('city', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label>Контакт</label>
              <input value={form.contact} onChange={(e) => update('contact', e.target.value)} placeholder="+7 ..." />
            </div>
            <div className="form-group">
              <label>Статус</label>
              <select value={form.status} onChange={(e) => update('status', e.target.value)}>
                <option value="active">Активно</option>
                <option value="draft">Черновик</option>
                <option value="archive">Архив</option>
              </select>
            </div>
            <div className="form-actions">
              <Link to="/dashboard?tab=ads" className="btn btn-ghost">Отмена</Link>
              <button type="submit" className="btn btn-primary">Сохранить</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
