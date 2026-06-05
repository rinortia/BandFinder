import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { api } from '../api/client'
import type { User } from '../types'
import { clearAuth, isAuthenticated, saveAuth } from '../utils/storage'

interface AuthContextValue {
  user: User | null
  loading: boolean
  isLoggedIn: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: Record<string, unknown>, photoFile?: File) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    if (!isAuthenticated()) {
      setUser(null)
      return
    }
    try {
      const me = await api.auth.me()
      setUser(me)
      saveAuth(localStorage.getItem('bandfinder_token')!, {
        id: me.id,
        name: me.name,
        role: me.role,
      })
    } catch {
      clearAuth()
      setUser(null)
    }
  }, [])

  useEffect(() => {
    refreshUser().finally(() => setLoading(false))
  }, [refreshUser])

  const login = async (email: string, password: string) => {
    const res = await api.auth.login({ email, password })
    saveAuth(res.token, { id: res.user.id, name: res.user.name, role: res.user.role })
    setUser(res.user)
  }

  const register = async (data: Record<string, unknown>, photoFile?: File) => {
    const { photo: _photo, ...rest } = data
    const res = await api.auth.register(rest)
    saveAuth(res.token, { id: res.user.id, name: res.user.name, role: res.user.role })
    if (photoFile) {
      await api.profiles.uploadPhoto(photoFile)
      const me = await api.auth.me()
      setUser(me)
      return
    }
    setUser(res.user)
  }

  const logout = () => {
    clearAuth()
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      isLoggedIn: !!user,
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, loading, refreshUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function useGuestOrMusician() {
  const { isLoggedIn } = useAuth()
  return isLoggedIn ? 'musician' : 'guest'
}
