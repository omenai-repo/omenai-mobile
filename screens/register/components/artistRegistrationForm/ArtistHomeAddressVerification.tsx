import { View, Text, Pressable, useWindowDimensions } from "react-native";
import React, { useEffect, useState } from "react";
import tw from "twrnc";
import Input from "components/inputs/Input";
import { useArtistAuthRegisterStore } from "store/auth/register/ArtistAuthRegisterStore";
import { validate } from "lib/validations/validatorGroup";
import CustomSelectPicker from "components/inputs/CustomSelectPicker";
import BackFormButton from "components/buttons/BackFormButton";
import { verifyAddress } from "services/register/verifyAddress";
import FittedBlackButton from "components/buttons/FittedBlackButton";
import { useModalStore } from "store/modal/modalStore";
import { debounce } from "lodash";
import AuthModal from "components/auth/AuthModal";
import { checkMarkIcon, errorIcon } from "utils/SvgImages";
import { artist_countries_codes_currency } from "data/artist_countries_codes_currency";
import { country_and_states } from "data/country_and_states";

const transformedCountries = artist_countries_codes_currency.map((item) => ({
  label: item.name,
  value: item.alpha2,
}));

const ArtistHomeAddressVerification = () => {
  const { height, width } = useWindowDimensions();
  const [formErrors, setFormErrors] = useState<Partial<AddressTypes>>({
    address_line: "",
    city: "",
    country: "",
    state: "",
    zip: "",
    countryCode: "",
  });
  const [showToolTip, setShowToolTip] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [addressVerified, setAddressVerified] = useState(false);

  const { updateModal } = useModalStore();

  const {
    pageIndex,
    setPageIndex,
    artistRegisterData,
    setHomeAddress,
    setCity,
    setZipCode,
    setCountry,
    setCountryCode,
    setState,
    setIsLoading,
    isLoading,
    stateData,
    setStateData,
  } = useArtistAuthRegisterStore();

  const handleCountrySelect = (item: { label: string; value: string }) => {
    setCountry(item.label);
    setCountryCode(item.value);

    // Find the selected country's states
    const foundCountry = country_and_states.find(
      (country) => country.country === item.label
    );

    // Set the states dropdown data
    setStateData(
      foundCountry
        ? foundCountry.states.map((state) => ({ label: state, value: state }))
        : []
    );
  };

  const checkIsDisabled = () => {
    // Check if there are no error messages and all input fields are filled
    const isFormValid =
      formErrors && Object.values(formErrors).every((error) => error === "");
    const areAllFieldsFilled = Object.values({
      address_line: artistRegisterData?.address?.address_line,
      city: artistRegisterData?.address?.city,
      zip: artistRegisterData?.address?.zip,
      country: artistRegisterData?.address?.country,
      state: artistRegisterData?.address?.state,
    }).every((value) => value !== "");

    return !(isFormValid && areAllFieldsFilled);
  };

  const handleValidationChecks = debounce(
    (label: string, value: string, confirm?: string) => {
      // Clear error if the input is empty
      if (value.trim() === "") {
        setFormErrors((prev) => ({ ...prev, [label]: "" }));
        return;
      }

      const { success, errors } = validate(value, label, confirm);
      setFormErrors((prev) => ({
        ...prev,
        [label]: errors.length > 0 ? errors[0] : "",
      }));
    },
    500
  ); // ✅ Delay validation by 500ms

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const payload = {
        type: "pickup",
        countyName: artistRegisterData.address.city,
        cityName: artistRegisterData.address.state,
        postalCode: artistRegisterData.address.zip,
        countryCode: artistRegisterData.address.countryCode,
      };

      const response = await verifyAddress(payload);

      setIsLoading(false);

      if (response?.isOk) {
        if (
          response?.body?.data?.address &&
          response.body.data.address.length !== 0
        ) {
          setShowModal(true);
          setAddressVerified(true);
        } else {
          setShowModal(true);
          setAddressVerified(false);
        }
      } else {
        setShowModal(true);
        setAddressVerified(false);
      }
    } catch (error) {
      console.error("Error verifying address:", error);
      updateModal({
        message: "Network error, please check your connection and try again.",
        modalType: "error",
        showModal: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={tw``}>
      <View style={tw`mb-[20px]`}>
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

      <View style={tw`flex-row items-center gap-[30px] mt-[20px]`}>
        <Input
          label="City"
          keyboardType="default"
          onInputChange={(text) => {
            setCity(text);
            handleValidationChecks("general", text);
          }}
          placeHolder="City"
          value={artistRegisterData?.address?.city}
          errorMessage={formErrors?.city}
        />
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

      <View style={tw`mt-[20px]`}>
        <CustomSelectPicker
          data={stateData}
          placeholder="Select state"
          value={artistRegisterData.address.state}
          handleSetValue={(item) => {
            setState(item.value);
          }}
          disable={!artistRegisterData.address.country}
          label="State of residence"
          search={true}
          searchPlaceholder="Search state"
          dropdownPosition="top"
        />
      </View>

      <View style={tw`flex-row mt-[40px]`}>
        <BackFormButton handleBackClick={() => setPageIndex(pageIndex - 1)} />
        <View style={{ flex: 1 }} />
        <FittedBlackButton
          isLoading={isLoading}
          height={50}
          value="Verify Address"
          isDisabled={checkIsDisabled()}
          onClick={handleSubmit}
        />
      </View>

      <Pressable
        onPress={() => setShowToolTip(!showToolTip)}
        style={tw.style(
          `rounded-full h-[45px] w-[45px] justify-center items-center bg-[#000]`,
          {
            top: height / 8,
            alignSelf: "flex-end",
          }
        )}
      >
        <Text style={tw`text-[#FFFFFF] text-[20px]`}>?</Text>
      </Pressable>
      {showToolTip && (
        <View
          style={tw.style(`mr-[80px]`, {
            top: height / 13,
            width: width / 2,
            alignSelf: "flex-end",
          })}
        >
          <View style={tw`rounded-[12px] bg-[#111111] py-[10px] px-[15px]`}>
            <Text
              style={tw`text-[10px] text-[#FFFFFF] text-center leading-[15px]`}
            >
              We need your home address to {`\n`} properly verify shipping
              designation
            </Text>
          </View>
          <View
            style={tw`w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[20px] rounded-[5px] border-l-[#111111] absolute right-[-17px] top-[15px]`}
          />
        </View>
      )}
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
        onPress1={() => {
          setShowModal(false);
          setPageIndex(pageIndex - 1);
        }}
        onPress2={() => {
          if (addressVerified) {
            setPageIndex(pageIndex + 1);
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
