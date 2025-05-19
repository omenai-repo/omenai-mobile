export function convertToCm(value: string, unit: 'cm' | 'mm' | 'm' | 'in' | 'ft'): number {
  const num = parseFloat(value);
  if (isNaN(num)) return 0;

  switch (unit) {
    case 'cm':
      return num;
    case 'mm':
      return num / 10;
    case 'm':
      return num * 100;
    case 'in':
      return num * 2.54;
    case 'ft':
      return num * 30.48;
    default:
      return num;
  }
}

export function convertToKg(value: string, unit: 'kg' | 'g' | 'lb'): number {
  const num = parseFloat(value);
  if (isNaN(num)) return 0;

  switch (unit) {
    case 'kg':
      return num;
    case 'g':
      return num / 1000;
    case 'lb':
      return num * 0.453592;
    default:
      return num;
  }
}
