type Units = {
  height: 'cm' | 'm' | 'in' | 'ft';
  width: 'cm' | 'm' | 'in' | 'ft';
  length: 'cm' | 'm' | 'in' | 'ft';
  weight: 'kg' | 'g' | 'lb';
};

type RawValues = {
  height: string;
  width: string;
  length: string;
  weight: string;
};

export function convertToCm(value: string, unit: 'cm' | 'm' | 'in' | 'ft'): number {
  const num = parseFloat(value);
  if (isNaN(num)) return 0;

  switch (unit) {
    case 'cm':
      return num;
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

export const convertDimensionsToStandard = (values: RawValues, units: Units) => {
  return {
    height: convertToCm(values.height, units.height),
    width: convertToCm(values.width, units.width),
    length: convertToCm(values.length, units.length),
    weight: convertToKg(values.weight, units.weight),
  };
};
