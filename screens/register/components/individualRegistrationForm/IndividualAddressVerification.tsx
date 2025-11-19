import { View } from "react-native";
import React, { useMemo, useState } from "react";

import { useIndividualAuthRegisterStore } from "store/auth/register/IndividualAuthRegisterStore";
import { Country, ICountry } from "country-state-city";
import { useAddressForm } from "hooks/useAddressForm";
import { useLocationSelection } from "hooks/useLocationSelection";
import { useAddressVerification } from "hooks/useAddressVerification";
import { AddressTooltip } from "components/general/AddressTooltip";
import { AddressFormFields } from "components/register/AddressFormFields";
import { AddressVerificationModal } from "components/register/AddressVerificationModal";
import { AddressVerificationActions } from "components/register/AddressVerificationActions";

const IndividualAddressVerification = () => {
  const [showToolTip, setShowToolTip] = useState(false);

  const transformedCountries = useMemo(
    () =>
      Country.getAllCountries().map((item: ICountry) => ({
        value: item.isoCode,
        label: item.name,
      })),
    []
  );

  const {
    pageIndex,
    setPageIndex,
    individualRegisterData,
    setAddress,
    setCity,
    setZipCode,
    setPhone,
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

  const { formErrors, handleValidationChecks, checkIsFormValid } = useAddressForm();

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
    handleVerifyAddress(individualRegisterData.address, individualRegisterData.phone, "delivery");
  };

  return (
    <View>
      <AddressFormFields
        countryData={transformedCountries}
        stateData={stateData}
        cityData={cityData}
        addressData={individualRegisterData.address}
        phone={individualRegisterData.phone}
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
        addressLabel="Collector's Address"
        addressPlaceholder="Input your gallery address here"
      />

      <AddressVerificationActions
        isLoading={isLoading}
        isDisabled={!checkIsFormValid(individualRegisterData.address, individualRegisterData.phone)}
        onBack={() => setPageIndex(pageIndex - 1)}
        onSubmit={handleSubmit}
      />

      <AddressTooltip
        showToolTip={showToolTip}
        setShowToolTip={setShowToolTip}
        tooltipText="We need your home address to properly verify shipping designation"
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

export default IndividualAddressVerification;
