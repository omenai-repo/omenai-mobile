import { View } from "react-native";
import React, { useMemo, useState } from "react";
import tw from "twrnc";
import { useArtistAuthRegisterStore } from "store/auth/register/ArtistAuthRegisterStore";
import BackFormButton from "components/buttons/BackFormButton";
import FittedBlackButton from "components/buttons/FittedBlackButton";
import AuthModal from "components/auth/AuthModal";
import { checkMarkIcon, errorIcon } from "utils/SvgImages";
import { artist_countries_codes_currency } from "data/artist_countries_codes_currency";
import { useAddressForm } from "hooks/useAddressForm";
import { useLocationSelection } from "hooks/useLocationSelection";
import { useAddressVerification } from "hooks/useAddressVerification";
import { AddressTooltip } from "components/general/AddressTooltip";
import { AddressFormFields } from "components/register/AddressFormFields";

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

      <View style={tw`flex-row mt-10 items-center justify-between`}>
        <BackFormButton handleBackClick={() => setPageIndex(pageIndex - 1)} />
        <FittedBlackButton
          isLoading={isLoading}
          value="Verify Address"
          isDisabled={!checkIsFormValid(artistRegisterData.address, artistRegisterData.phone)}
          onClick={handleSubmit}
          style={tw`h-11`}
        />
      </View>

      <AddressTooltip
        showToolTip={showToolTip}
        setShowToolTip={setShowToolTip}
        tooltipText="We need your home address to properly verify shipping designation"
      />

      <AuthModal
        modalVisible={showModal}
        setModalVisible={setShowModal}
        icon={addressVerified ? checkMarkIcon : errorIcon}
        text={
          addressVerified
            ? "Your Address has been verified succesfully"
            : "Your Address could not be verified. Try again."
        }
        btn1Text="Go Back"
        btn2Text={addressVerified ? "Proceed" : "Try Again"}
        onPress1={handleModalGoBack}
        onPress2={() => {
          if (addressVerified) {
            handleModalProceed();
          } else {
            setShowModal(false);
            handleSubmit();
          }
        }}
      />
    </View>
  );
};

export default ArtistHomeAddressVerification;
