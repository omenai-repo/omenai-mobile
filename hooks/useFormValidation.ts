import { useState, useCallback } from "react";
import { validate } from "lib/validations/validatorGroup";
import { debounce } from "lodash";

type FormErrors<T> = {
  [K in keyof T]?: string;
};

export function useFormValidation<T extends Record<string, any>>() {
  const [formErrors, setFormErrors] = useState<FormErrors<T>>({});

  const handleValidationChecks = useCallback(
    debounce((label: string, value: string, confirm?: string) => {
      if (value.trim() === "") {
        setFormErrors((prev) => ({ ...prev, [label]: "" }));
        return;
      }

      const { errors } = validate(value, label, confirm);
      setFormErrors((prev) => ({
        ...prev,
        [label]: errors.length > 0 ? errors[0] : "",
      }));
    }, 500),
    []
  );

  const checkIsFormValid = (requiredFields: Partial<T>) => {
    const isFormValid = Object.values(formErrors).every((error) => error === "");
    const areAllFieldsFilled = Object.values(requiredFields).every((value) => value !== "");
    return isFormValid && areAllFieldsFilled;
  };

  return {
    formErrors,
    handleValidationChecks,
    checkIsFormValid,
  };
}
