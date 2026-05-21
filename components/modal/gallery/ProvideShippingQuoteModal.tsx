import { StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useState } from "react";
import CloseButton from "#components/buttons/CloseButton";
import { galleryOrderModalStore } from "#store/modal/galleryModalStore";
import LongBlackButton from "#components/buttons/LongBlackButton";
import Input from "#components/inputs/Input";
import LargeInput from "#components/inputs/LargeInput";
import { validate } from "#lib/validations/provideShippingQuoteValidations/validator";
import { updateShippingQuote } from "#services/orders/updateShippingQuote";
import { useQueryClient } from "@tanstack/react-query";
import { useAppStore } from "#store/app/appStore";
import CompletedModal from "./CompletedModal";
import { Analytics } from "#utils/analytics";
import UnitDropdownField from "#components/forms/UnitDropdownField";
import DimensionInput from "#components/forms/DimensionInput";
import { validateOrderMeasurement } from "#lib/validations/upload_artwork_input_validator/validateOrderMeasurement";
import { convertDimensionsToStandard } from "#utils/convertUnits";
import tw from "twrnc";

// Type definitions for required form fields
type RequiredFieldKey = "carrier" | "fees" | "taxes";
type ShippingQuoteFormErrorsType = Record<RequiredFieldKey, string> & {
  height: string;
  width: string;
  length: string;
  weight: string;
};

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
  {
    key: "fees",
    label: "Shipping fees ($)",
    placeholder: "",
    isHalfWidth: true,
  },
  {
    key: "taxes",
    label: "Taxes and other fees ($)",
    placeholder: "",
    isHalfWidth: true,
  },
];

const dimensionUnits = [
  { label: "centimeter (cm)", value: "cm" },
  { label: "meter (m)", value: "m" },
  { label: "inch (in)", value: "in" },
  { label: "feet (ft)", value: "ft" },
];

const weightUnits = [
  { label: "kilogram (kg)", value: "kg" },
  { label: "gram (g)", value: "g" },
  { label: "pound (lb)", value: "lb" },
];

export default function ProvideShippingQuoteModal() {
  const { clear, acceptForm, updateAcceptForm, currentId } =
    galleryOrderModalStore();
  const [isLoading, setIsLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const queryClient = useQueryClient();
  const userId = useAppStore((state) => state.userSession.id);

  const [formErrors, setFormErrors] = useState<ShippingQuoteFormErrorsType>({
    carrier: "",
    fees: "",
    taxes: "",
    height: "",
    width: "",
    length: "",
    weight: "",
  });

  const checkIsDisabled = () => {
    const requiredFieldValues = [
      acceptForm.carrier,
      acceptForm.fees,
      acceptForm.taxes,
      acceptForm.height,
      acceptForm.width,
      acceptForm.length,
      acceptForm.weight,
    ];
    const areAllFieldsFilled = requiredFieldValues.every(
      (value) => value !== "",
    );
    const isFormValid = Object.values(formErrors).every(
      (error) => error === "",
    );

    return !(isFormValid && areAllFieldsFilled);
  };

  const handleValidationChecks = (label: RequiredFieldKey, value: string) => {
    const { success, errors }: { success: boolean; errors: string[] | [] } =
      validate(label as string, value);
    if (!success) {
      setFormErrors((prev) => ({ ...prev, [label]: errors[0] }));
    } else {
      setFormErrors((prev) => ({ ...prev, [label]: "" }));
    }
  };

  const handleDimensionValidation = (
    label: "height" | "width" | "length" | "weight",
    value: string,
  ) => {
    if (value.trim() === "") {
      setFormErrors((prev) => ({ ...prev, [label]: "" }));
    } else {
      const errors = validateOrderMeasurement(value);
      setFormErrors((prev) => ({
        ...prev,
        [label]: errors.length === 0 ? "" : errors[0],
      }));
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    const units = {
      height: acceptForm.dimUnit,
      width: acceptForm.dimUnit,
      length: acceptForm.dimUnit,
      weight: acceptForm.weightUnit,
    };

    const numerical_dimensions = convertDimensionsToStandard(
      {
        height: acceptForm.height,
        width: acceptForm.width,
        length: acceptForm.length,
        weight: acceptForm.weight,
      },
      units,
    );

    let data = {
      package_carrier: acceptForm.carrier,
      specialInstructions: acceptForm.additional_info,
      fees: acceptForm.fees,
      taxes: acceptForm.taxes,
      dimensions: numerical_dimensions,
      exhibition_status: null, // As per current requirement, can be extended if needed
      hold_status: null,
    };

    const results = await updateShippingQuote({
      data: data,
      order_id: currentId,
    });

    if (results.isOk) {
      Analytics.track("order_accepted", {
        order_id: currentId,
        seller_id: userId,
        shipping_quote: data,
        response: results,
      });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["orders", userId] }),
        queryClient.invalidateQueries({ queryKey: ["orders", "gallery"] }),
        queryClient.invalidateQueries({ queryKey: ["orders", "artist"] }),
      ]);
      setCompleted(true);
    } else {
      Analytics.track("order_accept_failed", {
        order_id: currentId,
        seller_id: userId,
        shipping_quote: data,
        error: (results as any).error,
        message: results?.body?.message,
        response: results,
      });
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
                  handleBlur={() =>
                    handleValidationChecks(key, acceptForm[key])
                  }
                  errorMessage={formErrors[key]}
                />
              </View>
            ))}
          </View>
        )}
      </>
    );
  };

  const renderDimensionInputs = () => {
    return (
      <View style={tw`my-4 gap-4`}>
        <Text style={{ fontSize: 16 }}>Package Dimensions</Text>
        <View style={tw`flex-row gap-4 mb-2`}>
          <UnitDropdownField
            label="Dim. Unit"
            units={dimensionUnits}
            selectedUnit={acceptForm.dimUnit}
            onSelect={(unit) => updateAcceptForm("dimUnit", unit)}
          />
          <UnitDropdownField
            label="Weight Unit"
            units={weightUnits}
            selectedUnit={acceptForm.weightUnit}
            onSelect={(unit) => updateAcceptForm("weightUnit", unit)}
          />
        </View>

        {(["height", "width", "length"] as const).map((field) => (
          <DimensionInput
            key={field}
            field={field}
            unit={acceptForm.dimUnit}
            value={acceptForm[field]}
            errorMessage={formErrors[field]}
            onInputChange={(text) => updateAcceptForm(field, text)}
            onValidation={(text) => handleDimensionValidation(field, text)}
          />
        ))}

        <DimensionInput
          field="weight"
          unit={acceptForm.weightUnit}
          value={acceptForm.weight}
          errorMessage={formErrors.weight}
          onInputChange={(text) => updateAcceptForm("weight", text)}
          onValidation={(text) => handleDimensionValidation("weight", text)}
        />
      </View>
    );
  };

  return (
    <View style={tw`h-full`}>
      <View style={tw`flex-row items-center gap-2.5`}>
        <Text style={tw`text-lg flex-1`}>Provide shipping quote</Text>
        <CloseButton handlePress={clear} />
      </View>
      {completed ? (
        <CompletedModal placeholder="Shipping quote provided" />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View style={styles.formContainer}>
            {renderInputs()}

            {renderDimensionInputs()}

            <LargeInput
              label="Additional info (optional)"
              onInputChange={(value) =>
                updateAcceptForm("additional_info", value)
              }
              placeHolder=""
              value={acceptForm.additional_info}
            />
          </View>
        </ScrollView>
      )}
      <View style={tw`gap-5 mt-2.5 absolute w-full bg-white bottom-5`}>
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
