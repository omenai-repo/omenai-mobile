import { View } from "react-native";
import React, { useMemo } from "react";
import { useArtistAuthRegisterStore } from "#store/auth/register/ArtistAuthRegisterStore";

import { artist_countries_codes_currency } from "#data/artist_countries_codes_currency";
import { useAddressForm } from "#hooks/useAddressForm";
import { useLocationSelection } from "#hooks/useLocationSelection";
import { useAddressVerification } from "#hooks/useAddressVerification";
import { AddressFormFields } from "#components/register/AddressFormFields";

import { AddressVerificationActions } from "#components/register/AddressVerificationActions";

const ArtistHomeAddressVerification = () => {

  const transformedCountries = useMemo(
    () =>
      [...artist_countries_codes_currency]
        .sort((a, b) =>
          a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
        )
        .map((item) => ({
          value: item.alpha2,
          label: item.name,
          currency: item.currency,
        })),
    [],
  );

  const {
    pageIndex,
    setPageIndex,
    artistRegisterData,
    setHomeAddress,
    setPhone,
    setCity,
    setZipCode,
    setCountry,
    setCountryCode,
    setState,
    setIsLoading,
    isLoading,
    stateData,
    setStateData,
    cityData,
    setCityData,
    setStateCode,
    setBaseCurrency,
  } = useArtistAuthRegisterStore();

  const { formErrors, touched, handleBlur, checkIsFormValid } = useAddressForm({
    ...artistRegisterData.address,
    phone: artistRegisterData.phone,
  });

  const { handleCountrySelect, handleStateSelect } = useLocationSelection(
    {
      countryCode: artistRegisterData.address.countryCode,
      state: artistRegisterData.address.state,
    },
    {
      setState,
      setStateCode,
      setCity,
      setCountry,
      setCountryCode,
      setStateData,
      setCityData,
      setBaseCurrency,
    },
  );

  const { handleVerifyAddress } = useAddressVerification(
    setIsLoading,
    pageIndex,
    setPageIndex,
  );

  const handleSubmit = () => {
    handleVerifyAddress(
      artistRegisterData.address,
      artistRegisterData.phone,
      "pickup",
    );
  };

  return (
    <View>
      <AddressFormFields
        countryData={transformedCountries}
        stateData={stateData}
        cityData={cityData}
        addressData={artistRegisterData.address}
        phone={artistRegisterData.phone}
        formErrors={formErrors}
        touched={touched}
        onBlur={handleBlur}
        onCountrySelect={handleCountrySelect}
        onStateSelect={handleStateSelect}
        onCitySelect={(item) => setCity(item.value)}
        onAddressChange={setHomeAddress}
        onZipChange={setZipCode}
        onPhoneChange={setPhone}
        addressLabel="Home Address"
        addressPlaceholder="Input your home address here"
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

export default ArtistHomeAddressVerification;
