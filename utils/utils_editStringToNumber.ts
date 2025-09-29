export function extractNumberString(str: string) {
  if (!str) return ''; // handle empty or null input
  const cleaned = str.trim().replace(/[^\d.]/g, ''); // keep only digits and dot
  return cleaned;
}
