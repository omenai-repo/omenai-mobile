import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import tw from "twrnc";
import { colors } from "#config/colors.config";
import Input from "#components/inputs/Input";
import CustomSelectPicker from "#components/inputs/CustomSelectPicker";
import { displayPrice } from "#data/uploadArtworkForm.data";
import LongBlackButton from "#components/buttons/LongBlackButton";
import { uploadArtworkStore } from "#store/gallery/uploadArtworkStore";
import { validate } from "#lib/validations/upload_artwork_input_validator/validator";
import { currencies } from "./mocks";
import { getCurrencyConversion } from "#services/exchange_rate/getCurrencyConversion";
import { utils_formatPrice } from "#utils/utils_priceFormatter";
import { utils_getCurrencySymbol } from "#utils/utils_getCurrencySymbol";
import { useModalStore } from "#store/modal/modalStore";
import { getFlag } from "#utils/getFlag";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const transformedCurrencies = currencies.map((item) => ({
  value: item.code,
  label: `${getFlag(item.code)}  ${item.name}`,
}));

type artworkPricingErrorsType = {
  price: string;
};

export default function Pricing({
  plan,
}: Readonly<{ plan: string | undefined }>) {
  const {
    setActiveIndex,
    activeIndex,
    artworkUploadData,
    updateArtworkUploadData,
  } = uploadArtworkStore();

  useEffect(() => {
    if (["basic", "pro"].includes(plan?.toLowerCase() || "")) {
      updateArtworkUploadData("shouldShowPrice", "Yes");
    }
  }, [plan]);

  const { updateModal } = useModalStore();

  const [formErrors, setFormErrors] = useState<artworkPricingErrorsType>({
    price: "",
  });
  const [loadingConversion, setLoadingConversion] = useState<boolean>(false);
  // Local price string — only committed to store on Convert
  const [localPrice, setLocalPrice] = useState<string>(
    artworkUploadData.price === 0 ? "" : artworkUploadData.price.toString(),
  );

  const currency_symbol = utils_getCurrencySymbol(artworkUploadData.currency);
  const usd_symbol = utils_getCurrencySymbol("USD");

  const checkIsDisabled = () => {
    const isFormValid = Object.values(formErrors).every(
      (error) => error === "",
    );
    const areAllFieldsFilled = Object.values({
      pricing: artworkUploadData.price,
      showPrice: artworkUploadData.shouldShowPrice,
      usd_price: artworkUploadData.usd_price,
    }).every((value, index) => {
      if (value === "") return false;
      if (index === 0 && value === 0) return false;
      return true;
    });
    return !(isFormValid && areAllFieldsFilled) || loadingConversion;
  };

  const handleValidationChecks = (label: string, value: string) => {
    const { success, errors }: { success: boolean; errors: string[] | [] } =
      validate(label, value);
    if (!success) {
      setFormErrors((prev) => ({ ...prev, [label]: errors[0] }));
    } else {
      setFormErrors((prev) => ({ ...prev, [label]: "" }));
    }
  };

  /** Called only when user taps the Convert button */
  const handleConvert = async () => {
    const value = Number.parseInt(localPrice, 10);

    if (Number.isNaN(value) || value <= 0) {
      updateModal({
        message: "Please enter a valid price before converting.",
        modalType: "error",
        showModal: true,
      });
      return;
    }

    handleValidationChecks("price", localPrice);
    updateArtworkUploadData("price", value);

    setLoadingConversion(true);
    const conversion_value = await getCurrencyConversion(
      artworkUploadData.currency.toUpperCase(),
      value,
    );

    if (conversion_value?.isOk) {
      updateArtworkUploadData("usd_price", conversion_value.data);
    } else {
      updateModal({
        message: "Unable to retrieve exchange rate value at this time.",
        modalType: "error",
        showModal: true,
      });
    }

    setLoadingConversion(false);
  };

  const getUsdEquivalent = () => {
    if (loadingConversion) return "Converting...";
    if (artworkUploadData.usd_price === 0) return "";
    return utils_formatPrice(artworkUploadData.usd_price, usd_symbol);
  };

  const getDisplayPriceOptions = () => {
    if (["basic", "pro"].includes(plan?.toLowerCase() || "")) {
      return displayPrice.filter((option) => option.value === "Yes");
    }
    return displayPrice;
  };

  const canConvert =
    artworkUploadData.currency !== "" &&
    localPrice !== "" &&
    Number.parseInt(localPrice, 10) > 0;

  return (
    <View style={tw`flex-1`}>
      <View style={tw`gap-5 mb-12 z-10`}>
        {/* Currency */}
        <View style={tw`z-[11]`}>
          <CustomSelectPicker
            label="Currency"
            data={transformedCurrencies}
            placeholder="Select"
            value={artworkUploadData.currency}
            handleSetValue={(item) => {
              updateArtworkUploadData("currency", item.value);
              updateArtworkUploadData("price", 0);
              updateArtworkUploadData("usd_price", 0);
              setLocalPrice("");
            }}
          />
        </View>

        <View
          style={tw`bg-amber-50 p-4 rounded-lg border border-amber-100 flex-row gap-3`}
        >
          <Text style={tw`text-amber-500 font-bold text-sm`}>*</Text>
          <View style={tw`flex-1 gap-1`}>
            <Text style={tw`text-amber-800 font-bold text-xs leading-relaxed`}>
              Currency Standardization
            </Text>
            <Text style={tw`text-amber-800 text-xs leading-relaxed`}>
              To ensure consistent pricing across the platform, all uploaded
              prices will be converted and displayed in US Dollar equivalents.
              Please enter your local price below and hit the refresh button to
              calculate.
            </Text>
          </View>
        </View>

        {/* Price Input + Convert Button */}
        <View style={tw`gap-1`}>
          <View style={tw`flex-row items-end gap-2`}>
            <View style={tw`flex-1`}>
              <Input
                label="Price"
                onInputChange={(value) => {
                  setLocalPrice(value);
                  if (artworkUploadData.usd_price !== 0) {
                    updateArtworkUploadData("usd_price", 0);
                    updateArtworkUploadData("price", 0);
                  }
                }}
                placeHolder="Enter your price"
                value={localPrice}
                errorMessage={formErrors.price}
                keyboardType="decimal-pad"
                disabled={artworkUploadData.currency === ""}
              />
            </View>
            <TouchableOpacity
              onPress={handleConvert}
              disabled={!canConvert || loadingConversion}
              style={[
                tw`rounded-md items-center justify-center h-10.5 w-11`,
                canConvert && !loadingConversion
                  ? { backgroundColor: colors.black }
                  : tw`bg-gray-100`,
              ]}
            >
              {loadingConversion ? (
                <ActivityIndicator size="small" color="#9ca3af" />
              ) : (
                <MaterialIcons
                  name="sync"
                  size={24}
                  color={canConvert && !loadingConversion ? "#fff" : "#9ca3af"}
                />
              )}
            </TouchableOpacity>
          </View>
          {canConvert && artworkUploadData.usd_price === 0 && (
            <View style={tw`flex-row items-center gap-1 mt-1 px-1`}>
              <Ionicons name="information-circle" size={12} color="#f59e0b" />
              <Text style={tw`text-amber-500 text-[10px]`}>
                Please convert your price to proceed
              </Text>
            </View>
          )}
        </View>

        {/* USD Equivalent — always visible, disabled */}
        <View>
          <Input
            label="USD Equivalent (Calculated)"
            value={getUsdEquivalent()}
            disabled={true}
            placeHolder="USD Value"
            onInputChange={() => {}}
          />
        </View>

        {/* Display price */}
        <View style={tw`z-[10]`}>
          <CustomSelectPicker
            label="Display price"
            data={getDisplayPriceOptions()}
            placeholder="Select"
            value={artworkUploadData.shouldShowPrice}
            handleSetValue={(item) =>
              updateArtworkUploadData("shouldShowPrice", item.value)
            }
            disable={["basic", "pro"].includes(plan?.toLowerCase() || "")}
          />
          {["basic", "pro"].includes(plan?.toLowerCase() || "") && (
            <Text style={tw`text-[10px] text-slate-400 mt-1`}>
              * Upgrade your plan to unlock advanced pricing visibility options.
            </Text>
          )}
        </View>
      </View>

      <View style={tw`z-[2]`}>
        <LongBlackButton
          value="Proceed"
          onClick={() => setActiveIndex(activeIndex + 1)}
          isLoading={false}
          isDisabled={checkIsDisabled()}
        />
      </View>
    </View>
  );
}
