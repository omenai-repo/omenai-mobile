import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "config/colors.config";
import CustomPicker from "components/general/CustomPicker";
import Input from "components/inputs/Input";
import CustomChecker from "components/inputs/CustomChecker";
import CustomSelectPicker from "components/inputs/CustomSelectPicker";
import { countriesListing } from "constants/countries.constants";
import SummaryContainer from "./SummaryContainer";
import { useOrderSummaryStore } from "store/orders/OrderSummaryStore";
import { validate } from "lib/validations/validatorGroup";
import { utils_getAsyncData } from "utils/utils_asyncStorage";
import { country_codes } from "json/country_alpha_2_codes";

const deliveryOptions = [
  "Shipping",
  // 'Pickup'
];

type deliveryModeTypes = "Shipping" | "Pickup";

const transformedCountries = country_codes.map((item) => ({
  value: item.key,
  label: item.name,
}));

export default function ShippingDetails({
  data: { pricing },
}: {
  data: artworkOrderDataTypes;
}) {
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    address: "",
    zipCode: "",
    city: "",
    state: "",
  });

  const {
    deliveryMode,
    setDeliveryMode,
    name,
    setName,
    email,
    setEmail,
    address,
    setDeliveryAddress,
    country,
    setCountry,
    city,
    setCity,
    zipCode,
    setZipCode,
    state,
    setState,
    saveShippingAddress,
    setSaveShippingAddress,
  } = useOrderSummaryStore();

  useEffect(() => {
    fetchUserSessionsData();
  }, []);

  const fetchUserSessionsData = async () => {
    let userSession = await utils_getAsyncData("userSession");
    if (userSession.value) {
      const userData = JSON.parse(userSession.value);
      setName(userData.name);
      setEmail(userData.email);
    }
  };

  const checkIsDisabled = () => {
    // Check if there are no error messages and all input fields are filled
    const isFormValid = Object.values(formErrors).every(
      (error) => error === ""
    );
    const areAllFieldsFilled = Object.values({
      name: name,
      email: email,
      address: address,
      // country: country,
      city: city,
      state: state,
      zipCode: zipCode,
    }).every((value) => value !== "");

    return !(isFormValid && areAllFieldsFilled);
  };

  const handleValidationChecks = (
    label: string,
    value: string,
    confirm?: string
  ) => {
    const { success, errors }: { success: boolean; errors: string[] | [] } =
      validate(value, label, confirm);
    if (!success) {
      setFormErrors((prev) => ({ ...prev, [label]: errors[0] }));
    } else {
      setFormErrors((prev) => ({ ...prev, [label]: "" }));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleHeader}>Shipping Details</Text>
      <View style={styles.shippingDetailsContainer}>
        <Text style={{ fontSize: 16, fontWeight: 500, color: colors.grey }}>
          Delivery Mode
        </Text>
        <View style={styles.pickerContainer}>
          {deliveryOptions.map((option, index) => (
            <CustomPicker
              name={option}
              onPress={() => setDeliveryMode(option as deliveryModeTypes)}
              isSelected={option === deliveryMode}
              key={index}
            />
          ))}
        </View>
        <View style={styles.formContainer}>
          <Input
            label="Full name"
            value={name}
            placeHolder="Enter your full name"
            onInputChange={() => null}
            disabled
            handleBlur={() => handleValidationChecks("name", name)}
            errorMessage={formErrors.name}
          />
          <Input
            label="Email address"
            value={email}
            placeHolder="Enter your email address"
            onInputChange={() => null}
            disabled
            keyboardType="email-address"
            handleBlur={() => handleValidationChecks("email", email)}
            errorMessage={formErrors.email}
          />
          <Input
            label="Delivery address"
            value={address}
            placeHolder="Enter your delivery address"
            onInputChange={setDeliveryAddress}
            handleBlur={() => handleValidationChecks("address", address)}
            errorMessage={formErrors.address}
          />
          <CustomSelectPicker
            data={transformedCountries}
            placeholder="Select your country"
            value={country}
            handleSetValue={setCountry}
            label="Country"
            search={true}
            searchPlaceholder={"Search Country"}
            dropdownPosition="top"
          />
          <Input
            label="State"
            value={state}
            placeHolder="Enter your state"
            onInputChange={setState}
            handleBlur={() => handleValidationChecks("state", state)}
            errorMessage={formErrors.state}
          />
          <Input
            label="City"
            value={city}
            placeHolder="Enter your city"
            onInputChange={setCity}
            handleBlur={() => handleValidationChecks("city", city)}
            errorMessage={formErrors.city}
          />
          <Input
            label="Zip Code"
            value={zipCode}
            placeHolder="123456"
            onInputChange={setZipCode}
            keyboardType="number-pad"
            handleBlur={() => handleValidationChecks("zipCode", zipCode)}
            errorMessage={formErrors.zipCode}
          />
          <CustomChecker
            isSelected={saveShippingAddress}
            label="Save my delivery address"
            onPress={() => setSaveShippingAddress(!saveShippingAddress)}
          />
        </View>
      </View>
      <SummaryContainer
        buttonTypes="Request price quote"
        price={pricing.shouldShowPrice === "Yes" ? pricing.price : 0}
        disableButton={checkIsDisabled()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    paddingTop: 0,
  },
  titleHeader: {
    fontSize: 20,
    fontWeight: 500,
    color: colors.primary_black,
  },
  shippingDetailsContainer: {
    borderWidth: 1,
    borderColor: colors.inputBorder,
    marginTop: 25,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 40,
    marginTop: 20,
  },
  formContainer: {
    gap: 20,
    borderTopWidth: 1,
    borderTopColor: colors.grey50,
    marginTop: 30,
    paddingTop: 20,
  },
});
