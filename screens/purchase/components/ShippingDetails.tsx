import { StyleSheet, Text, View } from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { colors } from 'config/colors.config';
import CustomPicker from 'components/general/CustomPicker';
import Input from 'components/inputs/Input';
import CustomChecker from 'components/inputs/CustomChecker';
import CustomSelectPicker from 'components/inputs/CustomSelectPicker';
import SummaryContainer from './SummaryContainer';
import { useOrderSummaryStore } from 'store/orders/OrderSummaryStore';
import { validate } from 'lib/validations/validatorGroup';
import { utils_getAsyncData } from 'utils/utils_asyncStorage';
import { Country, State, City, ICountry, IState, ICity } from 'country-state-city';
import { debounce } from 'lodash';
import { useAppStore } from 'store/app/appStore';

const deliveryOptions = [
  'Shipping',
  // 'Pickup'
];

type deliveryModeTypes = 'Shipping' | 'Pickup';

export default function ShippingDetails({ data: { pricing } }: { data: artworkOrderDataTypes }) {
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    address: '',
    zipCode: '',
    city: '',
    state: '',
  });

  const transformedCountries = useMemo(
    () =>
      Country.getAllCountries().map((item: ICountry) => ({
        value: item.isoCode,
        label: item.name,
      })),
    [],
  );

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

  const handleCountrySelect = (item: { label: string; value: string }) => {
    setCountry(item.label);
    setCountryCode(item.value);

    // Reset state and city selections
    setState('');
    setCity('');

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

  // 🚀 **Handle State Selection**
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

  useEffect(() => {
    fetchUserSessionsData();
  }, [userSession]);

  const fetchUserSessionsData = async () => {
    if (userSession) {
      setName(userSession.name);
      setEmail(userSession.email);
      setDeliveryAddress(userSession.address.address_line);
    }
  };

  const checkIsDisabled = () => {
    // Check if there are no error messages and all input fields are filled
    const isFormValid = Object.values(formErrors).every((error) => error === '');
    const areAllFieldsFilled = Object.values({
      name: name,
      email: email,
      address: address,
      // country: country,
      city: city,
      state: state,
      zipCode: zipCode,
    }).every((value) => value !== '');

    return !(isFormValid && areAllFieldsFilled);
  };

  const handleValidationChecks = (label: string, value: string, confirm?: string) => {
    const { success, errors }: { success: boolean; errors: string[] | [] } = validate(
      value,
      label,
      confirm,
    );
    if (!success) {
      setFormErrors((prev) => ({ ...prev, [label]: errors[0] }));
    } else {
      setFormErrors((prev) => ({ ...prev, [label]: '' }));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleHeader}>Shipping Details</Text>
      <View style={styles.shippingDetailsContainer}>
        <Text style={{ fontSize: 16, fontWeight: 500, color: colors.grey }}>Delivery Mode</Text>
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
            handleBlur={() => handleValidationChecks('name', name)}
            errorMessage={formErrors.name}
          />
          <Input
            label="Email address"
            value={email}
            placeHolder="Enter your email address"
            onInputChange={() => null}
            disabled
            keyboardType="email-address"
            handleBlur={() => handleValidationChecks('email', email)}
            errorMessage={formErrors.email}
          />
          <Input
            label="Delivery address"
            value={address}
            placeHolder="Enter your delivery address"
            onInputChange={setDeliveryAddress}
            handleBlur={() => handleValidationChecks('address', address)}
            errorMessage={formErrors.address}
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
            handleBlur={() => handleValidationChecks('zipCode', zipCode)}
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
        price={pricing.shouldShowPrice === 'Yes' ? pricing.usd_price : 0}
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
    flexDirection: 'row',
    alignItems: 'center',
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
