import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";
import tw from "twrnc";
import { GalleryEventRecord } from "#services/events/events.service";
import { colors } from "#config/colors.config";
import { formTextInputStyle } from "#components/gallery/artistRoster/addArtistFormStyles";
import CustomSelectPicker from "#components/inputs/CustomSelectPicker";
import { artist_countries_codes_currency } from "#data/artist_countries_codes_currency";
import LongBlackButton from "#components/buttons/LongBlackButton";

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

type DateFieldKey = "startDate" | "endDate" | "vipPreviewDate";

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatYmdLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseYmdLocal(ymd: string): Date | null {
  if (!ymd || !/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return null;
  const [y, mo, da] = ymd.split("-").map(Number);
  const date = new Date(y, mo - 1, da);
  if (date.getFullYear() !== y || date.getMonth() !== mo - 1 || date.getDate() !== da) {
    return null;
  }
  return date;
}

function formatYmdForDisplay(ymd: string): string {
  const d = parseYmdLocal(ymd);
  return d ? format(d, "MMM d, yyyy") : "";
}

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
  const rawEventType = String((event as any)?.event_type || "")
    .toLowerCase()
    .trim()
    .replace(/[-\s]+/g, "_");
  const eventType =
    rawEventType === "viewingroom"
      ? "viewing_room"
      : rawEventType === "artfair"
        ? "art_fair"
        : rawEventType;
  const eventTypeLabel = eventType ? eventType.replace(/_/g, " ") : "presentation";
  const [boothError, setBoothError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeDateField, setActiveDateField] = useState<DateFieldKey | null>(null);
  const [editForm, setEditForm] = useState<EditFormState>({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    vipPreviewDate: "",
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
      vipPreviewDate: (event as any).vip_preview_date
        ? (event as any).vip_preview_date.slice(0, 10)
        : "",
      externalUrl: event.external_url || "",
      venue: event.location?.venue || "",
      city: event.location?.city || "",
      country: event.location?.country || "",
      boothNumber: event.booth_number || "",
    });
    setBoothError("");
    setErrors({});
  }, [event, isOpen]);

  const datePickerConfig = useMemo(() => {
    const sod = startOfToday();
    if (!activeDateField) return null;
    const startParsed = parseYmdLocal(editForm.startDate);
    const endParsed = parseYmdLocal(editForm.endDate);
    const vipParsed = parseYmdLocal(editForm.vipPreviewDate);

    if (activeDateField === "startDate") {
      const current =
        startParsed && startParsed.getTime() >= sod.getTime() ? startParsed : sod;
      return { min: sod, max: undefined as Date | undefined, current };
    }
    if (activeDateField === "endDate") {
      const minEnd =
        startParsed && startParsed.getTime() >= sod.getTime() ? startParsed : sod;
      const current = endParsed && endParsed.getTime() >= minEnd.getTime() ? endParsed : minEnd;
      return { min: minEnd, max: undefined as Date | undefined, current };
    }
    const current = vipParsed ?? sod;
    return { min: undefined as Date | undefined, max: undefined as Date | undefined, current };
  }, [activeDateField, editForm.startDate, editForm.endDate, editForm.vipPreviewDate]);

  const countryOptions = useMemo(
    () =>
      [...artist_countries_codes_currency]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((c) => ({ label: c.name, value: c.name })),
    [],
  );

  const onDatePicked = (picked: Date) => {
    if (!activeDateField) return;
    const normalized = new Date(picked);
    normalized.setHours(0, 0, 0, 0);
    const ymd = formatYmdLocal(normalized);

    if (activeDateField === "startDate") {
      setEditForm((prev) => {
        const endDate = parseYmdLocal(prev.endDate);
        const nextEnd = endDate && endDate.getTime() < normalized.getTime() ? ymd : prev.endDate;
        return { ...prev, startDate: ymd, endDate: nextEnd };
      });
      setErrors((prev) => ({ ...prev, startDate: "" }));
    } else if (activeDateField === "endDate") {
      setEditForm((prev) => ({ ...prev, endDate: ymd }));
      setErrors((prev) => ({ ...prev, endDate: "" }));
    } else {
      setEditForm((prev) => ({ ...prev, vipPreviewDate: ymd }));
      setErrors((prev) => ({ ...prev, vipPreviewDate: "" }));
    }
    setActiveDateField(null);
  };

  const handleSave = () => {
    const nextErrors: Record<string, string> = {};
    if (!editForm.title.trim()) nextErrors.title = "Title is required.";
    if (!editForm.startDate.trim()) nextErrors.startDate = "Opening date is required.";
    if (!editForm.endDate.trim()) nextErrors.endDate = "Closing date is required.";
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    if (eventType === "art_fair" && !editForm.boothNumber.trim()) {
      setBoothError("Booth number is required.");
      return;
    }
    setBoothError("");
    setErrors({});
    const payload: Record<string, unknown> = {
      title: editForm.title.trim(),
      description: editForm.description.trim(),
      start_date: editForm.startDate.trim(),
      end_date: editForm.endDate.trim(),
    };

    if (eventType === "art_fair") {
      payload.booth_number = editForm.boothNumber.trim();
      payload.location = {
        city: editForm.city.trim(),
        country: editForm.country.trim(),
      };
      if (editForm.vipPreviewDate.trim()) payload.vip_preview_date = editForm.vipPreviewDate.trim();
    } else if (eventType === "exhibition") {
      payload.location = {
        venue: editForm.venue.trim(),
        city: editForm.city.trim(),
        country: editForm.country.trim(),
      };
    } else if (eventType === "viewing_room") {
      payload.external_url = editForm.externalUrl.trim() || null;
    }

    onSave(payload);
  };

  return (
    <Modal visible={isOpen} animationType="slide" transparent>
      <View style={tw`flex-1 justify-end`}>
        <Pressable style={tw`absolute inset-0 bg-black/40`} onPress={onClose} />
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={[
            tw`bg-white rounded-t-2xl px-4 pt-4 pb-5`,
            { height: "85%", paddingBottom: insets.bottom + 16 },
          ]}
        >
          <View style={tw`flex-row items-center justify-between mb-3`}>
            <View>
              <Text style={tw`text-sm text-neutral-900`}>Edit Presentation</Text>
              <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500 mt-1`}>
                Update details for this {eventTypeLabel}
              </Text>
            </View>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={22} color="#171717" />
            </Pressable>
          </View>
          <KeyboardAwareScrollView
            style={tw`flex-1`}
            contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 24, 32) }}
            keyboardShouldPersistTaps="handled"
            enableOnAndroid
            enableResetScrollToCoords={false}
            showsVerticalScrollIndicator={false}
          >
            <View style={tw`gap-2 mb-3`}>
              <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500`}>
                Presentation Title
              </Text>
              <TextInput
                value={editForm.title}
                onChangeText={(value) => {
                  setErrors((prev) => ({ ...prev, title: "" }));
                  setEditForm((prev) => ({ ...prev, title: value }));
                }}
                style={formTextInputStyle}
              />
              {errors.title ? <Text style={tw`text-[10px] text-red-600`}>{errors.title}</Text> : null}
            </View>

            <View style={tw`flex-row gap-2 mb-3`}>
              <View style={tw`flex-1 gap-2`}>
                <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500`}>Opening Date</Text>
                <Pressable
                  onPress={() => setActiveDateField("startDate")}
                  style={[...formTextInputStyle, tw`flex-row items-center justify-between`]}
                >
                  <Text
                    style={{ color: editForm.startDate ? colors.black : colors.inputLabel, fontSize: 14 }}
                    numberOfLines={1}
                  >
                    {editForm.startDate ? formatYmdForDisplay(editForm.startDate) : "Select date"}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color="#737373" />
                </Pressable>
                {errors.startDate ? (
                  <Text style={tw`text-[10px] text-red-600`}>{errors.startDate}</Text>
                ) : null}
              </View>
              <View style={tw`flex-1 gap-2`}>
                <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500`}>Closing Date</Text>
                <Pressable
                  onPress={() => setActiveDateField("endDate")}
                  style={[...formTextInputStyle, tw`flex-row items-center justify-between`]}
                >
                  <Text
                    style={{ color: editForm.endDate ? colors.black : colors.inputLabel, fontSize: 14 }}
                    numberOfLines={1}
                  >
                    {editForm.endDate ? formatYmdForDisplay(editForm.endDate) : "Select date"}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color="#737373" />
                </Pressable>
                {errors.endDate ? <Text style={tw`text-[10px] text-red-600`}>{errors.endDate}</Text> : null}
              </View>
            </View>

            {eventType === "art_fair" ? (
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
                    data={countryOptions}
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
                          ? formatYmdForDisplay(editForm.vipPreviewDate)
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
            ) : null}

            {eventType === "exhibition" ? (
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
                    data={countryOptions}
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
            ) : null}

            {eventType === "viewing_room" ? (
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
            ) : null}

            <View style={tw`gap-2 mb-3`}>
              <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500`}>
                Curatorial Statement
              </Text>
              <TextInput
                value={editForm.description}
                onChangeText={(value) => setEditForm((prev) => ({ ...prev, description: value }))}
                multiline
                textAlignVertical="top"
                style={tw`border border-neutral-300 rounded-sm px-3 py-2 text-sm min-h-[90px]`}
              />
            </View>
          <LongBlackButton
            value={isSaving ? "Saving..." : "Save Changes"}
            onClick={handleSave}
            isLoading={isSaving}
            isDisabled={isSaving}
            style={tw`mt-2`}
          />
          </KeyboardAwareScrollView>
        </Pressable>
      </View>
      <DateTimePickerModal
        isVisible={activeDateField !== null && datePickerConfig !== null}
        mode="date"
        date={datePickerConfig?.current ?? startOfToday()}
        minimumDate={activeDateField === "vipPreviewDate" ? undefined : (datePickerConfig?.min ?? startOfToday())}
        maximumDate={datePickerConfig?.max}
        onConfirm={onDatePicked}
        onCancel={() => setActiveDateField(null)}
        display={Platform.OS === "ios" ? "inline" : "default"}
      />
    </Modal>
  );
}
