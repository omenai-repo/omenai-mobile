import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import tw from "twrnc";
import BackHeaderTitle from "#components/header/BackHeaderTitle";
import LongBlackButton from "#components/buttons/LongBlackButton";
import { updateShippingQuote } from "#services/orders/updateShippingQuote";
import { updateOrderPickupAddress } from "#services/orders/updateOrderPickupAddress";
import { useQueryClient } from "@tanstack/react-query";
import { useModalStore } from "#store/modal/modalStore";
import { useNavigation, useRoute } from "@react-navigation/native";

import { screenName } from "#constants/screenNames.constants";
import {
  getGalleryOrdersSubscriptionNotice,
  useGallerySubscriptionActiveForOrders,
} from "#hooks/useGallerySubscriptionActiveForOrders";
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
import CarrierNoteInput from "./components/dimensions/CarrierNoteInput";

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
    shippingDestination,
  } = useRoute<any>().params;
  const navigation = useNavigation<any>();

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
  const [specialInstructions, setSpecialInstructions] = useState("");

  // The current active pickup address. Defaults to shippingOrigin.
  const [selectedPickupAddress, setSelectedPickupAddress] =
    useState<AddressTypes | null>(shippingOrigin || null);

  // Intervention states
  const [hasDeclinedRolled, setHasDeclinedRolled] = useState(false);

  const { updateModal } = useModalStore();
  const queryClient = useQueryClient();
  const userId = useAppStore((state) => state.userSession.id);

  const gallerySub = useGallerySubscriptionActiveForOrders({
    galleryId: userId,
    enabled: userType === "gallery",
  });

  const galleryOrdersAcceptBlocked = useMemo(
    () =>
      userType === "gallery" &&
      (gallerySub.isLoading || gallerySub.isError || !gallerySub.isActive),
    [userType, gallerySub.isLoading, gallerySub.isError, gallerySub.isActive],
  );

  const gallerySubscriptionNotice = useMemo(
    () =>
      userType === "gallery"
        ? getGalleryOrdersSubscriptionNotice({
            isLoading: gallerySub.isLoading,
            isError: gallerySub.isError,
            isActive: gallerySub.isActive,
            subscriptionData: gallerySub.subscriptionData,
          })
        : "",
    [
      userType,
      gallerySub.isLoading,
      gallerySub.isError,
      gallerySub.isActive,
      gallerySub.subscriptionData,
    ],
  );

  // Helper to safely parse dimension strings (e.g. "32in" -> 32)
  const parseDim = (val: string | number | undefined) => {
    if (!val) return 0;
    const str = String(val);
    // Remove everything that is NOT a digit or a decimal point
    const cleanStr = str.replaceAll(/[^\d.]/g, "");
    return Number(cleanStr) || 0;
  };

  const normalizedCarrier = useMemo(
    () => (carrier || "").toUpperCase(),
    [carrier],
  );

  const artDims = useMemo(() => {
    return {
      width: parseDim(artworkDimensions?.width),
      height: parseDim(artworkDimensions?.height),
    };
  }, [artworkDimensions]);

  const isCurrentlyOversized = useMemo(() => {
    if (!carrier) return false;

    const hasPackageDimensions =
      dimensions.length &&
      dimensions.width &&
      dimensions.height &&
      dimensions.weight;

    if (!hasPackageDimensions) {
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
      Number.parseFloat(dimensions.weight),
      normalizedCarrier,
    );
  }, [normalizedCarrier, dimensions, usePreset]);

  const canBeRolled = useMemo(() => {
    return checkIfRolledPassesLimit(
      artDims.width * 2.54,
      artDims.height * 2.54,
      normalizedCarrier,
    );
  }, [artDims, normalizedCarrier]);

  useEffect(() => {
    setSelectedPickupAddress((prev) => {
      const next = shippingOrigin || null;
      if (!prev && !next) return prev;
      if (prev && next && JSON.stringify(prev) === JSON.stringify(next)) {
        return prev;
      }
      return next;
    });
  }, [shippingOrigin]);

  const handlePresetSelect = useCallback(
    (details: {
      length: string;
      width: string;
      height: string;
      weight: string;
    }) => {
      setHasDeclinedRolled(false);
      if (details.length) {
        setUsePreset(true);
        setDimensions((prev) =>
          prev.length === details.length &&
          prev.width === details.width &&
          prev.height === details.height &&
          prev.weight === details.weight
            ? prev
            : details,
        );
        setFormErrors((prev) =>
          !prev.height && !prev.length && !prev.width && !prev.weight
            ? prev
            : { height: "", length: "", width: "", weight: "" },
        );
      } else {
        setUsePreset(false);
        setDimensions((prev) =>
          !prev.length && !prev.width && !prev.height && !prev.weight
            ? prev
            : { length: "", width: "", height: "", weight: "" },
        );
      }
    },
    [],
  );

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

    let isExhibitionValid = true;
    if (userType === "gallery" && isOnExhibition) {
      isExhibitionValid = !!expoEndDate;
    }

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
    if (galleryOrdersAcceptBlocked) {
      return;
    }

    try {
      setIsLoading(true);

      // Auto-save pickup address if it was changed but not explicitly saved
      if (
        selectedPickupAddress &&
        JSON.stringify(selectedPickupAddress) !== JSON.stringify(shippingOrigin)
      ) {
        const addressResult = await updateOrderPickupAddress({
          type: "pickup",
          pickupAddress: selectedPickupAddress,
          order_id: orderId,
        });
        if (!addressResult.isOk) {
          updateModal({
            message: addressResult.message || "Failed to save pickup address",
            modalType: "error",
            showModal: true,
          });
          setIsLoading(false);
          return;
        }
      }

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
            length: dimLength,
            width: dimWidth,
            height: dimHeight,
            weight: Number.parseFloat(dimensions.weight),
          },
          packaging_type: packagingType,
          specialInstructions: specialInstructions.trim() || undefined,
          exhibition_status:
            userType === "gallery" && isOnExhibition
              ? {
                  is_on_exhibition: true,
                  exhibition_end_date: expoEndDate || "",
                  status: "pending",
                }
              : null,
          hold_status: null,
        },
      };

      const response = await updateShippingQuote(payload);

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
          message: response.message || response?.body?.message,
          modalType: "error",
          showModal: true,
        });
      }
    } catch (error: any) {
      updateModal({
        message: error.message || error?.body?.message,
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
              carrier={normalizedCarrier}
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
                carrier={normalizedCarrier || "Courier"}
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
                destinationAddress={shippingDestination || null}
                onAddressUpdated={setSelectedPickupAddress}
              />

              <CarrierNoteInput
                value={specialInstructions}
                onChange={setSpecialInstructions}
              />

              {/* Agreement Section */}
              <AgreementSection
                userType={userType}
                isChecked={isChecked}
                setIsChecked={setIsChecked}
              />

              {/* Submit: accept order (artist / active gallery sub) or subscribe (blocked gallery) */}
              <View style={tw`mt-12 mx-5 mb-10`}>
                {galleryOrdersAcceptBlocked ? (
                  <View style={tw`gap-3`}>
                    <Text
                      style={tw`text-[14px] text-[#454545] leading-[20px]`}
                      accessibilityRole="text"
                    >
                      {gallerySubscriptionNotice.trim() ||
                        "Your gallery subscription is inactive or has expired. Renew your plan to process this order."}
                    </Text>
                    <LongBlackButton
                      value="Renew to process order"
                      onClick={() =>
                        navigation.navigate(screenName.gallery.billing, {
                          plan_action: null,
                        })
                      }
                      textStyle={tw`normal-case tracking-normal`}
                    />
                  </View>
                ) : (
                  <LongBlackButton
                    value="Accept Order"
                    onClick={handleSubmit}
                    isLoading={isLoading}
                    isDisabled={checkIsDisabled()}
                  />
                )}
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default DimensionsDetails;
