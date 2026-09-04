import { validateDecimalPrice } from "#lib/validation/artwork/validateDecimalPrice";
import { validateBasicText } from "#lib/validation/artwork/validateText";


type ValidationFunction = (value: string) => string[];

export const validate = (label: string, value: string) => {

  const validationFunctions: Record<string, ValidationFunction> = {
    carrier: (value: string) => validateBasicText(value),
    taxes: (value: string) => validateDecimalPrice(value),
    fees: (value: string) => validateDecimalPrice(value),
  };

  

  const validationFunction = validationFunctions[label];

  let nameErrors = validationFunction(value);

  return {
    success: nameErrors.length === 0,
    errors: nameErrors,
  };
};
