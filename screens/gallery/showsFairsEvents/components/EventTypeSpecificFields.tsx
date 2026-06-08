import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, TextInput, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import { colors } from "#config/colors.config";
import { formTextInputStyle } from "#components/gallery/artistRoster/addArtistFormStyles";
import CustomSelectPicker from "#components/inputs/CustomSelectPicker";

type DateFieldKey = "startDate" | "endDate" | "vipPreviewDate";

type EditFormState = {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  vipPreviewDate: string;
  externalUrl: string;
  venue: string;
  city: string;
  country: string;
  boothNumber: string;
};

type EventTypeSpecificFieldsProps = {
  readonly eventType: string;
  readonly editForm: EditFormState;
  readonly boothError: string;
  readonly setBoothError: (value: string) => void;
  readonly setEditForm: React.Dispatch<React.SetStateAction<EditFormState>>;
  readonly setActiveDateField: (value: DateFieldKey | null) => void;
  readonly countryOptions: readonly { label: string; value: string }[];
  readonly formatDateForDisplay: (ymd: string) => string;
};

export default function EventTypeSpecificFields({
  eventType,
  editForm,
  boothError,
  setBoothError,
  setEditForm,
  setActiveDateField,
  countryOptions,
  formatDateForDisplay,
}: Readonly<EventTypeSpecificFieldsProps>) {
  if (eventType === "art_fair") {
    return (
      <View style={tw`mb-4 gap-4`}>
        <View>
          <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500 mb-2`}>
            Booth Number *
          </Text>
          <TextInput
            value={editForm.boothNumber}
            onChangeText={(value) => {
              if (boothError) setBoothError("");
              setEditForm((prev) => ({ ...prev, boothNumber: value }));
            }}
            placeholder="e.g. C14"
            placeholderTextColor={colors.inputLabel}
            style={formTextInputStyle}
          />
          {boothError ? <Text style={tw`text-[10px] text-red-600 mt-1`}>{boothError}</Text> : null}
        </View>
        <View style={tw`z-20`}>
          <CustomSelectPicker
            label="Event Location (Country)"
            placeholder="Select country"
            value={editForm.country}
            data={[...countryOptions]}
            search
            searchPlaceholder="Search countries"
            handleSetValue={(item) =>
              setEditForm((prev) => ({ ...prev, country: String(item.value || "") }))
            }
            zIndex={5000}
          />
        </View>
        <View>
          <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500 mb-2`}>City</Text>
          <TextInput
            value={editForm.city}
            onChangeText={(value) => setEditForm((prev) => ({ ...prev, city: value }))}
            placeholder="e.g. Miami"
            placeholderTextColor={colors.inputLabel}
            style={formTextInputStyle}
          />
        </View>
        <View>
          <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500 mb-2`}>
            VIP Preview Date (optional)
          </Text>
          <View style={tw`flex-row items-center gap-2`}>
            <Pressable
              onPress={() => setActiveDateField("vipPreviewDate")}
              style={[...formTextInputStyle, tw`flex-1 flex-row items-center justify-between`]}
            >
              <Text
                style={{
                  color: editForm.vipPreviewDate ? colors.black : colors.inputLabel,
                  fontSize: 14,
                }}
                numberOfLines={1}
              >
                {editForm.vipPreviewDate
                  ? formatDateForDisplay(editForm.vipPreviewDate)
                  : "Select date"}
              </Text>
              <Ionicons name="calendar-outline" size={20} color="#737373" />
            </Pressable>
            {editForm.vipPreviewDate ? (
              <TouchableOpacity
                onPress={() => setEditForm((prev) => ({ ...prev, vipPreviewDate: "" }))}
                style={tw`px-3 py-3 border border-neutral-300 rounded-sm`}
              >
                <Text style={tw`text-xs text-neutral-700`}>Clear</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
    );
  }

  if (eventType === "exhibition") {
    return (
      <View style={tw`mb-4 gap-4`}>
        <View>
          <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500 mb-2`}>
            Venue / Gallery Name
          </Text>
          <TextInput
            value={editForm.venue}
            onChangeText={(value) => setEditForm((prev) => ({ ...prev, venue: value }))}
            placeholder="e.g. Main Space"
            placeholderTextColor={colors.inputLabel}
            style={formTextInputStyle}
          />
        </View>
        <View style={tw`z-20`}>
          <CustomSelectPicker
            label="Event Location (Country)"
            placeholder="Select country"
            value={editForm.country}
            data={[...countryOptions]}
            search
            searchPlaceholder="Search countries"
            handleSetValue={(item) =>
              setEditForm((prev) => ({ ...prev, country: String(item.value || "") }))
            }
            zIndex={5000}
          />
        </View>
        <View>
          <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500 mb-2`}>City</Text>
          <TextInput
            value={editForm.city}
            onChangeText={(value) => setEditForm((prev) => ({ ...prev, city: value }))}
            placeholder="e.g. London"
            placeholderTextColor={colors.inputLabel}
            style={formTextInputStyle}
          />
        </View>
      </View>
    );
  }

  if (eventType === "viewing_room") {
    return (
      <View style={tw`gap-2 mb-3`}>
        <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500`}>
          External Link (optional)
        </Text>
        <TextInput
          value={editForm.externalUrl}
          onChangeText={(value) => setEditForm((prev) => ({ ...prev, externalUrl: value }))}
          autoCapitalize="none"
          keyboardType="url"
          placeholder="https://..."
          placeholderTextColor={colors.inputLabel}
          style={formTextInputStyle}
        />
      </View>
    );
  }

  return null;
}
