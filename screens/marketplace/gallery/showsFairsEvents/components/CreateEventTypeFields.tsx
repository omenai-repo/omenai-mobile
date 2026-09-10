import React from "react";
import {
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";

import { formTextInputStyle } from "#components/gallery/artistRoster/addArtistFormStyles";
import CustomSelectPicker from "#components/inputs/CustomSelectPicker";
import { colors } from "#config/colors.config";
import type { CreateEventFormData } from "../hooks/useCreateGalleryEventForm";
import type { DateFieldKey } from "../hooks/useEventDatePicker";
import { formatYmdForDisplay } from "../helpers/createEventHelpers";

type ViewingRoomFieldsProps = Readonly<{
  externalUrl: string;
  error?: string;
  onChange: (t: string) => void;
}>;

export function ViewingRoomFields({
  externalUrl,
  error,
  onChange,
}: ViewingRoomFieldsProps) {
  return (
    <View style={tw`pt-4 border-t border-neutral-200 mb-6`}>
      <Text style={tw`text-sm text-neutral-900 font-medium mb-4`}>Digital Access</Text>
      <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500 mb-2`}>
        External Portal URL (optional)
      </Text>
      <TextInput
        value={externalUrl}
        onChangeText={onChange}
        placeholder="https://..."
        placeholderTextColor={colors.inputLabel}
        autoCapitalize="none"
        keyboardType="url"
        style={formTextInputStyle}
      />
      {error ? (
        <Text style={tw`text-[10px] text-red-600 mt-1`}>{error}</Text>
      ) : null}
    </View>
  );
}

type LocationFieldsProps = Readonly<{
  formData: CreateEventFormData;
  errors: Record<string, string>;
  countryOptions: { label: string; value: string }[];
  onFieldChange: (field: string, value: string) => void;
  onOpenDatePicker: (field: DateFieldKey) => void;
  onClearVipDate: () => void;
}>;

export function LocationFields({
  formData,
  errors,
  countryOptions,
  onFieldChange,
  onOpenDatePicker,
  onClearVipDate,
}: LocationFieldsProps) {
  return (
    <View style={tw`pt-4 border-t border-neutral-200 mb-6`}>
      <Text style={tw`text-sm text-neutral-900 font-medium mb-4`}>Location Details</Text>

      <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500 mb-2`}>
        Venue Name
      </Text>
      <TextInput
        value={formData.location.venue}
        onChangeText={(t) => onFieldChange("location.venue", t)}
        placeholder={
          formData.event_type === "art_fair"
            ? "e.g. Miami Beach Convention Center"
            : "e.g. Main Gallery Space"
        }
        placeholderTextColor={colors.inputLabel}
        style={[...formTextInputStyle, tw`mb-4`]}
      />
      {errors["location.venue"] ? (
        <Text style={tw`text-[10px] text-red-600 mb-2`}>
          {errors["location.venue"]}
        </Text>
      ) : null}

      <View style={tw`z-20 mb-4`}>
        <CustomSelectPicker
          label="Event Location (Country)"
          placeholder="Select country"
          value={formData.location.country}
          data={countryOptions}
          search
          searchPlaceholder="Search countries"
          handleSetValue={(item) => onFieldChange("location.country", item.value)}
          zIndex={5000}
        />
      </View>
      {errors["location.country"] ? (
        <Text style={tw`text-[10px] text-red-600 mb-2`}>
          {errors["location.country"]}
        </Text>
      ) : null}

      <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500 mb-2`}>
        City
      </Text>
      <TextInput
        value={formData.location.city}
        onChangeText={(t) => onFieldChange("location.city", t)}
        placeholder="e.g. Miami"
        placeholderTextColor={colors.inputLabel}
        style={[...formTextInputStyle, tw`mb-4`]}
      />
      {errors["location.city"] ? (
        <Text style={tw`text-[10px] text-red-600 mb-2`}>
          {errors["location.city"]}
        </Text>
      ) : null}

      {formData.event_type === "art_fair" && (
        <ArtFairExtraFields
          formData={formData}
          errors={errors}
          onFieldChange={onFieldChange}
          onOpenDatePicker={onOpenDatePicker}
          onClearVipDate={onClearVipDate}
        />
      )}
    </View>
  );
}

function ArtFairExtraFields({
  formData,
  errors,
  onFieldChange,
  onOpenDatePicker,
  onClearVipDate,
}: Readonly<{
  formData: CreateEventFormData;
  errors: Record<string, string>;
  onFieldChange: (field: string, value: string) => void;
  onOpenDatePicker: (field: DateFieldKey) => void;
  onClearVipDate: () => void;
}>) {
  return (
    <View style={tw`gap-4`}>
      <View>
        <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500 mb-2`}>
          Booth Number
        </Text>
        <TextInput
          value={formData.booth_number}
          onChangeText={(t) => onFieldChange("booth_number", t)}
          placeholder="e.g. A14"
          placeholderTextColor={colors.inputLabel}
          style={formTextInputStyle}
        />
        {errors.booth_number ? (
          <Text style={tw`text-[10px] text-red-600 mt-1`}>{errors.booth_number}</Text>
        ) : null}
      </View>
      <View>
        <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500 mb-2`}>
          VIP Preview Date (optional)
        </Text>
        <View style={tw`flex-row items-center gap-2`}>
          <Pressable
            onPress={() => onOpenDatePicker("vip_preview_date")}
            style={[
              ...formTextInputStyle,
              tw`flex-1 flex-row items-center justify-between`,
            ]}
          >
            <Text
              style={{
                color: formData.vip_preview_date
                  ? colors.black
                  : colors.inputLabel,
                fontSize: 14,
              }}
              numberOfLines={1}
            >
              {formData.vip_preview_date
                ? formatYmdForDisplay(formData.vip_preview_date)
                : "Select date"}
            </Text>
            <Ionicons name="calendar-outline" size={20} color="#737373" />
          </Pressable>
          {formData.vip_preview_date ? (
            <TouchableOpacity
              onPress={onClearVipDate}
              style={tw`px-3 py-3 border border-neutral-300 rounded-sm`}
            >
              <Text style={tw`text-xs text-neutral-700`}>Clear</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        {errors.vip_preview_date ? (
          <Text style={tw`text-[10px] text-red-600 mt-1`}>
            {errors.vip_preview_date}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
