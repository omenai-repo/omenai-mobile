import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import CloseButton from "components/buttons/CloseButton";
import { galleryOrderModalStore } from "store/modal/galleryModalStore";
import LongBlackButton from "components/buttons/LongBlackButton";
import Input from "components/inputs/Input";
import LargeInput from "components/inputs/LargeInput";
import { validate } from "lib/validations/provideShippingQuoteValidations/validator";
import { updateShippingQuote } from "services/orders/updateShippingQuote";
import { useQueryClient } from "@tanstack/react-query";
import { useAppStore } from "store/app/appStore";
import CompletedModal from "./CompletedModal";

// Type definitions for required form fields
type RequiredFieldKey = "carrier" | "fees" | "taxes";
type ShippingQuoteFormErrorsType = Record<RequiredFieldKey, string>;

// Configuration for the required fields, removing repetition from JSX
const REQUIRED_FIELDS: {
  key: RequiredFieldKey;
  label: string;
  placeholder: string;
  isHalfWidth: boolean;
}[] = [
  {
    key: "carrier",
    label: "Package carrier",
    placeholder: "e.g DHL, UPS, USPS e.t.c",
    isHalfWidth: false,
  },
  { key: "fees", label: "Shipping fees ($)", placeholder: "", isHalfWidth: true },
  { key: "taxes", label: "Taxes and other fees ($)", placeholder: "", isHalfWidth: true },
];

export default function ProvideShippingQuoteModal() {
  const { clear, acceptForm, updateAcceptForm, currentId } = galleryOrderModalStore();
  const [isLoading, setIsLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const queryClient = useQueryClient();
  const userId = useAppStore((state) => state.userSession.id);

  const [formErrors, setFormErrors] = useState<ShippingQuoteFormErrorsType>({
    carrier: "",
    fees: "",
    taxes: "",
  });

  const checkIsDisabled = () => {
    const requiredFieldValues = [acceptForm.carrier, acceptForm.fees, acceptForm.taxes];
    const areAllFieldsFilled = requiredFieldValues.every((value) => value !== "");
    const isFormValid = Object.values(formErrors).every((error) => error === "");

    return !(isFormValid && areAllFieldsFilled);
  };

  const handleValidationChecks = (label: RequiredFieldKey, value: string) => {
    const { success, errors }: { success: boolean; errors: string[] | [] } = validate(
      label as string,
      value
    );
    if (!success) {
      setFormErrors((prev) => ({ ...prev, [label]: errors[0] }));
    } else {
      setFormErrors((prev) => ({ ...prev, [label]: "" }));
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    let data = {
      package_carrier: acceptForm.carrier,
      additional_information: acceptForm.additional_info,
      fees: acceptForm.fees,
      taxes: acceptForm.taxes,
    };

    const results = await updateShippingQuote({
      data: data,
      order_id: currentId,
    });

    if (results.isOk) {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["orders", userId] }),
        queryClient.invalidateQueries({ queryKey: ["orders", "gallery"] }),
      ]);
      setCompleted(true);
      console.log(results);
    } else {
      console.log(results);
    }

    setIsLoading(false);
  };

  const renderInputs = () => {
    const fullWidthFields = REQUIRED_FIELDS.filter((f) => !f.isHalfWidth);
    const halfWidthFields = REQUIRED_FIELDS.filter((f) => f.isHalfWidth);

    return (
      <>
        {fullWidthFields.map(({ key, label, placeholder }) => (
          <Input
            key={key}
            value={acceptForm[key]}
            label={label}
            onInputChange={(value) => updateAcceptForm(key, value)}
            placeHolder={placeholder}
            handleBlur={() => handleValidationChecks(key, acceptForm[key])}
            errorMessage={formErrors[key]}
          />
        ))}

        {halfWidthFields.length > 0 && (
          <View style={{ flexDirection: "row", gap: 20 }}>
            {halfWidthFields.map(({ key, label, placeholder }) => (
              <View key={key} style={{ flex: 1 }}>
                <Input
                  value={acceptForm[key]}
                  label={label}
                  onInputChange={(value) => updateAcceptForm(key, value)}
                  placeHolder={placeholder}
                  handleBlur={() => handleValidationChecks(key, acceptForm[key])}
                  errorMessage={formErrors[key]}
                />
              </View>
            ))}
          </View>
        )}
      </>
    );
  };

  return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={{ fontSize: 16, flex: 1 }}>Provide shipping quote</Text>
        <CloseButton handlePress={clear} />
      </View>
      {completed ? (
        <CompletedModal placeholder="Shipping quote provided" />
      ) : (
        <View style={styles.formContainer}>
          {renderInputs()}

          <LargeInput
            label="Additional info (optional)"
            onInputChange={(value) => updateAcceptForm("additional_info", value)}
            placeHolder=""
            value={acceptForm.additional_info}
          />
        </View>
      )}
      <View style={{ gap: 20, marginTop: 30 }}>
        {completed ? (
          <LongBlackButton value="Dismiss" onClick={clear} />
        ) : (
          <LongBlackButton
            onClick={handleSubmit}
            value={isLoading ? "Loading..." : "Accept order"}
            isDisabled={checkIsDisabled()}
            isLoading={isLoading}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    gap: 15,
    marginTop: 20,
  },
});
