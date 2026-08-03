
export const validateDecimalPrice = (value: string): string[] => {
  let errors = [];

  // Validate if the value contains only digits
  if (!/^\d+(\.\d+)?$/.test(value)) {
    errors.push("Invalid price format. Please enter numbers only.");
  }

  return errors;
};
