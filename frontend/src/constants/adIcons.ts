export const AD_ICONS = [
  { id: 'microphone', label: 'Микрофон' },
  { id: 'drums', label: 'Барабаны' },
  { id: 'guitar', label: 'Гитара' },
  { id: 'piano', label: 'Фортепиано' },
  { id: 'bass', label: 'Бас' },
  { id: 'group', label: 'Группа' },
] as const

export type AdIconId = (typeof AD_ICONS)[number]['id']

export const AD_ICON_IDS = AD_ICONS.map((icon) => icon.id)

export function isAdIconId(value: string): value is AdIconId {
  return AD_ICON_IDS.includes(value as AdIconId)
}

export function getAdIconLabel(id: string): string {
  return AD_ICONS.find((icon) => icon.id === id)?.label ?? 'Иконка'
}
