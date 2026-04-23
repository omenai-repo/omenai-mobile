import React, { useEffect, useState } from "react";
import { Modal, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import tw from "twrnc";
import { GalleryEventRecord } from "#services/events/events.service";

type EditFormState = {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  externalUrl: string;
  venue: string;
  city: string;
  country: string;
  boothNumber: string;
};

type EditEventBottomSheetProps = {
  isOpen: boolean;
  event: GalleryEventRecord;
  isSaving: boolean;
  onClose: () => void;
  onSave: (payload: Record<string, unknown>) => void;
};

export default function EditEventBottomSheet({
  isOpen,
  event,
  isSaving,
  onClose,
  onSave,
}: EditEventBottomSheetProps) {
  const insets = useSafeAreaInsets();
  const [editForm, setEditForm] = useState<EditFormState>({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    externalUrl: "",
    venue: "",
    city: "",
    country: "",
    boothNumber: "",
  });

  useEffect(() => {
    if (!event || !isOpen) return;
    setEditForm({
      title: event.title || "",
      description: event.description || "",
      startDate: event.start_date ? event.start_date.slice(0, 10) : "",
      endDate: event.end_date ? event.end_date.slice(0, 10) : "",
      externalUrl: event.external_url || "",
      venue: event.location?.venue || "",
      city: event.location?.city || "",
      country: event.location?.country || "",
      boothNumber: event.booth_number || "",
    });
  }, [event, isOpen]);

  const handleSave = () => {
    const payload: Record<string, unknown> = {
      title: editForm.title.trim(),
      description: editForm.description.trim(),
      start_date: editForm.startDate.trim(),
      end_date: editForm.endDate.trim(),
      external_url: editForm.externalUrl.trim() || null,
      location: {
        venue: editForm.venue.trim(),
        city: editForm.city.trim(),
        country: editForm.country.trim(),
      },
    };

    if (event?.event_type === "art_fair") {
      payload.booth_number = editForm.boothNumber.trim() || null;
    }

    onSave(payload);
  };

  return (
    <Modal visible={isOpen} animationType="slide" transparent>
      <View style={tw`flex-1 bg-black/40 justify-end`}>
        <View
          style={[
            tw`bg-white rounded-t-2xl px-4 pt-4 pb-5`,
            { maxHeight: "85%", paddingBottom: insets.bottom + 16 },
          ]}
        >
          <View style={tw`flex-row items-center justify-between mb-3`}>
            <Text style={tw`text-sm text-neutral-900`}>Edit Event Details</Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={22} color="#171717" />
            </Pressable>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={tw`gap-2 mb-3`}>
              <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500`}>Title</Text>
              <TextInput
                value={editForm.title}
                onChangeText={(value) => setEditForm((prev) => ({ ...prev, title: value }))}
                style={tw`border border-neutral-300 rounded-sm px-3 py-2 text-sm`}
              />
            </View>
            <View style={tw`gap-2 mb-3`}>
              <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500`}>
                Description
              </Text>
              <TextInput
                value={editForm.description}
                onChangeText={(value) => setEditForm((prev) => ({ ...prev, description: value }))}
                multiline
                textAlignVertical="top"
                style={tw`border border-neutral-300 rounded-sm px-3 py-2 text-sm min-h-[90px]`}
              />
            </View>
            <View style={tw`flex-row gap-2 mb-3`}>
              <View style={tw`flex-1 gap-2`}>
                <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500`}>
                  Start Date (YYYY-MM-DD)
                </Text>
                <TextInput
                  value={editForm.startDate}
                  onChangeText={(value) => setEditForm((prev) => ({ ...prev, startDate: value }))}
                  style={tw`border border-neutral-300 rounded-sm px-3 py-2 text-sm`}
                />
              </View>
              <View style={tw`flex-1 gap-2`}>
                <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500`}>
                  End Date (YYYY-MM-DD)
                </Text>
                <TextInput
                  value={editForm.endDate}
                  onChangeText={(value) => setEditForm((prev) => ({ ...prev, endDate: value }))}
                  style={tw`border border-neutral-300 rounded-sm px-3 py-2 text-sm`}
                />
              </View>
            </View>
            <View style={tw`gap-2 mb-3`}>
              <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500`}>
                External URL
              </Text>
              <TextInput
                value={editForm.externalUrl}
                onChangeText={(value) => setEditForm((prev) => ({ ...prev, externalUrl: value }))}
                autoCapitalize="none"
                keyboardType="url"
                style={tw`border border-neutral-300 rounded-sm px-3 py-2 text-sm`}
              />
            </View>
            <View style={tw`flex-row gap-2 mb-3`}>
              <View style={tw`flex-1 gap-2`}>
                <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500`}>
                  Venue
                </Text>
                <TextInput
                  value={editForm.venue}
                  onChangeText={(value) => setEditForm((prev) => ({ ...prev, venue: value }))}
                  style={tw`border border-neutral-300 rounded-sm px-3 py-2 text-sm`}
                />
              </View>
              <View style={tw`flex-1 gap-2`}>
                <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500`}>City</Text>
                <TextInput
                  value={editForm.city}
                  onChangeText={(value) => setEditForm((prev) => ({ ...prev, city: value }))}
                  style={tw`border border-neutral-300 rounded-sm px-3 py-2 text-sm`}
                />
              </View>
            </View>
            <View style={tw`flex-row gap-2 mb-4`}>
              <View style={tw`flex-1 gap-2`}>
                <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500`}>
                  Country
                </Text>
                <TextInput
                  value={editForm.country}
                  onChangeText={(value) => setEditForm((prev) => ({ ...prev, country: value }))}
                  style={tw`border border-neutral-300 rounded-sm px-3 py-2 text-sm`}
                />
              </View>
              {event.event_type === "art_fair" && (
                <View style={tw`flex-1 gap-2`}>
                  <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500`}>
                    Booth Number
                  </Text>
                  <TextInput
                    value={editForm.boothNumber}
                    onChangeText={(value) => setEditForm((prev) => ({ ...prev, boothNumber: value }))}
                    style={tw`border border-neutral-300 rounded-sm px-3 py-2 text-sm`}
                  />
                </View>
              )}
            </View>
          </ScrollView>
          <TouchableOpacity
            style={tw`bg-black rounded-sm py-3 mt-2`}
            activeOpacity={0.85}
            onPress={handleSave}
            disabled={isSaving}
          >
            <Text style={tw`text-white text-[10px] uppercase tracking-widest text-center`}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
