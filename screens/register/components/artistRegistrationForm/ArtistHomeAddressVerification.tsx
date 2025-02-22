import { View, Text, Pressable, useWindowDimensions } from "react-native";
import React, { useEffect, useState } from "react";
import tw from "twrnc";
import Input from "components/inputs/Input";
import { useArtistAuthRegisterStore } from "store/auth/register/ArtistAuthRegisterStore";
import { validate } from "lib/validations/validatorGroup";
import CustomSelectPicker from "components/inputs/CustomSelectPicker";
import { country_codes } from "json/country_alpha_2_codes";
import NextButton from "components/buttons/NextButton";
import BackFormButton from "components/buttons/BackFormButton";
import { verifyAddress } from "services/register/verifyAddress";
import FittedBlackButton from "components/buttons/FittedBlackButton";
import { useModalStore } from "store/modal/modalStore";

const transformedCountries = country_codes.map((item) => ({
  value: item.key,
  label: item.name,
}));

const ArtistHomeAddressVerification = () => {
  const { height, width } = useWindowDimensions();
  const [formErrors, setFormErrors] = useState<Partial<ArtistSignupData>>({
    address: {
      address_line: "",
      city: "",
      country: "",
      state: "",
      zip: "",
    },
  });
  const [showToolTip, setShowToolTip] = useState(false);

  const { updateModal } = useModalStore();

  const {
    pageIndex,
    setPageIndex,
    artistRegisterData,
    setHomeAddress,
    setCity,
    setZipCode,
    setCountry,
    setIsLoading,
    isLoading,
    clearState,
  } = useArtistAuthRegisterStore();

  const checkIsDisabled = () => {
    // Check if there are no error messages and all input fields are filled
    const isFormValid = Object.values(formErrors).every(
      (error) => error === ""
    );
    const areAllFieldsFilled = Object.values({
      address_line: artistRegisterData?.address?.address_line,
      city: artistRegisterData?.address?.city,
      zip: artistRegisterData?.address?.zip,
      country: artistRegisterData?.address?.country,
    }).every((value) => value !== "");

    return !(isFormValid && areAllFieldsFilled);
  };

  const handleValidationChecks = (
    label: string,
    value: string,
    confirm?: string
  ) => {
    const { success, errors }: { success: boolean; errors: string[] | [] } =
      validate(value, label, confirm);
    if (!success) {
      setFormErrors((prev) => ({ ...prev, [label]: errors[0] }));
    } else {
      setFormErrors((prev) => ({ ...prev, [label]: "" }));
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const payload = {
        type: "pickup",
        countyName: artistRegisterData.address.address_line,
        cityName: artistRegisterData.address.city,
        postalCode: artistRegisterData.address.zip,
        countryCode: artistRegisterData.address.country,
      };

      const response = await verifyAddress(payload);

      setIsLoading(false);

      if (response?.isOk) {
        if (
          response?.body?.data?.address &&
          response.body.data.address.length !== 0
        ) {
          clearState();
          setPageIndex(pageIndex + 1);
        } else {
          updateModal({
            message:
              response?.body?.data?.detail ||
              "Invalid address, please try again.",
            modalType: "error",
            showModal: true,
          });
        }
      } else {
        updateModal({
          message:
            response?.body?.message ||
            "Something went wrong, please try again.",
          modalType: "error",
          showModal: true,
        });
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error verifying address:", error);
      updateModal({
        message: "Network error, please check your connection and try again.",
        modalType: "error",
        showModal: true,
      });
    }
  };

  return (
    <View style={tw``}>
      <Input
        label="Home Address"
        keyboardType="default"
        onInputChange={setHomeAddress}
        placeHolder="Input your home address here"
        value={artistRegisterData?.address?.address_line}
        handleBlur={() =>
          handleValidationChecks(
            "general",
            artistRegisterData?.address?.address_line
          )
        }
        errorMessage={formErrors.address?.address_line}
      />

      <View style={tw`flex-row items-center gap-[30px] mt-[20px]`}>
        <Input
          label="City"
          keyboardType="default"
          onInputChange={setCity}
          placeHolder="City"
          value={artistRegisterData?.address?.city}
          handleBlur={() =>
            handleValidationChecks("general", artistRegisterData?.address?.city)
          }
          errorMessage={formErrors.address?.city}
        />
        <Input
          label="Zip Code"
          keyboardType="default"
          onInputChange={setZipCode}
          placeHolder="Zip Code"
          value={artistRegisterData?.address?.zip}
          handleBlur={() =>
            handleValidationChecks("general", artistRegisterData?.address?.zip)
          }
          errorMessage={formErrors.address?.zip}
        />
      </View>

      <View style={tw`mt-[20px]`}>
        <CustomSelectPicker
          data={transformedCountries}
          placeholder="Select country of residence"
          value={artistRegisterData.address.address_line}
          handleSetValue={setCountry}
          label="Country of residence"
          search={true}
          searchPlaceholder="Search Country"
        />
      </View>

      <View style={tw`flex-row mt-[40px]`}>
        <BackFormButton handleBackClick={() => setPageIndex(pageIndex - 1)} />
        <View style={{ flex: 1 }} />
        <FittedBlackButton
          isLoading={isLoading}
          value="Verify Address"
          // isDisabled={checkIsDisabled()}
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
    </View>
  );
};

export default ArtistHomeAddressVerification;
