import { View, Text, Pressable, useWindowDimensions } from "react-native";
import React, { useState } from "react";
import tw from "twrnc";
import Input from "components/inputs/Input";
import { useArtistAuthRegisterStore } from "store/auth/register/ArtistAuthRegisterStore";
import { validate } from "lib/validations/validatorGroup";
import CustomSelectPicker from "components/inputs/CustomSelectPicker";
import { country_codes } from "json/country_alpha_2_codes";
import NextButton from "components/buttons/NextButton";

const transformedCountries = country_codes.map((item) => ({
  value: item.key,
  label: item.name,
}));

const ArtistHomeAddressVerification = () => {
  const { height, width } = useWindowDimensions();
  const [formErrors, setFormErrors] = useState<Partial<ArtistSignupData>>({
    homeAddress: "",
    city: "",
    zipCode: "",
    country: "",
  });
  const [showToolTip, setShowToolTip] = useState(false);

  const {
    pageIndex,
    setPageIndex,
    artistRegisterData,
    setHomeAddress,
    setCity,
    setZipCode,
    country,
    setCountry,
  } = useArtistAuthRegisterStore();

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

  return (
    <View style={tw``}>
      <Input
        label="Home Address"
        keyboardType="default"
        onInputChange={setHomeAddress}
        placeHolder="Input your home address here"
        value={artistRegisterData.homeAddress}
        handleBlur={() =>
          handleValidationChecks("general", artistRegisterData.homeAddress)
        }
        errorMessage={formErrors.homeAddress}
      />

      <View style={tw`flex-row items-center gap-[30px] mt-[20px]`}>
        <Input
          label="City"
          keyboardType="default"
          onInputChange={setCity}
          placeHolder="City"
          value={artistRegisterData.city}
          handleBlur={() =>
            handleValidationChecks("general", artistRegisterData.city)
          }
          errorMessage={formErrors.city}
        />
        <Input
          label="Zip Code"
          keyboardType="default"
          onInputChange={setZipCode}
          placeHolder="Zip Code"
          value={artistRegisterData.zipCode}
          handleBlur={() =>
            handleValidationChecks("general", artistRegisterData.zipCode)
          }
          errorMessage={formErrors.zipCode}
        />
      </View>

      <View style={tw`mt-[20px]`}>
        <CustomSelectPicker
          data={transformedCountries}
          placeholder="Select country of residence"
          value={country}
          handleSetValue={setCountry}
          label="Country of residence"
          search={true}
          searchPlaceholder="Search Country"
        />
      </View>

      <View style={tw`flex-row mt-[40px]`}>
        <View style={{ flex: 1 }} />
        <NextButton
          // isDisabled={checkIsDisabled()}
          isDisabled={false}
          handleButtonClick={() => setPageIndex(pageIndex + 1)}
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
