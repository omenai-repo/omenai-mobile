import { View } from "react-native";
import React, { useMemo, useState } from "react";
import tw from "twrnc";
import { country_codes } from "json/country_alpha_2_codes";
import BackFormButton from "components/buttons/BackFormButton";
import FittedBlackButton from "components/buttons/FittedBlackButton";
import AuthModal from "components/auth/AuthModal";
import { checkMarkIcon, errorIcon } from "utils/SvgImages";
import { useGalleryAuthRegisterStore } from "store/auth/register/GalleryAuthRegisterStore";
import { useAddressForm } from "hooks/useAddressForm";
import { useLocationSelection } from "hooks/useLocationSelection";
import { useAddressVerification } from "hooks/useAddressVerification";
import { AddressTooltip } from "components/general/AddressTooltip";
import { AddressFormFields } from "components/register/AddressFormFields";

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
    <View style={tw``}>
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

      <View style={tw`flex-row mt-10 justify-between items-center`}>
        <BackFormButton handleBackClick={() => setPageIndex(pageIndex - 1)} />
        <FittedBlackButton
          isLoading={isLoading}
          value="Verify Address"
          isDisabled={!checkIsFormValid(galleryRegisterData.address, galleryRegisterData.phone)}
          onClick={handleSubmit}
          style={tw`h-11`}
        />
      </View>

      <AddressTooltip
        showToolTip={showToolTip}
        setShowToolTip={setShowToolTip}
        tooltipText="We need your gallery address to properly verify shipping designation"
      />

      <AuthModal
        modalVisible={showModal}
        setModalVisible={setShowModal}
        icon={addressVerified ? checkMarkIcon : errorIcon}
        text={
          addressVerified
            ? "Your account has been verified succesfully"
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

export default GalleryAddressVerification;
