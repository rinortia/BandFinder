export const DEFAULT_PHOTO =
  'https://images.unsplash.com/photo-1511379938546-c1f69419868d?w=400'

export function resolvePhotoUrl(photo?: string | null): string {
  if (!photo) return DEFAULT_PHOTO
  if (photo.startsWith('http')) return photo
  return photo
}
