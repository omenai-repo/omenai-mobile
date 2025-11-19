import { View } from "react-native";
import React from "react";
import tw from "twrnc";
import Input from "components/inputs/Input";
import CustomSelectPicker from "components/inputs/CustomSelectPicker";

interface AddressFormFieldsProps {
  countryData: { label: string; value: string; currency?: string }[];
  stateData: { label: string; value: string; isoCode?: string }[];
  cityData: { label: string; value: string }[];
  addressData: {
    countryCode: string;
    state: string;
    city: string;
    address_line: string;
    zip: string;
  };
  phone?: string;
  formErrors: Partial<AddressTypes & { phone: string }>;
  onCountrySelect: (item: { label: string; value: string; currency?: string }) => void;
  onStateSelect: (item: { label: string; value: string; isoCode?: string }) => void;
  onCitySelect: (item: { label: string; value: string }) => void;
  onAddressChange: (text: string) => void;
  onZipChange: (text: string) => void;
  onPhoneChange?: (text: string) => void;
  addressLabel?: string;
  addressPlaceholder?: string;
  countryLabel?: string;
  stateLabel?: string;
}

export const AddressFormFields = ({
  countryData,
  stateData,
  cityData,
  addressData,
  phone,
  formErrors,
  onCountrySelect,
  onStateSelect,
  onCitySelect,
  onAddressChange,
  onZipChange,
  onPhoneChange,
  addressLabel = "Address",
  addressPlaceholder = "Input your address here",
  countryLabel = "Country of residence",
  stateLabel = "State of residence",
}: AddressFormFieldsProps) => {
  return (
    <>
      <View style={tw`mb-5`}>
        <CustomSelectPicker
          data={countryData}
          placeholder={`Select ${countryLabel.toLowerCase()}`}
          value={addressData.countryCode}
          handleSetValue={onCountrySelect}
          label={countryLabel}
          search={true}
          searchPlaceholder="Search Country"
          dropdownPosition="bottom"
        />
      </View>

      <View style={tw`mb-5`}>
        <CustomSelectPicker
          data={stateData}
          placeholder={`Select ${stateLabel.toLowerCase()}`}
          value={addressData.state}
          handleSetValue={onStateSelect}
          disable={!addressData.countryCode}
          label={stateLabel}
          search={true}
          searchPlaceholder="Search State"
          dropdownPosition="top"
        />
      </View>

      <Input
        label={addressLabel}
        keyboardType="default"
        onInputChange={onAddressChange}
        placeHolder={addressPlaceholder}
        value={addressData.address_line}
        errorMessage={formErrors?.address_line}
      />

      <View style={tw`flex-row items-center gap-[30px] my-5`}>
        <View style={tw`flex-grow`}>
          <CustomSelectPicker
            data={cityData}
            placeholder="Select city"
            value={addressData.city}
            disable={!addressData.state}
            handleSetValue={onCitySelect}
            label="City"
            search={true}
            searchPlaceholder="Search City"
            dropdownPosition="top"
          />
        </View>
        <Input
          label="Zip Code"
          keyboardType="default"
          onInputChange={onZipChange}
          placeHolder="Zip Code"
          value={addressData.zip}
          errorMessage={formErrors?.zip}
        />
      </View>

      {onPhoneChange && (
        <Input
          label="Phone number"
          keyboardType="phone-pad"
          onInputChange={onPhoneChange}
          placeHolder="+12345678990"
          value={phone || ""}
          errorMessage={formErrors?.phone}
        />
      )}
    </>
  );
};
