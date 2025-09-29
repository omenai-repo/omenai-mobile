export function formatEventDate(input: string): string {
  const date = new Date(input.replace(' ', 'T')); // Ensures it's parsed correctly
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short', // Mon
    day: '2-digit', // 28
    month: 'short', // Apr
    year: 'numeric', // 2025
    hour: '2-digit', // 12
    minute: '2-digit', // 16
    hour12: true, // AM/PM
  };
  return date.toLocaleString('en-US', options);
}
