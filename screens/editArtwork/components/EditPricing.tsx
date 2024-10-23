import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import LongBlackButton from "components/buttons/LongBlackButton";
import { colors } from "config/colors.config";
import CustomSelectPicker from "components/inputs/CustomSelectPicker";
import Input from "components/inputs/Input";
import { utils_formatPrice } from "utils/utils_priceFormatter";
import { displayPrice } from "data/uploadArtworkForm.data";
import { validate } from "lib/validations/upload_artwork_input_validator/validator";
import { currencies } from "screens/uploadArtwork/components/mocks";
import { utils_getCurrencySymbol } from "utils/utils_getCurrencySymbol";
import { useModalStore } from "store/modal/modalStore";
import { getCurrencyConversion } from "services/exchange_rate/getCurrencyConversion";
import { updateArtworkPrice } from "services/artworks/updateArtworkPrice";
import { StackNavigationProp } from "@react-navigation/stack";
import { screenName } from "constants/screenNames.constants";

type artworkPricingErrorsType = {
  price: string;
};

const transformedCurrencies = currencies.map((item) => ({
  value: item.code,
  label: item.name,
}));

export default function EditPricing({ art_id }: { art_id: string }) {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { updateModal } = useModalStore();

  const [loading, setLoading] = useState<boolean>(false);

  const [price, setPrice] = useState<number>(0);
  const [usdPrice, setUsdPrice] = useState<number>(0);
  const [currency, setCurrency] = useState("");
  const [shouldShowPrice, setShouldShowPrice] = useState<string>("");

  const [formErrors, setFormErrors] = useState<artworkPricingErrorsType>({
    price: "",
  });
  const [loadingConversion, setLoadingConversion] = useState<boolean>(false);

  const currency_symbol = utils_getCurrencySymbol(currency);
  const usd_symbol = utils_getCurrencySymbol("USD");

  const checkIsDisabled = () => {
    // Check if there are no error messages and all input fields are filled
    const isFormValid = Object.values(formErrors).every(
      (error) => error === ""
    );
    const areAllFieldsFilled = Object.values({
      pricing: price,
      showPrice: shouldShowPrice,
      usd_price: setUsdPrice,
    }).every((value, index) => {
      if (value === "") return false;

      // check if the index of pricing is zero
      if (index === 0 && value === 0) return false;

      return true;
    });

    return !(isFormValid && areAllFieldsFilled);
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

  const handleCurrencyConvert = async (value: number) => {
    setPrice(value);
    if (Number.isNaN(value)) {
      setPrice(0);
      return;
    }

    setLoadingConversion(true);
    const conversion_value = await getCurrencyConversion(
      currency.toUpperCase(),
      +value
    );

    if (!conversion_value?.isOk)
      updateModal({
        message: "Unable to retrieve exchange rate value at this time.",
        modalType: "error",
        showModal: true,
      });
    else {
      setUsdPrice(conversion_value.data);
    }

    setLoadingConversion(false);
  };

  const handlePriceUpdate = async () => {
    setLoading(true);
    const filter: ArtworkPriceFilterData = {
      "pricing.price": price,
      "pricing.usd_price": usdPrice,
      "pricing.shouldShowPrice": shouldShowPrice,
      "pricing.currency": currency,
    };

    const update = await updateArtworkPrice(filter, art_id);
    if (update?.isOk) {
      updateModal({
        message: "Artwork pricing detials successfully updated",
        showModal: true,
        modalType: "success",
      });
      goBack();
    } else {
      updateModal({
        message: "Error updating pricing detials",
        showModal: true,
        modalType: "error",
      });
    }

    setLoading(false);
  };

  const goBack = () => {
    setTimeout(() => {
      navigation.navigate(screenName.gallery.artworks);
    }, 3500);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputsContainer}>
        <View style={{ flexDirection: "row", gap: 10, zIndex: 11 }}>
          <View style={{ flex: 1 }}>
            <CustomSelectPicker
              label="Currency"
              data={transformedCurrencies}
              placeholder="Select"
              value={currency}
              handleSetValue={(value) => {
                setCurrency(value);
                setPrice(0);
              }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Input
              label="Price"
              // onInputChange={value => updateArtworkUploadData('price', parseInt(value, 10))}
              onInputChange={(value) =>
                handleCurrencyConvert(parseInt(value, 10))
              }
              placeHolder="Enter your price"
              value={price === 0 ? "" : price}
              handleBlur={() =>
                handleValidationChecks("price", JSON.stringify(price))
              }
              errorMessage={formErrors.price}
              keyboardType="decimal-pad"
              disabled={currency === ""}
            />
          </View>
        </View>
        <View>
          {currency !== "" && price !== 0 && usdPrice !== 0 && (
            <Text style={{ fontSize: 14, fontWeight: 500, opacity: 0.8 }}>
              Exchange rate:{" "}
              {`${utils_formatPrice(price, currency_symbol)} = ${
                loadingConversion
                  ? "converting..."
                  : utils_formatPrice(usdPrice, usd_symbol)
              }`}
            </Text>
          )}
        </View>
        <View style={{ zIndex: 10 }}>
          <CustomSelectPicker
            label="Display price"
            data={displayPrice}
            placeholder="Select"
            value={shouldShowPrice}
            handleSetValue={(value) => setShouldShowPrice(value)}
          />
        </View>
        <Text style={{ fontSize: 12, color: "#ff0000" }}>
          Please note: To ensure consistent pricing across the platform, all
          uploaded prices will be displayed in US Dollar equivalents.
        </Text>
      </View>
      <View style={{ zIndex: 2 }}>
        <LongBlackButton
          value="Update pricing details"
          onClick={handlePriceUpdate}
          isLoading={loading}
          isDisabled={checkIsDisabled()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 50,
  },
  inputsContainer: {
    gap: 20,
    marginBottom: 50,
    zIndex: 3,
  },
  flexInputsContainer: {
    flexDirection: "row",
    gap: 20,
  },
  label: {
    fontSize: 14,
    color: colors.inputLabel,
  },
});
