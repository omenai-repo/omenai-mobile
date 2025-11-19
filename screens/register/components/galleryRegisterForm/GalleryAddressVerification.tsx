import { View } from "react-native";
import React, { useMemo, useState } from "react";
import { country_codes } from "json/country_alpha_2_codes";

import { useGalleryAuthRegisterStore } from "store/auth/register/GalleryAuthRegisterStore";
import { useAddressForm } from "hooks/useAddressForm";
import { useLocationSelection } from "hooks/useLocationSelection";
import { useAddressVerification } from "hooks/useAddressVerification";
import { AddressTooltip } from "components/general/AddressTooltip";
import { AddressFormFields } from "components/register/AddressFormFields";
import { AddressVerificationModal } from "components/register/AddressVerificationModal";
import { AddressVerificationActions } from "components/register/AddressVerificationActions";

const GalleryAddressVerification = () => {
  const [showToolTip, setShowToolTip] = useState(false);

  const transformedCountries = useMemo(
    () =>
      country_codes.map((item) => ({
        label: item.name,
        value: item.key,
      })),
    []
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
    setIsLoading,
    stateData,
    setStateData,
    isLoading,
    cityData,
    setCityData,
  } = useGalleryAuthRegisterStore();

  const { formErrors, handleValidationChecks, checkIsFormValid } = useAddressForm();

  const { handleCountrySelect, handleStateSelect } = useLocationSelection(
    {
      countryCode: galleryRegisterData.address.countryCode,
      state: galleryRegisterData.address.state,
    },
    {
      setState,
      setCity,
      setCountry,
      setCountryCode,
      setStateData,
      setCityData,
    }
  );

  const {
    showModal,
    setShowModal,
    addressVerified,
    handleVerifyAddress,
    handleModalProceed,
    handleModalGoBack,
  } = useAddressVerification(setIsLoading, pageIndex, setPageIndex);

  const handleSubmit = () => {
    handleVerifyAddress(galleryRegisterData.address, galleryRegisterData.phone, "pickup");
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
        onCountrySelect={handleCountrySelect}
        onStateSelect={handleStateSelect}
        onCitySelect={(item) => setCity(item.value)}
        onAddressChange={(text) => {
          setAddress(text);
          handleValidationChecks("general", text);
        }}
        onZipChange={(text) => {
          setZipCode(text);
          handleValidationChecks("general", text);
        }}
        onPhoneChange={(text) => {
          setPhone(text);
          handleValidationChecks("general", text);
        }}
        addressLabel="Gallery Address"
        addressPlaceholder="Input your gallery address here"
        countryLabel="Country of operation"
        stateLabel="State of operation"
      />

      <AddressVerificationActions
        isLoading={isLoading}
        isDisabled={!checkIsFormValid(galleryRegisterData.address, galleryRegisterData.phone)}
        onBack={() => setPageIndex(pageIndex - 1)}
        onSubmit={handleSubmit}
      />

      <AddressTooltip
        showToolTip={showToolTip}
        setShowToolTip={setShowToolTip}
        tooltipText="We need your gallery address to properly verify shipping designation"
      />

      <AddressVerificationModal
        showModal={showModal}
        setShowModal={setShowModal}
        addressVerified={addressVerified}
        handleModalGoBack={handleModalGoBack}
        handleModalProceed={handleModalProceed}
        handleSubmit={handleSubmit}
        successMessage="Your account has been verified succesfully"
      />
    </View>
  );
};

export default GalleryAddressVerification;
