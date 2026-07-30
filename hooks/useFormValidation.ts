import { useState, useMemo } from "react";
import { validate } from "#lib/validations/validatorGroup";

export function useFormValidation<T extends Record<string, string>>(
  values: T,
  confirmFields?: Partial<Record<keyof T, string>>,
) {
  const [touched, setTouched] = useState<Record<keyof T, boolean>>(
    Object.keys(values).reduce((acc, key) => {
      acc[key as keyof T] = false;
      return acc;
    }, {} as Record<keyof T, boolean>),
  );

  const handleBlur = (field: keyof T) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const formErrors = useMemo(() => {
    return Object.keys(values).reduce((acc, key) => {
      const field = key as keyof T;
      const value = values[field];
      const confirm = confirmFields ? confirmFields[field] : undefined;

      const { success, errors } = validate(value, String(field), confirm);
      acc[field] = success ? "" : errors[0];
      return acc;
    }, {} as Record<keyof T, string>);
  }, [values, confirmFields]);

  const checkIsDisabled = () => {
    const isFormValid = Object.values(formErrors).every(
      (error) => error === "",
    );
    const areAllFieldsFilled = Object.values(values).every((val) => val !== "");
    return !(isFormValid && areAllFieldsFilled);
  };

  return {
    formErrors,
    touched,
    handleBlur,
    checkIsDisabled,
    setTouched,
  };
}
