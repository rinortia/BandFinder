export const AD_ICON_KEYS = [
  'microphone',
  'drums',
  'guitar',
  'piano',
  'bass',
  'group',
] as const;

export type AdIconKey = (typeof AD_ICON_KEYS)[number];
