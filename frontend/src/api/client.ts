const API_BASE = '/api'

function getToken(): string | null {
  return localStorage.getItem('bandfinder_token')
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  }

  const isFormData = options.body instanceof FormData
  if (!isFormData) {
    headers['Content-Type'] = 'application/json'
  }
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const message = Array.isArray(data.message)
      ? data.message.join(', ')
      : data.message || 'Ошибка запроса'
    throw new Error(message)
  }

  return data as T
}

export const api = {
  auth: {
    register: (body: Record<string, unknown>) =>
      request<import('../types').AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    login: (body: { email: string; password: string }) =>
      request<import('../types').AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    me: () => request<import('../types').User>('/auth/me'),
  },
  profiles: {
    list: (params: Record<string, string>) => {
      const query = new URLSearchParams(params).toString()
      return request<import('../types').MusicianProfile[]>(`/profiles?${query}`)
    },
    get: (id: number) => request<import('../types').MusicianProfile>(`/profiles/${id}`),
    updateMe: (body: Record<string, unknown>) =>
      request<import('../types').MusicianProfile>('/profiles/me', {
        method: 'PATCH',
        body: JSON.stringify(body),
      }),
    uploadPhoto: (file: File) => {
      const formData = new FormData()
      formData.append('photo', file)
      return request<import('../types').MusicianProfile>('/profiles/me/photo', {
        method: 'POST',
        body: formData,
      })
    },
  },
  ads: {
    list: (params: Record<string, string>) => {
      const query = new URLSearchParams(params).toString()
      return request<import('../types').Ad[]>(`/ads?${query}`)
    },
    get: (id: number) => request<import('../types').Ad>(`/ads/${id}`),
    create: (body: Record<string, unknown>) =>
      request<import('../types').Ad>('/ads', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: number, body: Record<string, unknown>) =>
      request<import('../types').Ad>(`/ads/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      }),
    remove: (id: number) => request<{ message: string }>(`/ads/${id}`, { method: 'DELETE' }),
  },
  favorites: {
    list: () => request<import('../types').Favorite[]>('/favorites'),
    add: (body: { targetType: string; targetId: number }) =>
      request<import('../types').Favorite>('/favorites', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    remove: (id: number) =>
      request<{ message: string }>(`/favorites/${id}`, { method: 'DELETE' }),
    removeByTarget: (targetType: string, targetId: number) =>
      request<{ message: string }>(
        `/favorites/target/remove?targetType=${targetType}&targetId=${targetId}`,
        { method: 'DELETE' },
      ),
  },
}
