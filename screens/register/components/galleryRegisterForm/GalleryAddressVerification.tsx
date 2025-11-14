import { View } from "react-native";
import React, { useMemo, useState } from "react";
import tw from "twrnc";
import Input from "components/inputs/Input";
import CustomSelectPicker from "components/inputs/CustomSelectPicker";
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
      <View style={tw`mb-[20px]`}>
        <CustomSelectPicker
          data={transformedCountries}
          placeholder="Select country of operation"
          value={galleryRegisterData.address.countryCode}
          handleSetValue={handleCountrySelect}
          label="Country of operation"
          search={true}
          searchPlaceholder="Search Country"
          dropdownPosition="bottom"
        />
      </View>

      <View style={tw`mb-[20px]`}>
        <CustomSelectPicker
          data={stateData}
          placeholder="Select state"
          value={galleryRegisterData.address.state}
          handleSetValue={handleStateSelect}
          disable={!galleryRegisterData.address.countryCode}
          label="State of operation"
          search={true}
          searchPlaceholder="Search State"
          dropdownPosition="top"
        />
      </View>

      <Input
        label="Gallery Address"
        keyboardType="default"
        onInputChange={(text) => {
          setAddress(text);
          handleValidationChecks("general", text);
        }}
        placeHolder="Input your gallery address here"
        value={galleryRegisterData?.address?.address_line}
        errorMessage={formErrors?.address_line}
      />

      <View style={tw`flex-row items-center gap-[30px] my-[20px]`}>
        <View style={tw`flex-1`}>
          <CustomSelectPicker
            data={cityData}
            placeholder="Select city"
            value={galleryRegisterData.address.city}
            disable={!galleryRegisterData.address.state}
            handleSetValue={(item) => {
              setCity(item.value);
            }}
            label="City"
            search={true}
            searchPlaceholder="Search City"
            dropdownPosition="top"
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
          value={galleryRegisterData?.address?.zip}
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
        value={galleryRegisterData?.phone}
        errorMessage={formErrors?.phone}
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
