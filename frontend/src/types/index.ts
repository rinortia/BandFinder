export interface MusicianProfile {
  id: number
  userId?: number
  name: string
  age: number | null
  city: string
  instrument: string
  genres: string
  experience: string
  photo?: string | null
  demoUrl?: string | null
  description?: string | null
  contact?: string | null
  createdAt?: string
}

export interface Ad {
  id: number
  userId: number
  type: 'LOOKING_FOR_BAND' | 'LOOKING_FOR_MUSICIAN'
  icon: string
  city: string
  genre: string
  instrument?: string | null
  about?: string | null
  lookingFor?: string | null
  description?: string | null
  contact?: string | null
  status: 'active' | 'draft' | 'archive'
  createdAt: string
  updatedAt?: string
  user?: { id: number; name: string }
}

export interface User {
  id: number
  email: string
  name: string
  age: number | null
  role: string
  profile: MusicianProfile | null
}

export interface Favorite {
  id: number
  targetType: 'musician' | 'ad'
  targetId: number
  createdAt: string
  data?: MusicianProfile | Ad
}

export interface AuthResponse {
  token: string
  user: User
}
