import { validate } from 'lib/validations/validatorGroup';
import { useState, useEffect } from 'react';
interface ValidationResult {
  success: boolean;
  errors: string[] | [];
}
interface FormErrors {
  [key: string]: string | undefined;
}
const useValidation = (initialFormErrors: FormErrors) => {
  const [formErrors, setFormErrors] = useState<FormErrors>(initialFormErrors);
  const handleValidationChecks = (label: string, value: string) => {
    const { success, errors } = validate(label, value);
    setFormErrors((prev) => ({
      ...prev,
      [label]: !success ? errors[0] : '',
    }));
  };
  return { formErrors, handleValidationChecks };
};
export default useValidation;