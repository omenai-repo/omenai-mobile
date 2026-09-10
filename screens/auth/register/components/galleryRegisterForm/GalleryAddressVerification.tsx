import { View } from "react-native";
import React, { useMemo } from "react";
import { country_codes } from "#json/country_alpha_2_codes";

import { useGalleryAuthRegisterStore } from "#store/auth/register/GalleryAuthRegisterStore";
import { useAddressForm } from "#hooks/useAddressForm";
import { useLocationSelection } from "#hooks/useLocationSelection";
import { useAddressVerification } from "#hooks/useAddressVerification";
import { AddressFormFields } from "#components/register/AddressFormFields";

import { AddressVerificationActions } from "#components/register/AddressVerificationActions";

const GalleryAddressVerification = () => {
  const transformedCountries = useMemo(
    () =>
      country_codes.map((item) => ({
        label: item.name,
        value: item.key,
      })),
    [],
  );

  const {
    pageIndex,
    setPageIndex,
    galleryRegisterData,
    setAddress,
    setCity,
    setPhone,
    setZipCode,
    setCountry,
    setCountryCode,
    setState,
    setStateCode,
    setIsLoading,
    stateData,
    setStateData,
    isLoading,
    cityData,
    setCityData,
  } = useGalleryAuthRegisterStore();

  const { formErrors, touched, handleBlur, checkIsFormValid } = useAddressForm({
    ...galleryRegisterData.address,
    phone: galleryRegisterData.phone,
  });

  const { handleCountrySelect, handleStateSelect } = useLocationSelection(
    {
      countryCode: galleryRegisterData.address.countryCode,
      state: galleryRegisterData.address.state,
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
    setPageIndex,
  );

  const handleSubmit = () => {
    handleVerifyAddress(
      galleryRegisterData.address,
      galleryRegisterData.phone,
      "pickup",
    );
  };

  return (
    <View>
      <AddressFormFields
        countryData={transformedCountries}
        stateData={stateData}
        cityData={cityData}
        addressData={galleryRegisterData.address}
        phone={galleryRegisterData.phone}
        formErrors={formErrors}
        touched={touched}
        onBlur={handleBlur}
        onCountrySelect={handleCountrySelect}
        onStateSelect={handleStateSelect}
        onCitySelect={(item) => setCity(item.value)}
        onAddressChange={setAddress}
        onZipChange={setZipCode}
        onPhoneChange={setPhone}
        addressLabel="Gallery Address"
        addressPlaceholder="Input your gallery address here"
        countryLabel="Country of operation"
        stateLabel="State of operation"
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

export default GalleryAddressVerification;
