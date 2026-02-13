import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
  Text,
} from "react-native";
import React, { useState } from "react";
import tw from "twrnc";
import { colors } from "#config/colors.config";
import { Ionicons } from "@expo/vector-icons";
import BackHeaderTitle from "#components/header/BackHeaderTitle";
import LongBlackButton from "#components/buttons/LongBlackButton";
import { updateShippingQuote } from "#services/orders/updateShippingQuote";
import { useQueryClient } from "@tanstack/react-query";
import { useModalStore } from "#store/modal/modalStore";
import { useNavigation, useRoute } from "@react-navigation/native";
import WithModal from "#components/modal/WithModal";
import { validateOrderMeasurement } from "#lib/validations/upload_artwork_input_validator/validateOrderMeasurement";
import { useAppStore } from "#store/app/appStore";
import { format } from "date-fns";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ToggleButton from "#components/forms/ToggleButton";
import DimensionInput from "#components/forms/DimensionInput";
import AlertCard from "#components/general/AlertCard";
import { Analytics } from "#utils/analytics";
import PackagingSelector from "#components/packaging/PackagingSelector";
import { PackagingType } from "#constants/packaging_data";

type ArtworkDimensionsErrorsType = {
  height: string;
  length: string;
  width: string;
  weight: string;
};

const DimensionsDetails = () => {
  const { userType } = useAppStore();
  const { orderId, artworkDimensions, exclusivityType } =
    useRoute<any>().params;
  const navigation = useNavigation();

  // Packaging type state - default to rolled for better shipping rates
  const [packagingType, setPackagingType] = useState<PackagingType>("rolled");
  const [usePreset, setUsePreset] = useState(true);

  const [dimensions, setDimensions] = useState({
    length: "",
    width: "",
    height: "",
    weight: "",
  });

  const [formErrors, setFormErrors] = useState<ArtworkDimensionsErrorsType>({
    height: "",
    length: "",
    width: "",
    weight: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isOnExhibition, setIsOnExhibition] = useState(false);
  const [expoEndDate, setExpoEndDate] = useState<Date | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const { updateModal } = useModalStore();
  const queryClient = useQueryClient();
  const userId = useAppStore((state) => state.userSession.id);

  // Helper to safely parse dimension strings (e.g. "32in" -> 32)
  const parseDim = (val: string | number | undefined) => {
    if (!val) return 0;
    const str = String(val);
    // Remove everything that is NOT a digit or a decimal point
    const cleanStr = str.replaceAll(/[^\d.]/g, "");
    return Number(cleanStr) || 0;
  };

  // Parse artwork dimensions from order (default to 24x24 if not provided)
  const artDims = {
    length: parseDim(artworkDimensions?.length) || 24,
    height: parseDim(artworkDimensions?.height) || 24,
  };

  const showDatePicker = () => setIsDatePickerVisible(true);
  const hideDatePicker = () => setIsDatePickerVisible(false);

  const handleConfirm = (date: Date) => {
    setExpoEndDate(date);
    hideDatePicker();
  };

  const handlePresetSelect = (details: {
    length: string;
    width: string;
    height: string;
    weight: string;
  }) => {
    if (details.length) {
      setUsePreset(true);
      setDimensions(details);
      // Clear errors since preset values are valid
      setFormErrors({ height: "", length: "", width: "", weight: "" });
    } else {
      // Custom mode - clear dimensions
      setUsePreset(false);
      setDimensions({ length: "", width: "", height: "", weight: "" });
    }
  };

  const checkIsDisabled = () => {
    const isFormValid = Object.values(formErrors).every(
      (error) => error === "",
    );
    const areAllFieldsFilled = Object.values({
      weight: dimensions.weight,
      height: dimensions.height,
      width: dimensions.width,
      length: dimensions.length,
    }).every((value) => value !== "");

    const isExhibitionValid = isOnExhibition ? !!expoEndDate : true;

    return !(
      isFormValid &&
      areAllFieldsFilled &&
      isChecked &&
      isExhibitionValid
    );
  };

  const handleValidationChecks = (
    label: keyof ArtworkDimensionsErrorsType,
    value: string,
  ) => {
    if (value.trim() === "") {
      setFormErrors((prev) => ({ ...prev, [label]: "" }));
    } else {
      const errors = validateOrderMeasurement(value);
      setFormErrors((prev) => ({
        ...prev,
        [label]: errors.length === 0 ? "" : errors,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      // Convert inches to cm for API (preset values are already in cm)
      const IN_TO_CM = 2.54;
      const dimLength = usePreset
        ? Number.parseFloat(dimensions.length)
        : Number.parseFloat(dimensions.length) * IN_TO_CM;
      const dimWidth = usePreset
        ? Number.parseFloat(dimensions.width)
        : Number.parseFloat(dimensions.width) * IN_TO_CM;
      const dimHeight = usePreset
        ? Number.parseFloat(dimensions.height)
        : Number.parseFloat(dimensions.height) * IN_TO_CM;

      const payload = {
        order_id: orderId,
        data: {
          dimensions: {
            length: dimLength || 0,
            width: dimWidth || 0,
            height: dimHeight || 0,
            weight: Number.parseFloat(dimensions.weight) || 0,
          },
          packaging_type: packagingType,
          exhibition_status:
            userType === "gallery"
              ? {
                  is_on_exhibition: isOnExhibition,
                  exhibition_end_date: expoEndDate || "",
                }
              : null,
          hold_status: null,
        },
      };

      console.log("Payload:", JSON.stringify(payload, null, 2));
      const response = await updateShippingQuote(payload);
      console.log("Response:", JSON.stringify(response, null, 2));

      if (response.isOk) {
        Analytics.track("order_accepted", {
          ids: { order_id: orderId, seller_id: userId },
          seller_type: userType,
          packaging_type: packagingType,
          payload,
          response,
        });

        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["orders", userId] }),
          queryClient.invalidateQueries({ queryKey: ["orders", "gallery"] }),
          queryClient.invalidateQueries({ queryKey: ["orders", "artist"] }),
        ]);

        updateModal({
          message: "Order accepted successfully",
          modalType: "success",
          showModal: true,
          onDismiss: () => {
            setDimensions({ length: "", width: "", height: "", weight: "" });
            navigation.goBack();
          },
        });
      } else {
        Analytics.track("order_accept_failed", {
          ids: { order_id: orderId, seller_id: userId },
          seller_type: userType,
          error_message: response.message,
          payload,
          response,
        });
        updateModal({
          message: response.message,
          modalType: "error",
          showModal: true,
        });
      }
    } catch (error: any) {
      console.log("Error:", error);
      updateModal({
        message: error.message,
        modalType: "error",
        showModal: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WithModal>
      <View style={tw`flex-1 bg-[#F7F7F7]`}>
        <BackHeaderTitle title="Packaging Dimensions" />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={tw`flex-1`}
        >
          <ScrollView
            nestedScrollEnabled={true}
            style={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={tw`mt-[20px] mx-[20px]`}>
              {/* Packaging Selector with Presets */}
              {userType === "artist" &&
                (exclusivityType === "non-exclusive" || !exclusivityType) && (
                  <View
                    style={tw`mb-5 flex-row bg-amber-50 border border-amber-100 rounded-lg p-3`}
                  >
                    <Ionicons
                      name="warning"
                      size={16}
                      color="#D97706"
                      style={tw`mt-0.5 mr-2`}
                    />
                    <View style={tw`flex-1`}>
                      <Text style={tw`text-sm font-semibold text-gray-900`}>
                        Exclusivity Check
                      </Text>
                      <Text style={tw`text-xs text-gray-600 mt-1 leading-5`}>
                        Note: This artwork is non-exclusive. Please ensure it
                        has not been sold elsewhere before proceeding.
                      </Text>
                    </View>
                  </View>
                )}

              <PackagingSelector
                artDimensions={artDims}
                packagingType={packagingType}
                onTypeChange={setPackagingType}
                onSelect={handlePresetSelect}
              />

              {/* Custom Dimension Inputs (shown when custom selected) */}
              {!usePreset && (
                <View style={tw`gap-3 mt-4`}>
                  <Text style={tw`text-sm font-medium text-gray-700 mb-2`}>
                    Enter Custom Dimensions (inches / kg)
                  </Text>
                  {(["length", "width", "height"] as const).map((field) => (
                    <DimensionInput
                      key={field}
                      field={field}
                      unit="in"
                      value={dimensions[field]}
                      errorMessage={formErrors[field]}
                      onInputChange={(text) =>
                        setDimensions((prev) => ({ ...prev, [field]: text }))
                      }
                      onValidation={(text) =>
                        handleValidationChecks(field, text)
                      }
                    />
                  ))}
                  <DimensionInput
                    field="weight"
                    unit="kg"
                    value={dimensions.weight}
                    errorMessage={formErrors.weight}
                    onInputChange={(text) =>
                      setDimensions((prev) => ({ ...prev, weight: text }))
                    }
                    onValidation={(text) =>
                      handleValidationChecks("weight", text)
                    }
                  />
                </View>
              )}

              {/* Selected Dimensions Summary */}
              {usePreset && dimensions.length && (
                <View
                  style={tw`bg-white border border-gray-200 rounded-xl p-4 mt-2`}
                >
                  <Text
                    style={tw`text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4`}
                  >
                    Selected Package Details
                  </Text>
                  <View style={tw`flex-row justify-between`}>
                    <View style={tw`flex-1 mr-4`}>
                      <Text style={tw`text-[10px] text-gray-400 mb-1`}>
                        DIMENSIONS
                      </Text>
                      <Text style={tw`text-sm font-medium text-gray-900`}>
                        {dimensions.length} × {dimensions.width} ×{" "}
                        {dimensions.height} cm
                      </Text>
                      <Text style={tw`text-xs text-gray-500 mt-0.5`}>
                        {(Number(dimensions.length) / 2.54).toFixed(1)} ×{" "}
                        {(Number(dimensions.width) / 2.54).toFixed(1)} ×{" "}
                        {(Number(dimensions.height) / 2.54).toFixed(1)} in
                      </Text>
                    </View>
                    <View style={tw`items-end`}>
                      <Text style={tw`text-[10px] text-gray-400 mb-1`}>
                        WEIGHT
                      </Text>
                      <Text style={tw`text-sm font-medium text-gray-900`}>
                        {dimensions.weight} kg
                      </Text>
                      <Text style={tw`text-xs text-gray-500 mt-0.5`}>
                        {(Number(dimensions.weight) * 2.20462).toFixed(1)} lbs
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>

            {/* Exhibition Options (Gallery Only) */}
            {userType === "gallery" && (
              <View style={tw`mt-5 mx-[20px]`}>
                <Text style={tw`text-sm text-gray-600 mb-3`}>
                  Is artwork on exhibition?
                </Text>
                <View style={tw`flex-row gap-4`}>
                  <View style={tw`flex-1`}>
                    <ToggleButton
                      label="Yes"
                      isSelected={isOnExhibition}
                      onPress={() => setIsOnExhibition(true)}
                    />
                  </View>
                  <View style={tw`flex-1`}>
                    <ToggleButton
                      label="No"
                      isSelected={!isOnExhibition}
                      onPress={() => {
                        setIsOnExhibition(false);
                        setExpoEndDate(null);
                      }}
                    />
                  </View>
                </View>

                {isOnExhibition && (
                  <View style={tw`mt-4`}>
                    <View
                      style={tw`mb-3 flex-row bg-blue-50 border border-blue-100 rounded-lg p-3`}
                    >
                      <Ionicons
                        name="information-circle"
                        size={18}
                        color="#2563EB"
                        style={tw`mt-0.5 mr-2`}
                      />
                      <View style={tw`flex-1`}>
                        <Text style={tw`text-sm font-semibold text-blue-700`}>
                          Automated Logistics
                        </Text>
                        <Text style={tw`text-xs text-blue-700 mt-1 leading-5`}>
                          Select when the exhibition ends. A shipment request
                          will be automatically triggered on this specific date
                          and time.
                        </Text>
                      </View>
                    </View>

                    <Text style={tw`text-sm text-gray-600 mb-3`}>
                      when does the exhibition end?
                    </Text>
                    <Pressable
                      onPress={showDatePicker}
                      style={tw`bg-white border border-gray-200 rounded-lg px-4 py-3`}
                    >
                      <Text style={tw`text-gray-900`}>
                        {expoEndDate
                          ? format(expoEndDate, "MMM dd, yyyy - hh:mm a")
                          : "Select date and time"}
                      </Text>
                    </Pressable>
                    <DateTimePickerModal
                      isVisible={isDatePickerVisible}
                      mode="datetime"
                      onConfirm={handleConfirm}
                      onCancel={hideDatePicker}
                      minimumDate={new Date()}
                      display={Platform.OS === "ios" ? "inline" : "default"}
                    />
                  </View>
                )}
              </View>
            )}

            {/* Agreement Section */}
            <View style={tw`mt-6 mx-5`}>
              {userType === "gallery" ? (
                <>
                  <AlertCard
                    title="Please review carefully"
                    description="By accepting this order, you agree to hold the artwork for 24 hours to allow for payment and shipment processing. If the piece is on exhibition and paid for by this buyer, shipment will be scheduled at the exhibition's end date"
                  />

                  <Pressable
                    onPress={() => setIsChecked(!isChecked)}
                    style={tw`mt-4 flex-row items-center gap-3`}
                  >
                    <View
                      style={tw`w-5 h-5 rounded-full border-2 border-gray-400 items-center justify-center`}
                    >
                      {isChecked && (
                        <View
                          style={[
                            tw`w-3 h-3 rounded-full`,
                            { backgroundColor: colors.primary_black },
                          ]}
                        />
                      )}
                    </View>
                    <Text style={tw`text-sm text-gray-600 font-medium`}>
                      I agree and continue
                    </Text>
                  </Pressable>
                </>
              ) : (
                <Pressable
                  onPress={() => setIsChecked(!isChecked)}
                  style={tw`bg-white border border-gray-200 rounded-lg p-4 flex-row gap-3 shadow-sm`}
                >
                  <View style={tw`mt-0.5`}>
                    <Ionicons
                      name={isChecked ? "checkbox" : "square-outline"}
                      size={24}
                      color={isChecked ? colors.primary_black : "#9CA3AF"}
                    />
                  </View>
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-sm font-bold text-gray-900`}>
                      Acknowledge Terms
                    </Text>
                    <Text style={tw`text-xs text-gray-500 leading-5`}>
                      I confirm the selected packaging is sufficient and ready
                      for pickup.
                    </Text>
                  </View>
                </Pressable>
              )}
            </View>

            {/* Submit Button */}
            <View style={tw`mt-12 mx-5 mb-36`}>
              <LongBlackButton
                value="Accept Order"
                onClick={handleSubmit}
                isLoading={isLoading}
                isDisabled={checkIsDisabled()}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </WithModal>
  );
};

export default DimensionsDetails;
