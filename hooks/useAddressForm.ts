import { useState } from "react";
import { debounce } from "lodash";
import { validate } from "#lib/validations/validatorGroup";

export const useAddressForm = () => {
  const [formErrors, setFormErrors] = useState<Partial<AddressTypes>>({
    address_line: "",
    city: "",
    country: "",
    state: "",
    zip: "",
    countryCode: "",
  });

  const handleValidationChecks = debounce(
    (label: string, value: string, confirm?: string) => {
      if (value.trim() === "") {
        setFormErrors((prev) => ({ ...prev, [label]: "" }));
        return;
      }

      const { errors } = validate(value, label, confirm);
      setFormErrors((prev) => ({
        ...prev,
        [label]: errors.length > 0 ? errors[0] : "",
      }));
    },
    500,
  );

  const checkIsFormValid = (addressData: {
    address_line?: string;
    city?: string;
    zip?: string;
    country?: string;
    state?: string;
  }) => {
    const isFormValid = Object.values(formErrors).every(
      (error) => error === "",
    );
    const areAllFieldsFilled = Object.values({
      address_line: addressData?.address_line,
      city: addressData?.city,
      zip: addressData?.zip,
      country: addressData?.country,
      state: addressData?.state,
    }).every((value) => value !== "");

    return isFormValid && areAllFieldsFilled;
  };

  return {
    formErrors,
    handleValidationChecks,
    checkIsFormValid,
  };
};
