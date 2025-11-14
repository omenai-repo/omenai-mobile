import { View } from "react-native";
import React, { useMemo, useState } from "react";
import tw from "twrnc";
import Input from "components/inputs/Input";
import CustomSelectPicker from "components/inputs/CustomSelectPicker";
import BackFormButton from "components/buttons/BackFormButton";
import FittedBlackButton from "components/buttons/FittedBlackButton";
import AuthModal from "components/auth/AuthModal";
import { checkMarkIcon, errorIcon } from "utils/SvgImages";
import { useIndividualAuthRegisterStore } from "store/auth/register/IndividualAuthRegisterStore";
import { Country, ICountry } from "country-state-city";
import { useAddressForm } from "hooks/useAddressForm";
import { useLocationSelection } from "hooks/useLocationSelection";
import { useAddressVerification } from "hooks/useAddressVerification";
import { AddressTooltip } from "components/general/AddressTooltip";

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
    <View style={tw``}>
      <View style={tw`mb-5`}>
        <CustomSelectPicker
          data={transformedCountries}
          placeholder="Select country of residence"
          value={individualRegisterData.address.countryCode}
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
          placeholder="Select state of residence"
          value={individualRegisterData.address.state}
          handleSetValue={handleStateSelect}
          disable={!individualRegisterData.address.countryCode}
          label="State of residence"
          search={true}
          searchPlaceholder="Search State"
          dropdownPosition="top"
        />
      </View>

      <Input
        label="Collector's Address"
        keyboardType="default"
        onInputChange={(text) => {
          setAddress(text);
          handleValidationChecks("general", text);
        }}
        placeHolder="Input your gallery address here"
        value={individualRegisterData?.address?.address_line}
        errorMessage={formErrors?.address_line}
      />

      <View style={tw`flex-row items-center gap-[30px] my-5`}>
        <View style={tw`flex-grow`}>
          <CustomSelectPicker
            data={cityData}
            placeholder="Select city"
            value={individualRegisterData.address.city}
            disable={!individualRegisterData.address.state}
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
          value={individualRegisterData?.address?.zip}
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
        value={individualRegisterData?.phone}
        errorMessage={formErrors?.phone}
      />

      <View style={tw`flex-row mt-10 justify-between items-center`}>
        <BackFormButton handleBackClick={() => setPageIndex(pageIndex - 1)} />
        <FittedBlackButton
          isLoading={isLoading}
          value="Verify Address"
          isDisabled={
            !checkIsFormValid(individualRegisterData.address, individualRegisterData.phone)
          }
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

export default IndividualAddressVerification;
