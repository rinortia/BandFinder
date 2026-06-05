import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PhotoUpload from '../components/PhotoUpload'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    city: '',
    instrument: '',
    genres: '',
    experience: '',
    demoUrl: '',
    description: '',
    contact: '',
  })

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await register(
        {
          ...form,
          age: parseInt(form.age, 10),
        },
        photoFile ?? undefined,
      )
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка регистрации')
    }
  }

  return (
    <div className="page">
      <div className="container auth-container auth-container--wide">
        <div className="card auth-card">
          <h1>Регистрация</h1>
          <p className="auth-subtitle">Создайте анкету музыканта</p>
          {error && <div className="form-alert">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Имя *</label>
                <input required value={form.name} onChange={(e) => update('name', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Пароль *</label>
                <input type="password" required minLength={6} value={form.password} onChange={(e) => update('password', e.target.value)} />
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
                <input value={form.genres} onChange={(e) => update('genres', e.target.value)} placeholder="Рок, Jazz..." />
              </div>
              <div className="form-group">
                <label>Опыт *</label>
                <input required value={form.experience} onChange={(e) => update('experience', e.target.value)} placeholder="3 года" />
              </div>
            </div>
            <PhotoUpload mode="pick" onFileSelect={setPhotoFile} />
            <div className="form-group">
              <label>Демо (URL аудио/видео)</label>
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
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Зарегистрироваться
            </button>
          </form>
          <p className="auth-switch">
            Уже есть аккаунт? <Link to="/login">Войти</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
