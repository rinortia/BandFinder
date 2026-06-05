export function normalizeSearchText(value: string): string {
  return value.trim().toLocaleLowerCase('ru-RU');
}

export function profileSearchFields(data: {
  city?: string;
  instrument?: string;
  genres?: string;
}) {
  return {
    ...(data.city !== undefined && { citySearch: normalizeSearchText(data.city) }),
    ...(data.instrument !== undefined && {
      instrumentSearch: normalizeSearchText(data.instrument),
    }),
    ...(data.genres !== undefined && { genresSearch: normalizeSearchText(data.genres) }),
  };
}

export function adSearchFields(data: { city?: string; genre?: string }) {
  return {
    ...(data.city !== undefined && { citySearch: normalizeSearchText(data.city) }),
    ...(data.genre !== undefined && { genreSearch: normalizeSearchText(data.genre) }),
  };
}
