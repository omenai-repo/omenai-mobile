import React from "react";
import { Text, TextInput, View } from "react-native";
import tw from "twrnc";

import CustomSelectPicker from "#components/inputs/CustomSelectPicker";
import { colors } from "#config/colors.config";

import { formFieldLabelStyle, formTextInputStyle } from "./addArtistFormStyles";

type CountryOption = { label: string; value: string };

type AddArtistTombstoneFieldsProps = {
  show: boolean;
  artistId: string;
  profileCityOrLocation: string;
  onProfileCityOrLocationChange: (v: string) => void;
  birthyear: string;
  onBirthyearChange: (t: string) => void;
  onBirthyearFocus: () => void;
  country_of_origin: string;
  countryOptions: CountryOption[];
  onCountryChange: (value: string) => void;
};

export function AddArtistTombstoneFields({
  show,
  artistId,
  profileCityOrLocation,
  onProfileCityOrLocationChange,
  birthyear,
  onBirthyearChange,
  onBirthyearFocus,
  country_of_origin,
  countryOptions,
  onCountryChange,
}: AddArtistTombstoneFieldsProps) {
  if (!show) return null;

  return (
    <View style={tw`mt-6`}>
      {!!artistId && (
        <View style={tw`mb-5`}>
          <Text style={formFieldLabelStyle}>City / location</Text>
          <TextInput
            value={profileCityOrLocation}
            onChangeText={onProfileCityOrLocationChange}
            placeholder="e.g. Lagos, Nigeria"
            placeholderTextColor={colors.inputLabel}
            style={formTextInputStyle}
          />
        </View>
      )}
      <View style={tw`flex-row gap-4 items-start`}>
        <View style={tw`flex-1 min-w-0`}>
          <Text style={formFieldLabelStyle}>Birth year</Text>
          <TextInput
            value={birthyear}
            onChangeText={(t) => onBirthyearChange(t.replace(/\D/g, "").slice(0, 4))}
            onFocus={onBirthyearFocus}
            placeholder="e.g. 1985"
            placeholderTextColor={colors.inputLabel}
            keyboardType="number-pad"
            style={formTextInputStyle}
          />
        </View>
        <View style={tw`flex-1 min-w-0 z-20`}>
          <CustomSelectPicker
            label="Country"
            placeholder="Select country"
            value={country_of_origin}
            data={countryOptions}
            search
            searchPlaceholder="Search countries"
            handleSetValue={(item) => onCountryChange(item.value)}
            zIndex={4000}
          />
        </View>
      </View>
    </View>
  );
}
