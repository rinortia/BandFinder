const KEYS = {
  token: 'bandfinder_token',
  user: 'bandfinder_user',
  role: 'bandfinder_role',
  musicianFilters: 'bandfinder_musician_filters',
  adFilters: 'bandfinder_ad_filters',
  adDraft: 'bandfinder_ad_draft',
} as const

export function saveAuth(token: string, user: { id: number; name: string; role: string }) {
  localStorage.setItem(KEYS.token, token)
  localStorage.setItem(KEYS.user, JSON.stringify(user))
  localStorage.setItem(KEYS.role, user.role)
}

export function clearAuth() {
  localStorage.removeItem(KEYS.token)
  localStorage.removeItem(KEYS.user)
  localStorage.removeItem(KEYS.role)
}

export function getStoredUser(): { id: number; name: string; role: string } | null {
  const raw = localStorage.getItem(KEYS.user)
  return raw ? JSON.parse(raw) : null
}

export function getStoredRole(): string | null {
  return localStorage.getItem(KEYS.role)
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem(KEYS.token)
}

export function saveFilters(key: 'musician' | 'ad', filters: Record<string, string>) {
  const storageKey = key === 'musician' ? KEYS.musicianFilters : KEYS.adFilters
  localStorage.setItem(storageKey, JSON.stringify(filters))
}

export function loadFilters(key: 'musician' | 'ad'): Record<string, string> {
  const storageKey = key === 'musician' ? KEYS.musicianFilters : KEYS.adFilters
  const raw = localStorage.getItem(storageKey)
  return raw ? JSON.parse(raw) : {}
}

export function saveAdDraft(draft: Record<string, unknown>) {
  localStorage.setItem(KEYS.adDraft, JSON.stringify(draft))
}

export function loadAdDraft(): Record<string, unknown> | null {
  const raw = localStorage.getItem(KEYS.adDraft)
  return raw ? JSON.parse(raw) : null
}

export function clearAdDraft() {
  localStorage.removeItem(KEYS.adDraft)
}
