import React from "react";
import { Text, TextInput, View } from "react-native";
import tw from "twrnc";

import CustomSelectPicker from "#components/inputs/CustomSelectPicker";
import { colors } from "#config/colors.config";

import { formFieldLabelStyle, formTextInputStyle } from "./addArtistFormStyles";

type CountryOption = { label: string; value: string };

type AddArtistTombstoneFieldsProps = {
  readonly show: boolean;
  readonly artistId: string;
  readonly profileCityOrLocation: string;
  readonly onProfileCityOrLocationChange: (v: string) => void;
  readonly birthyear: string;
  readonly onBirthyearChange: (t: string) => void;
  readonly onBirthyearFocus: () => void;
  readonly birthYearError?: string | null;
  readonly country_of_origin: string;
  readonly countryOptions: readonly CountryOption[];
  readonly onCountryChange: (value: string) => void;
};

export function AddArtistTombstoneFields({
  show,
  artistId,
  profileCityOrLocation,
  onProfileCityOrLocationChange,
  birthyear,
  onBirthyearChange,
  onBirthyearFocus,
  birthYearError,
  country_of_origin,
  countryOptions,
  onCountryChange,
}: Readonly<AddArtistTombstoneFieldsProps>) {
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
            onChangeText={(t) => onBirthyearChange(t.replaceAll(/\D/g, "").slice(0, 4))}
            onFocus={onBirthyearFocus}
            placeholder="e.g. 1985"
            placeholderTextColor={colors.inputLabel}
            keyboardType="number-pad"
            style={formTextInputStyle}
          />
          {!!birthYearError && (
            <Text style={tw`text-red-600 text-xs mt-1`}>{birthYearError}</Text>
          )}
        </View>
        <View style={tw`flex-1 min-w-0 z-20`}>
          <CustomSelectPicker
            label="Country"
            placeholder="Select country"
            value={country_of_origin}
            data={[...countryOptions]}
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
