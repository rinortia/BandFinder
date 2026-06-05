export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  if (hours < 1) return 'только что'
  if (hours < 24) return `${hours} ч. назад`
  const days = Math.floor(hours / 24)
  if (days === 1) return '1 день назад'
  return `${days} дн. назад`
}

export function adTypeLabel(type: string): string {
  return type === 'LOOKING_FOR_BAND' ? 'Ищу группу' : 'Ищу музыканта'
}

export function adTitle(ad: {
  type: string
  instrument?: string | null
  lookingFor?: string | null
}): string {
  if (ad.type === 'LOOKING_FOR_BAND') {
    return 'Ищу группу'
  }

  const target = ad.lookingFor?.trim()
  if (!target) return 'Ищу музыканта'
  if (/^ищу\s/i.test(target)) {
    return target.charAt(0).toUpperCase() + target.slice(1)
  }
  return `Ищу ${target}`
}

export function adDescription(ad: {
  type: string
  about?: string | null
  description?: string | null
}): string {
  if (ad.type === 'LOOKING_FOR_BAND') {
    return ad.about?.trim() || ''
  }
  return ad.description?.trim() || ''
}

export function adShortText(ad: {
  type: string
  about?: string | null
  description?: string | null
  lookingFor?: string | null
  instrument?: string | null
}): string {
  const description = adDescription(ad)
  if (description) return description
  return adTitle(ad)
}

export function statusLabel(status: string): string {
  const map: Record<string, string> = {
    active: 'Активно',
    draft: 'Черновик',
    archive: 'Архив',
  }
  return map[status] || status
}

export function pluralAge(age: number): string {
  const mod10 = age % 10
  const mod100 = age % 100
  if (mod10 === 1 && mod100 !== 11) return `${age} год`
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return `${age} года`
  return `${age} лет`
}
