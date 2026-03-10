import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import React, { useEffect, useState, useMemo } from "react";
import tw from "twrnc";
import BackHeaderTitle from "#components/header/BackHeaderTitle";
import LongBlackButton from "#components/buttons/LongBlackButton";
import { updateShippingQuote } from "#services/orders/updateShippingQuote";
import { useQueryClient } from "@tanstack/react-query";
import { useModalStore } from "#store/modal/modalStore";
import { useNavigation, useRoute } from "@react-navigation/native";

import { validateOrderMeasurement } from "#lib/validations/upload_artwork_input_validator/validateOrderMeasurement";
import { useAppStore } from "#store/app/appStore";
import { Analytics } from "#utils/analytics";
import PackagingSelector from "#components/packaging/PackagingSelector";
import { PackagingType } from "#constants/packaging_data";
import {
  checkCarrierLimit,
  checkIfRolledPassesLimit,
} from "#utils/shippingLimits";
import CarrierInterventionCard from "#components/packaging/CarrierInterventionCard";
import ExclusivityCheck from "./components/dimensions/ExclusivityCheck";
import CustomDimensionsInput from "./components/dimensions/CustomDimensionsInput";
import SelectedDimensionsSummary from "./components/dimensions/SelectedDimensionsSummary";
import ExhibitionOptions from "./components/dimensions/ExhibitionOptions";
import AgreementSection from "./components/dimensions/AgreementSection";

type ArtworkDimensionsErrorsType = {
  height: string;
  length: string;
  width: string;
  weight: string;
};

const DimensionsDetails = () => {
  const { userType } = useAppStore();
  const {
    orderId,
    artworkDimensions,
    exclusivityType,
    carrier,
    shippingOrigin,
  } = useRoute<any>().params;
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

  // The current active pickup address. Defaults to shippingOrigin.
  const [selectedPickupAddress, setSelectedPickupAddress] =
    useState<AddressTypes | null>(shippingOrigin || null);

  // Intervention states
  const [hasDeclinedRolled, setHasDeclinedRolled] = useState(false);

  const { updateModal } = useModalStore();
  const queryClient = useQueryClient();
  const userId = useAppStore((state) => state.userSession.id);

  // Helper to safely parse dimension strings (e.g. "32in" -> 32)
  const parseDim = (val: string | number | undefined) => {
    if (!val) return 0;
    const str = String(val);
    // Remove everything that is NOT a digit or a decimal point
    const cleanStr = str.replace(/[^\d.]/g, "");
    return Number(cleanStr) || 0;
  };

  const artDims = useMemo(() => {
    return {
      length: parseDim(artworkDimensions?.length) || 24,
      height: parseDim(artworkDimensions?.height) || 24,
    };
  }, [artworkDimensions]);

  const isCurrentlyOversized = useMemo(() => {
    if (!carrier) return false;

    if (
      usePreset &&
      (!dimensions.length || !dimensions.width || !dimensions.height)
    ) {
      return checkCarrierLimit(
        artDims.length * 2.54,
        artDims.height * 2.54,
        5,
        10,
        carrier,
      );
    }

    if (
      !usePreset &&
      (!dimensions.length || !dimensions.width || !dimensions.height)
    ) {
      // Don't prematurely trigger oversize warnings while they are typing custom dimensions
      return false;
    }

    const IN_TO_CM = 2.54;
    return checkCarrierLimit(
      usePreset
        ? Number.parseFloat(dimensions.length)
        : Number.parseFloat(dimensions.length) * IN_TO_CM,
      usePreset
        ? Number.parseFloat(dimensions.width)
        : Number.parseFloat(dimensions.width) * IN_TO_CM,
      usePreset
        ? Number.parseFloat(dimensions.height)
        : Number.parseFloat(dimensions.height) * IN_TO_CM,
      Number.parseFloat(dimensions.weight || "0"),
      carrier,
    );
  }, [carrier, dimensions, usePreset, artDims]);

  const canBeRolled = useMemo(() => {
    return checkIfRolledPassesLimit(
      artDims.length * 2.54,
      artDims.height * 2.54,
      carrier || "",
    );
  }, [artDims, carrier]);

  useEffect(() => {
    setSelectedPickupAddress(shippingOrigin || null);
  }, [shippingOrigin]);

  const handlePresetSelect = (details: {
    length: string;
    width: string;
    height: string;
    weight: string;
  }) => {
    setHasDeclinedRolled(false);
    if (details.length) {
      setUsePreset(true);
      setDimensions(details);
      // Clear errors since preset values are valid
      setFormErrors({ height: "", length: "", width: "", weight: "" });
    } else {
      // Custom mode - Start with blank dimensions
      setUsePreset(false);
      setDimensions({
        length: "",
        width: "",
        height: "",
        weight: "",
      });
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
          exhibition_status: isOnExhibition
            ? {
                is_on_exhibition: true,
                exhibition_end_date: expoEndDate || "",
                status: "pending",
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
    <View style={tw`flex-1 bg-[#F7F7F7]`}>
      <BackHeaderTitle title="Packaging Dimensions" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw`flex-1`}
      >
        <ScrollView
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={tw`pb-20`}
        >
          <View style={tw`mt-[20px] mx-[20px]`}>
            {/* Packaging Selector with Presets */}
            <ExclusivityCheck
              userType={userType}
              exclusivityType={exclusivityType}
            />

            <PackagingSelector
              artDimensions={artDims}
              packagingType={packagingType}
              carrier={carrier || "Courier"}
              onTypeChange={setPackagingType}
              onSelect={handlePresetSelect}
            />

            {/* Custom Dimension Inputs (shown when custom selected) */}
            <CustomDimensionsInput
              usePreset={usePreset}
              dimensions={dimensions}
              setDimensions={setDimensions}
              formErrors={formErrors}
              handleValidationChecks={handleValidationChecks}
            />

            {/* Selected Dimensions Summary */}
            <SelectedDimensionsSummary
              usePreset={usePreset}
              dimensions={dimensions as any}
            />
          </View>

          {isCurrentlyOversized || hasDeclinedRolled ? (
            <View style={tw`mx-4 mb-10`}>
              <CarrierInterventionCard
                orderId={orderId}
                carrier={carrier || "Courier"}
                hasDeclined={hasDeclinedRolled}
                canBeRolled={canBeRolled}
                packagingType={packagingType}
                onDecline={() => setHasDeclinedRolled(true)}
                onSwitchToRolled={() => {
                  setPackagingType("rolled");
                  setHasDeclinedRolled(false);
                }}
                onTryCustomCrate={() => {
                  setUsePreset(false);
                  setDimensions({
                    length: "",
                    width: "",
                    height: "",
                    weight: "",
                  });
                  setHasDeclinedRolled(false);
                }}
              />
            </View>
          ) : (
            <View>
              <ExhibitionOptions
                userType={userType}
                orderId={orderId}
                isOnExhibition={isOnExhibition}
                setIsOnExhibition={setIsOnExhibition}
                expoEndDate={expoEndDate}
                setExpoEndDate={setExpoEndDate}
                pickupAddress={selectedPickupAddress}
                onAddressUpdated={setSelectedPickupAddress}
              />

              {/* Agreement Section */}
              <AgreementSection
                userType={userType}
                isChecked={isChecked}
                setIsChecked={setIsChecked}
              />

              {/* Submit Button */}
              <View style={tw`mt-12 mx-5 mb-10`}>
                <LongBlackButton
                  value="Accept Order"
                  onClick={handleSubmit}
                  isLoading={isLoading}
                  isDisabled={checkIsDisabled()}
                />
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default DimensionsDetails;
