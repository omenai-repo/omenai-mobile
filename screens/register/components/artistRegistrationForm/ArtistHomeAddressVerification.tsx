import { View } from "react-native";
import React, { useMemo, useState } from "react";
import tw from "twrnc";
import Input from "components/inputs/Input";
import { useArtistAuthRegisterStore } from "store/auth/register/ArtistAuthRegisterStore";
import CustomSelectPicker from "components/inputs/CustomSelectPicker";
import BackFormButton from "components/buttons/BackFormButton";
import FittedBlackButton from "components/buttons/FittedBlackButton";
import AuthModal from "components/auth/AuthModal";
import { checkMarkIcon, errorIcon } from "utils/SvgImages";
import { artist_countries_codes_currency } from "data/artist_countries_codes_currency";
import { useAddressForm } from "hooks/useAddressForm";
import { useLocationSelection } from "hooks/useLocationSelection";
import { useAddressVerification } from "hooks/useAddressVerification";
import { AddressTooltip } from "components/general/AddressTooltip";

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
      <View style={tw`mb-5`}>
        <CustomSelectPicker
          data={transformedCountries}
          placeholder="Select country of residence"
          value={artistRegisterData.address.countryCode}
          handleSetValue={handleCountrySelect}
          label="Country of residence"
          search={true}
          searchPlaceholder="Search Country"
          dropdownPosition="bottom"
        />
      </View>

      <View style={tw`mb-5`}>
        <CustomSelectPicker
          data={stateData}
          placeholder="Select state"
          value={artistRegisterData.address.state}
          handleSetValue={handleStateSelect}
          disable={!artistRegisterData.address.countryCode}
          label="State of residence"
          search={true}
          searchPlaceholder="Search state"
          dropdownPosition="bottom"
        />
      </View>

      <Input
        label="Home Address"
        keyboardType="default"
        onInputChange={(text) => {
          setHomeAddress(text);
          handleValidationChecks("general", text);
        }}
        placeHolder="Input your home address here"
        value={artistRegisterData?.address?.address_line}
        errorMessage={formErrors?.address_line}
      />

      <View style={tw`flex-row items-center gap-[30px] my-5`}>
        <View style={tw`flex-grow`}>
          <CustomSelectPicker
            data={cityData}
            placeholder="Select city"
            value={artistRegisterData.address.city}
            disable={!artistRegisterData.address.state}
            handleSetValue={(item) => {
              setCity(item.value);
            }}
            label="City"
            search={true}
            searchPlaceholder="Search City"
            dropdownPosition="bottom"
          />
        </View>
        <Input
          label="Zip Code"
          keyboardType="default"
          onInputChange={(text) => {
            setZipCode(text);
            handleValidationChecks("general", text);
          }}
          placeHolder="Zip Code"
          value={artistRegisterData?.address?.zip}
          errorMessage={formErrors?.zip}
        />
      </View>

      <Input
        label="Phone number"
        keyboardType="phone-pad"
        onInputChange={(text) => {
          setPhone(text);
          handleValidationChecks("general", text);
        }}
        placeHolder="+12345678990"
        value={artistRegisterData?.phone}
        errorMessage={formErrors?.phone}
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
