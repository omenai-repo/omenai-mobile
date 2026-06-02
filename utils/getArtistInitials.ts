export function getArtistInitials(name: string): string {
  const trimmed = name?.trim() ?? "";
  if (!trimmed) return "";

  const names = trimmed.split(/\s+/).filter(Boolean);
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
}
