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
import { colors } from "#config/colors.config";
import type { GalleryEventType } from "#services/marketplace/events/events.service";
import type { CreateEventFormData } from "../hooks/useCreateGalleryEventForm";
import type { DateFieldKey } from "../hooks/useEventDatePicker";
import type { PickedAsset } from "../helpers/createEventHelpers";
import {
  EVENT_TYPES,
  formMultilineInputStyle,
  formatYmdForDisplay,
} from "../helpers/createEventHelpers";
import {
  CoverImageSection,
  InstallationViewsSection,
} from "./CreateEventMediaSections";
import { ViewingRoomFields, LocationFields } from "./CreateEventTypeFields";

type CreateEventFormFieldsProps = Readonly<{
  formData: CreateEventFormData;
  errors: Record<string, string>;
  coverPreviewUri: string;
  installationAssets: PickedAsset[];
  countryOptions: { label: string; value: string }[];
  onPickCover: () => void;
  onAddInstallations: () => void;
  onRemoveInstallation: (index: number) => void;
  onFieldChange: (field: string, value: string) => void;
  onOpenDatePicker: (field: DateFieldKey) => void;
  onClearVipDate: () => void;
}>;

export default function CreateEventFormFields({
  formData,
  errors,
  coverPreviewUri,
  installationAssets,
  countryOptions,
  onPickCover,
  onAddInstallations,
  onRemoveInstallation,
  onFieldChange,
  onOpenDatePicker,
  onClearVipDate,
}: CreateEventFormFieldsProps) {
  return (
    <>
      <CoverImageSection
        coverPreviewUri={coverPreviewUri}
        error={errors.cover_image}
        onPress={onPickCover}
      />

      <InstallationViewsSection
        assets={installationAssets}
        onAdd={onAddInstallations}
        onRemove={onRemoveInstallation}
      />

      <EventTypeSelector
        selected={formData.event_type}
        onSelect={(id) => onFieldChange("event_type", id)}
      />

      <TitleField
        value={formData.title}
        error={errors.title}
        onChange={(t) => onFieldChange("title", t)}
      />

      <DateRow
        startDate={formData.start_date}
        endDate={formData.end_date}
        errors={errors}
        onOpenDatePicker={onOpenDatePicker}
      />

      <DescriptionField
        value={formData.description}
        error={errors.description}
        onChange={(t) => onFieldChange("description", t)}
      />

      {formData.event_type === "viewing_room" ? (
        <ViewingRoomFields
          externalUrl={formData.external_url}
          error={errors.external_url}
          onChange={(t) => onFieldChange("external_url", t)}
        />
      ) : (
        <LocationFields
          formData={formData}
          errors={errors}
          countryOptions={countryOptions}
          onFieldChange={onFieldChange}
          onOpenDatePicker={onOpenDatePicker}
          onClearVipDate={onClearVipDate}
        />
      )}
    </>
  );
}

/* ── Small inline sub-components (kept here; under 60 LOC each) ── */

function EventTypeSelector({
  selected,
  onSelect,
}: Readonly<{ selected: GalleryEventType; onSelect: (id: string) => void }>) {
  return (
    <>
      <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500 mb-3`}>
        Event Format
      </Text>
      <View style={tw`flex-row flex-wrap gap-2 mb-8`}>
        {EVENT_TYPES.map((type) => {
          const active = selected === type.id;
          return (
            <TouchableOpacity
              key={type.id}
              onPress={() => onSelect(type.id)}
              style={[
                tw`px-4 py-3 rounded-sm border`,
                active
                  ? tw`bg-[${colors.black}] border-[${colors.black}]`
                  : tw`bg-white border-neutral-200`,
              ]}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  tw`text-[10px] uppercase tracking-widest`,
                  active ? tw`text-white` : tw`text-neutral-600`,
                ]}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
}

function TitleField({
  value,
  error,
  onChange,
}: Readonly<{ value: string; error?: string; onChange: (t: string) => void }>) {
  return (
    <>
      <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500 mb-2`}>
        Presentation Title
      </Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="e.g. Neon Reverie: New Works"
        placeholderTextColor={colors.inputLabel}
        style={[...formTextInputStyle, tw`text-base mb-1`]}
      />
      {error ? (
        <Text style={tw`text-[10px] text-red-600 mb-4`}>{error}</Text>
      ) : (
        <View style={tw`mb-4`} />
      )}
    </>
  );
}

function DateRow({
  startDate,
  endDate,
  errors,
  onOpenDatePicker,
}: Readonly<{
  startDate: string;
  endDate: string;
  errors: Record<string, string>;
  onOpenDatePicker: (field: DateFieldKey) => void;
}>) {
  return (
    <View style={tw`flex-row gap-3 mb-4`}>
      <DatePickerField
        label="Opening Date"
        value={startDate}
        error={errors.start_date}
        onPress={() => onOpenDatePicker("start_date")}
      />
      <DatePickerField
        label="Closing Date"
        value={endDate}
        error={errors.end_date}
        onPress={() => onOpenDatePicker("end_date")}
      />
    </View>
  );
}

function DatePickerField({
  label,
  value,
  error,
  onPress,
}: Readonly<{
  label: string;
  value: string;
  error?: string;
  onPress: () => void;
}>) {
  return (
    <View style={tw`flex-1`}>
      <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500 mb-2`}>
        {label}
      </Text>
      <Pressable
        onPress={onPress}
        style={[...formTextInputStyle, tw`flex-row items-center justify-between`]}
      >
        <Text
          style={{ color: value ? colors.black : colors.inputLabel, fontSize: 14 }}
          numberOfLines={1}
        >
          {value ? formatYmdForDisplay(value) : "Select date"}
        </Text>
        <Ionicons name="calendar-outline" size={20} color="#737373" />
      </Pressable>
      {error ? (
        <Text style={tw`text-[10px] text-red-600 mt-1`}>{error}</Text>
      ) : null}
    </View>
  );
}

function DescriptionField({
  value,
  error,
  onChange,
}: Readonly<{ value: string; error?: string; onChange: (t: string) => void }>) {
  return (
    <>
      <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500 mb-2`}>
        Curatorial Statement
      </Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Provide a detailed overview of the presentation..."
        placeholderTextColor={colors.inputLabel}
        multiline
        textAlignVertical="top"
        style={[...formMultilineInputStyle, tw`mb-1`]}
      />
      {error ? (
        <Text style={tw`text-[10px] text-red-600 mb-6`}>{error}</Text>
      ) : (
        <View style={tw`mb-6`} />
      )}
    </>
  );
}
