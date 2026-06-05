import { useEffect, useState } from 'react'
import './UserAvatar.css'

interface UserAvatarProps {
  name: string
  photo?: string | null
}

export default function UserAvatar({ name, photo }: UserAvatarProps) {
  const [broken, setBroken] = useState(false)

  useEffect(() => {
    setBroken(false)
  }, [photo])

  const initial = name?.[0]?.toUpperCase() || '?'
  const showPhoto = Boolean(photo) && !broken

  if (showPhoto && photo) {
    return (
      <img
        src={photo}
        alt={name}
        className="user-avatar user-avatar--photo"
        onError={() => setBroken(true)}
      />
    )
  }

  return <span className="user-avatar">{initial}</span>
}
