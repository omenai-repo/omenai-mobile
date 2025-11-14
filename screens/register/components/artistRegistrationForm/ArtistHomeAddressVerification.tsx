import { View } from "react-native";
import React, { useMemo, useState } from "react";
import { useArtistAuthRegisterStore } from "store/auth/register/ArtistAuthRegisterStore";

import { artist_countries_codes_currency } from "data/artist_countries_codes_currency";
import { useAddressForm } from "hooks/useAddressForm";
import { useLocationSelection } from "hooks/useLocationSelection";
import { useAddressVerification } from "hooks/useAddressVerification";
import { AddressTooltip } from "components/general/AddressTooltip";
import { AddressFormFields } from "components/register/AddressFormFields";
import { AddressVerificationModal } from "components/register/AddressVerificationModal";
import { AddressVerificationActions } from "components/register/AddressVerificationActions";

const ArtistHomeAddressVerification = () => {
  const [showToolTip, setShowToolTip] = useState(false);

  const transformedCountries = useMemo(
    () =>
      artist_countries_codes_currency.map((item) => ({
        value: item.alpha2,
        label: item.name,
        currency: item.currency,
      })),
    []
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

  const { formErrors, handleValidationChecks, checkIsFormValid } = useAddressForm();

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
    handleVerifyAddress(artistRegisterData.address, artistRegisterData.phone, "pickup");
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
        onCountrySelect={handleCountrySelect}
        onStateSelect={handleStateSelect}
        onCitySelect={(item) => setCity(item.value)}
        onAddressChange={(text) => {
          setHomeAddress(text);
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
        addressLabel="Home Address"
        addressPlaceholder="Input your home address here"
      />

      <AddressVerificationActions
        isLoading={isLoading}
        isDisabled={!checkIsFormValid(artistRegisterData.address, artistRegisterData.phone)}
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
      />
    </View>
  );
};

export default ArtistHomeAddressVerification;
