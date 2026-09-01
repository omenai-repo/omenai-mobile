import { ActivityIndicator, Pressable, Text, View } from "react-native";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import CustomSelectPicker from "#components/inputs/CustomSelectPicker";
import Input from "#components/inputs/Input";
import { utils_formatPrice } from "#utils/commerce/utils_priceFormatter";
import { displayPrice } from "#data/uploadArtworkForm.data";
import { currencies } from "#screens/artwork/upload/components/mocks";
import { utils_getCurrencySymbol } from "#utils/location/utils_getCurrencySymbol";
import { useModalStore } from "#store/account/modal/modalStore";
import { getCurrencyConversion } from "#services/commerce/exchangeRate/getCurrencyConversion";
import tw from "twrnc";
import { retrieveSubscriptionData } from "#services/commerce/subscriptions/retrieveSubscriptionData";
import { useAppStore } from "#store/app/appStore";
import CardHeaderStripe from "#components/general/CardHeaderStripe";
import { colors } from "#config/colors.config";

type GalleryEditPricingProps = Readonly<{
  pricing: {
    price: number;
    usdPrice: number;
    currency: string;
    shouldShowPrice: string;
  };
  onPricingChange: (fields: {
    price?: number;
    usdPrice?: number;
    currency?: string;
    shouldShowPrice?: string;
  }) => void;
  formErrors: { price: string };
  setFormErrors: (errors: any) => void;
}>;

const transformedCurrencies = currencies.map((item) => ({
  value: item.code,
  label: item.name,
}));

export default function GalleryEditPricing({
  pricing,
  onPricingChange,
  formErrors,
  setFormErrors,
}: GalleryEditPricingProps) {
  const { updateModal } = useModalStore();
  const { userSession } = useAppStore();

  const [loadingConversion, setLoadingConversion] = useState<boolean>(false);

  const usd_symbol = utils_getCurrencySymbol("USD");

  const pricingVisibilityPlans = new Set(["gallery", "principal"]);
  const { data: canManagePriceVisibility = false } = useQuery({
    queryKey: ["gallery_pricing_visibility_entitlement", userSession?.id],
    queryFn: async () => {
      if (!userSession?.id) return false;
      const subscription = await retrieveSubscriptionData(userSession.id);
      if (!subscription?.isOk || subscription.data?.status !== "active")
        return false;
      return pricingVisibilityPlans.has(
        subscription.plan?.type?.toLowerCase() || "",
      );
    },
    enabled: Boolean(userSession?.id),
    refetchOnWindowFocus: false,
  });

  const handleValidationChecks = (label: string, value: string) => {
    if (label === "price" && (Number.isNaN(Number(value)) || Number(value) <= 0)) {
      setFormErrors((prev: any) => ({
        ...prev,
        [label]: "Please enter a valid price.",
      }));
    } else {
      setFormErrors((prev: any) => ({ ...prev, [label]: "" }));
    }
  };

  const canConvert =
    pricing.currency !== "" && pricing.price > 0 && formErrors.price === "";

  const handleCurrencyConvert = async (value: number) => {
    if (Number.isNaN(value) || value <= 0) {
      onPricingChange({ usdPrice: 0 });
      return;
    }
    setLoadingConversion(true);
    const conversion_value = await getCurrencyConversion(
      pricing.currency.toUpperCase(),
      +value,
    );
    if (!conversion_value?.isOk) {
      updateModal({
        message: "Unable to retrieve exchange rate value at this time.",
        modalType: "error",
        showModal: true,
      });
    } else {
      onPricingChange({ usdPrice: conversion_value.data });
    }
    setLoadingConversion(false);
  };

  const getUsdPriceDisplay = () => {
    if (loadingConversion) return "Calculating…";
    if (pricing.usdPrice > 0) return utils_formatPrice(pricing.usdPrice, usd_symbol);
    return "";
  };

  return (
    <View
      style={tw`bg-white rounded-sm border border-[#E8ECF4] overflow-hidden`}
    >
      <CardHeaderStripe title="Artwork Pricing" icon="pricetag-outline" />

      <View style={tw`p-5 gap-5`}>
        <View
          style={tw`bg-[#F0F4FF] border border-[#C7D5F8] rounded-sm px-4 py-3 flex-row gap-2.5 items-start`}
        >
          <Ionicons
            name="information-circle"
            size={15}
            color="#3B5BDB"
            style={tw`mt-0.5`}
          />
          <Text
            style={tw`font-sans-regular text-xs text-[#3B5BDB] leading-5 flex-1`}
          >
            <Text style={tw`font-sans-semibold`}>
              Currency standardisation:{" "}
            </Text>
            Enter the local price then use the sync button to calculate the USD
            equivalent.
          </Text>
        </View>

        <View style={tw`z-11`}>
          <CustomSelectPicker
            label="Currency"
            data={transformedCurrencies}
            placeholder="Select currency"
            value={pricing.currency}
            handleSetValue={(item) => {
              onPricingChange({ currency: item.value, usdPrice: 0 });
            }}
          />
        </View>

        <View style={tw`gap-1.5`}>
          <View style={tw`flex-row items-end gap-2.5`}>
            <View style={tw`flex-1`}>
              <Input
                label="Price"
                onInputChange={(value) => {
                  const num = Number.parseInt(value, 10);
                  const parsedPrice = Number.isNaN(num) ? 0 : num;
                  onPricingChange({ price: parsedPrice, usdPrice: 0 });
                }}
                placeHolder="e.g. 1200"
                value={pricing.price === 0 ? "" : String(pricing.price)}
                handleBlur={() =>
                  handleValidationChecks("price", String(pricing.price))
                }
                errorMessage={formErrors.price}
                keyboardType="decimal-pad"
                disabled={pricing.currency === ""}
                containerStyle={tw`w-full`}
              />
            </View>

            <Pressable
              onPress={() => handleCurrencyConvert(pricing.price)}
              disabled={!canConvert || loadingConversion}
              style={[
                tw`rounded-sm items-center justify-center h-10 w-10`,
                canConvert && !loadingConversion
                  ? tw`bg-[${colors.black}]`
                  : tw`bg-neutral-200 border border-neutral-500`,
              ]}
            >
              {loadingConversion ? (
                <ActivityIndicator
                  size="small"
                  color={canConvert ? "#ffffff" : "#9ca3af"}
                />
              ) : (
                <MaterialIcons
                  name="sync"
                  size={22}
                  color={
                    canConvert && !loadingConversion ? "#ffffff" : "#9ca3af"
                  }
                />
              )}
            </Pressable>
          </View>

          {canConvert && pricing.usdPrice === 0 && (
            <View style={tw`flex-row items-center gap-1 px-1`}>
              <Ionicons name="information-circle" size={12} color="#3B5BDB" />
              <Text style={tw`font-sans-regular text-xs text-[#3B5BDB]`}>
                Sync your price to proceed
              </Text>
            </View>
          )}
        </View>

        <View>
          <Input
            label="USD Equivalent (Calculated)"
            value={getUsdPriceDisplay()}
            disabled={true}
            placeHolder="USD value will appear here"
            onInputChange={() => {}}
          />
        </View>

        <View style={tw`z-10`}>
          <CustomSelectPicker
            label="Display price"
            data={displayPrice}
            placeholder="Select"
            value={pricing.shouldShowPrice}
            handleSetValue={(item) => {
              if (canManagePriceVisibility)
                onPricingChange({ shouldShowPrice: item.value });
            }}
            disable={!canManagePriceVisibility}
          />
          {!canManagePriceVisibility && (
            <View style={tw`flex-row items-center gap-1.5 mt-1.5 px-1`}>
              <Ionicons name="lock-closed-outline" size={11} color="#94A3C4" />
              <Text style={tw`font-sans-regular text-xs text-[#94A3C4]`}>
                Upgrade your plan to unlock pricing visibility
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
