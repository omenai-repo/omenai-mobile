export const convertToStandardDimension = (
  value: string,
  unit: "in" | "cm" | "lb" | "kg",
): string => {
  if (!value || value.trim() === "") return "";

  const numValue = parseFloat(value);
  if (isNaN(numValue)) return "";

  if (unit === "in") return `${value}in`;
  if (unit === "lb") return `${value}lb`;

  if (unit === "cm") {
    const inches = numValue / 2.54;
    return `${parseFloat(inches.toFixed(2))}in`;
  }

  if (unit === "kg") {
    const lbs = numValue * 2.20462;
    return `${parseFloat(lbs.toFixed(2))}lb`;
  }

  return "";
};
