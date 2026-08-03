import { View } from "react-native";
import React, { useMemo, useState } from "react";

import { useIndividualAuthRegisterStore } from "#store/auth/register/IndividualAuthRegisterStore";
import { Country, ICountry } from "country-state-city";
import { useAddressForm } from "#hooks/useAddressForm";
import { useLocationSelection } from "#hooks/useLocationSelection";
import { useAddressVerification } from "#hooks/useAddressVerification";
import { AddressFormFields } from "#components/register/AddressFormFields";

import { AddressVerificationActions } from "#components/register/AddressVerificationActions";

const IndividualAddressVerification = () => {

  const transformedCountries = useMemo(
    () =>
      Country.getAllCountries().map((item: ICountry) => ({
        value: item.isoCode,
        label: item.name,
      })),
    [],
  );

  const {
    pageIndex,
    setPageIndex,
    individualRegisterData,
    setAddress,
    setCity,
    setZipCode,
    setState,
    setCountry,
    setCountryCode,
    setIsLoading,
    isLoading,
    stateData,
    setStateData,
    cityData,
    setCityData,
    setStateCode,
  } = useIndividualAuthRegisterStore();

  const { formErrors, touched, handleBlur, checkIsFormValid } =
    useAddressForm({ ...individualRegisterData.address });

  const { handleCountrySelect, handleStateSelect } = useLocationSelection(
    {
      countryCode: individualRegisterData.address.countryCode,
      state: individualRegisterData.address.state,
    },
    {
      setState,
      setStateCode,
      setCity,
      setCountry,
      setCountryCode,
      setStateData,
      setCityData,
    },
  );

  const { handleVerifyAddress } = useAddressVerification(
    setIsLoading,
    pageIndex,
    setPageIndex
  );

  const handleSubmit = () => {
    handleVerifyAddress(individualRegisterData.address, "", "delivery");
  };

  return (
    <View>
      <AddressFormFields
        countryData={transformedCountries}
        stateData={stateData}
        cityData={cityData}
        addressData={individualRegisterData.address}
        formErrors={formErrors}
        touched={touched}
        onBlur={handleBlur}
        onCountrySelect={handleCountrySelect}
        onStateSelect={handleStateSelect}
        onCitySelect={(item) => setCity(item.value)}
        onAddressChange={setAddress}
        onZipChange={setZipCode}
        addressLabel="Collector's Address"
        addressPlaceholder="Input your residential address here"
      />

      <AddressVerificationActions
        isLoading={isLoading}
        isDisabled={!checkIsFormValid()}
        onBack={() => setPageIndex(pageIndex - 1)}
        onSubmit={handleSubmit}
      />

    </View>
  );
};

export default IndividualAddressVerification;
