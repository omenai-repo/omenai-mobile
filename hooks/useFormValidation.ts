import { useState, useCallback } from "react";
import { validate } from "#lib/validations/validatorGroup";

export function useFormValidation<T extends Record<string, string>>(
  initialValues: T
) {
  const [formErrors, setFormErrors] = useState<Record<keyof T, string>>(
    Object.keys(initialValues).reduce((acc, key) => {
      acc[key as keyof T] = "";
      return acc;
    }, {} as Record<keyof T, string>)
  );

  const handleValidationChecks = useCallback(
    (label: keyof T, value: string, confirm?: string) => {
      const { success, errors } = validate(value, String(label), confirm);
      setFormErrors((prev) => ({
        ...prev,
        [label]: success ? "" : errors[0],
      }));
    },
    []
  );

  const checkIsDisabled = useCallback(
    (values: T) => {
      const isFormValid = Object.values(formErrors).every(
        (error) => error === ""
      );
      const areAllFieldsFilled = Object.values(values).every(
        (value) => value !== ""
      );
      return !(isFormValid && areAllFieldsFilled);
    },
    [formErrors]
  );

  return {
    formErrors,
    handleValidationChecks,
    checkIsDisabled,
    setFormErrors,
  };
}
