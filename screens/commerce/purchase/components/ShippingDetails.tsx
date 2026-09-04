import { StyleSheet, Text, View } from "react-native";
import React, { useCallback, useEffect, useMemo } from "react";
import { colors } from "#config/colors.config";
import CustomPicker from "#components/general/CustomPicker";
import Input from "#components/inputs/Input";
import CustomChecker from "#components/inputs/CustomChecker";
import CustomSelectPicker from "#components/inputs/CustomSelectPicker";
import SummaryContainer from "./SummaryContainer";
import { useOrderSummaryStore } from "#store/commerce/orders/OrderSummaryStore";
import {
  Country,
  State,
  City,
  ICountry,
  IState,
  ICity,
} from "country-state-city";
import { debounce } from "lodash";
import { useAppStore } from "#store/app/appStore";
import { useFormValidation } from "#hooks/useFormValidation";
import { hasSavedDeliveryAddress } from "#lib/address/hasSavedDeliveryAddress";

interface SessionAddress {
  address_line: string;
  zip: string;
  country: string;
  countryCode: string;
  stateCode: string;
  city: string;
}

interface UserSession {
  name: string;
  email: string;
  phone?: string;
  address: SessionAddress;
}

const deliveryOptions = [
  "Shipping",
  // 'Pickup'
];

type deliveryModeTypes = "Shipping" | "Pickup";

export default function ShippingDetails({
  data,
}: Readonly<{
  data: artworkOrderDataTypes;
}>) {
  const pricing = data?.pricing;
  const artworkPrice =
    pricing != null &&
    typeof pricing.usd_price === "number" &&
    Number.isFinite(pricing.usd_price) &&
    pricing.usd_price > 0
      ? pricing.usd_price
      : undefined;
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
    countryCode,
    setCountry,
    setCountryCode,
    city,
    setCity,
    zipCode,
    phone,
    setPhone,
    setZipCode,
    state,
    stateData,
    cityData,
    setState,
    setStateData,
    setCityData,
    setStateCode,
    saveShippingAddress,
    setSaveShippingAddress,
  } = useOrderSummaryStore();

  const { formErrors, touched, handleBlur, checkIsDisabled } =
    useFormValidation({
      name,
      email,
      address,
      zipCode,
      phone,
      city,
      state,
    });

  const transformedCountries = useMemo(
    () =>
      Country.getAllCountries().map((item: ICountry) => ({
        value: item.isoCode,
        label: item.name,
      })),
    [],
  );

  const phoneCode = useMemo(() => {
    const code = Country.getCountryByCode(countryCode)?.phonecode || "";
    return code.replace(/[^\d]/g, "");
  }, [countryCode]);

  const handleCountrySelect = (item: { label: string; value: string }) => {
    setCountry(item.label);
    setCountryCode(item.value);

    // Reset state and city selections
    setState("");
    setCity("");

    // Clear state and city dropdown data
    setStateData([]);
    setCityData([]);

    // get the selected country's states
    const getStates = State.getStatesOfCountry(item.value);

    // Set the states dropdown data
    setStateData(
      getStates
        ? getStates.map((state: IState) => ({
            label: state.name,
            value: state.name,
            isoCode: state.isoCode,
          }))
        : [],
    );
  };

  // 🚀 **Debounced Fetch Cities Function**
  const fetchCities = useCallback(
    debounce((countryCode, stateValue) => {
      const getCities = City.getCitiesOfState(countryCode, stateValue);
      setCityData(
        getCities?.map((city: ICity) => ({
          label: city.name,
          value: city.name,
        })) || [],
      );
    }, 300),
    [],
  );

  const handleStateSelect = useCallback(
    (item: { label: string; value: string; isoCode?: string }) => {
      setState(item.value);
      if (item.isoCode) {
        setStateCode(item.isoCode);
      }
      fetchCities(countryCode, item.isoCode);
    },
    [countryCode, fetchCities],
  );

  const { userSession } = useAppStore();

  const savedDeliveryAddress = useMemo(
    () => hasSavedDeliveryAddress(userSession?.address),
    [userSession?.address],
  );

  useEffect(() => {
    if (!userSession) return;

    setName(userSession.name);
    setEmail(userSession.email);
    setPhone(userSession.phone || "");

    if (savedDeliveryAddress) {
      populateAddressFromSession(userSession);
    }
  }, [userSession, savedDeliveryAddress]);

  const populateAddressFromSession = async (session: UserSession) => {
    setDeliveryAddress(session.address.address_line);
    setZipCode(session.address.zip);

    const countryItem = Country.getAllCountries().find(
      (c) => c.isoCode === session.address.countryCode,
    );
    if (!countryItem) return;

    const selectedCountry = {
      label: countryItem.name,
      value: countryItem.isoCode,
    };
    setCountry(selectedCountry.label);
    setCountryCode(selectedCountry.value);

    const states = State.getStatesOfCountry(selectedCountry.value) || [];
    const mappedStates = states.map((state: IState) => ({
      label: state.name,
      value: state.name,
      isoCode: state.isoCode,
    }));
    setStateData(mappedStates);

    const selectedState = mappedStates.find(
      (state) => state.isoCode === session.address.stateCode,
    );
    if (selectedState) {
      setState(selectedState.value);
      setStateCode(selectedState.isoCode);

      const cities =
        City.getCitiesOfState(selectedCountry.value, selectedState.isoCode) ||
        [];
      const mappedCities = cities.map((city: ICity) => ({
        label: city.name,
        value: city.name,
      }));
      setCityData(mappedCities);

      const foundCity = mappedCities.find(
        (c) => c.value === session.address.city,
      );
      if (foundCity) setCity(foundCity.value);
    }
  };

  return (
    <View style={styles.container}>
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
            handleBlur={() => handleBlur("name")}
            errorMessage={touched.name ? formErrors.name : ""}
          />
          <Input
            label="Email address"
            value={email}
            placeHolder="Enter your email address"
            onInputChange={() => null}
            disabled
            keyboardType="email-address"
            handleBlur={() => handleBlur("email")}
            errorMessage={touched.email ? formErrors.email : ""}
          />
          <Input
            label="Delivery address"
            value={address}
            placeHolder="Enter your delivery address"
            onInputChange={setDeliveryAddress}
            handleBlur={() => handleBlur("address")}
            errorMessage={touched.address ? formErrors.address : ""}
          />
          <CustomSelectPicker
            data={transformedCountries}
            placeholder="Select country of residence"
            value={countryCode}
            handleSetValue={handleCountrySelect}
            label="Country of residence"
            search={true}
            searchPlaceholder="Search Country"
            dropdownPosition="top"
          />
          <CustomSelectPicker
            data={stateData}
            placeholder="Select state of residence"
            value={state}
            handleSetValue={handleStateSelect}
            disable={!countryCode}
            label="State of residence"
            search={true}
            searchPlaceholder="Search State"
            dropdownPosition="top"
          />
          <CustomSelectPicker
            data={cityData}
            placeholder="Select city"
            value={city}
            disable={!state}
            handleSetValue={(item) => {
              setCity(item.value);
            }}
            label="City"
            search={true}
            searchPlaceholder="Search City"
            dropdownPosition="top"
          />
          <Input
            label="Zip Code"
            value={zipCode}
            placeHolder="123456"
            onInputChange={setZipCode}
            keyboardType="number-pad"
            handleBlur={() => handleBlur("zipCode")}
            errorMessage={touched.zipCode ? formErrors.zipCode : ""}
          />
          <Input
            label="Phone number"
            value={phone}
            placeHolder={phoneCode ? `+${phoneCode}...` : "+1234567890"}
            onInputChange={setPhone}
            keyboardType="phone-pad"
            handleBlur={() => handleBlur("phone")}
            errorMessage={touched.phone ? formErrors.phone : ""}
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
        price={artworkPrice}
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
    marginTop: 0,
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
