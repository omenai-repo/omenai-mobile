import { useState, useMemo } from "react";
import { validate } from "#lib/validations/validatorGroup";

type AddressData = Partial<AddressTypes & { phone: string }>;

export const useAddressForm = (addressData: AddressData) => {
  const allKeys: (keyof AddressData)[] = [
    "address_line",
    "city",
    "country",
    "state",
    "zip",
    "phone",
  ];

  const [touched, setTouched] = useState<Record<keyof AddressData, boolean>>(
    allKeys.reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {} as Record<keyof AddressData, boolean>),
  );

  const handleBlur = (field: keyof AddressData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const formErrors = useMemo(() => {
    return allKeys.reduce((acc, key) => {
      const value = addressData[key] || "";
      if (value.trim() === "") {
        acc[key] = "";
      } else {
        const validationLabel = key === "phone" ? "phone" : "general";
        const { errors } = validate(value, validationLabel);
        acc[key] = errors.length > 0 ? errors[0] : "";
      }
      return acc;
    }, {} as Partial<AddressData>);
  }, [addressData]);

  const checkIsFormValid = () => {
    const isFormValid = Object.values(formErrors).every(
      (error) => error === "",
    );
    const requiredKeys: (keyof AddressData)[] = [
      "address_line",
      "city",
      "country",
      "state",
      "zip",
    ];
    let allRequiredFilled = requiredKeys.every(
      (k) => addressData[k] && addressData[k]?.trim() !== "",
    );

    if (addressData.phone !== undefined) {
      allRequiredFilled = allRequiredFilled && addressData.phone.trim() !== "";
    }

    return isFormValid && allRequiredFilled;
  };

  return {
    formErrors,
    touched,
    handleBlur,
    checkIsFormValid,
  };
};
