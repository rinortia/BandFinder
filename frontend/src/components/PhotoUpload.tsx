import { useRef, useState } from 'react'
import { resolvePhotoUrl } from '../utils/photo'
import './PhotoUpload.css'

interface PhotoUploadProps {
  value?: string | null
  onChange?: (url: string) => void
  onUpload?: (file: File) => Promise<string>
  onFileSelect?: (file: File | null) => void
  mode?: 'upload' | 'pick'
  label?: string
}

export default function PhotoUpload({
  value,
  onChange,
  onUpload,
  onFileSelect,
  mode = 'upload',
  label = 'Фото',
}: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [localPreview, setLocalPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const displayUrl = localPreview || resolvePhotoUrl(value)

  const handleFile = async (file: File) => {
    setError('')
    const objectUrl = URL.createObjectURL(file)
    setLocalPreview(objectUrl)

    if (mode === 'pick') {
      onFileSelect?.(file)
      return
    }

    if (!onUpload || !onChange) return

    setUploading(true)
    try {
      const url = await onUpload(file)
      onChange(url)
    } catch (err) {
      setLocalPreview(null)
      onFileSelect?.(null)
      setError(err instanceof Error ? err.message : 'Не удалось загрузить фото')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="photo-upload">
      <label className="photo-upload-label">{label}</label>
      <div className="photo-upload-body">
        <img src={displayUrl} alt="Фото профиля" className="photo-upload-preview" />
        <div className="photo-upload-actions">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="photo-upload-input"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFile(file)
              e.target.value = ''
            }}
          />
          <button
            type="button"
            className="btn btn-outline btn-sm"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? 'Загрузка...' : 'Выбрать файл'}
          </button>
          <span className="photo-upload-hint">JPG, PNG, WEBP, GIF до 5 МБ</span>
        </div>
      </div>
      {error && <span className="form-error">{error}</span>}
    </div>
  )
}
