import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";
import tw from "twrnc";
import { GalleryEventRecord } from "#services/marketplace/events/events.service";
import { colors } from "#config/colors.config";
import { formTextInputStyle } from "#components/gallery/artistRoster/addArtistFormStyles";
import { artist_countries_codes_currency } from "#data/artist_countries_codes_currency";
import LongBlackButton from "#components/buttons/LongBlackButton";
import EventTypeSpecificFields from "./EventTypeSpecificFields";

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
type NormalizedEventType = "art_fair" | "exhibition" | "viewing_room" | (string & {});

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

function normalizeEventType(event: GalleryEventRecord): NormalizedEventType {
  const rawEventType = String((event as any)?.event_type || "")
    .toLowerCase()
    .trim()
    .replaceAll(/[-\s]+/g, "_");
  if (rawEventType === "viewingroom") return "viewing_room";
  if (rawEventType === "artfair") return "art_fair";
  return rawEventType;
}

function validateEditPayload(form: EditFormState, eventType: NormalizedEventType) {
  const errors: Record<string, string> = {};
  if (!form.title.trim()) errors.title = "Title is required.";
  if (!form.startDate.trim()) errors.startDate = "Opening date is required.";
  if (!form.endDate.trim()) errors.endDate = "Closing date is required.";

  if (eventType === "art_fair" && !form.boothNumber.trim()) {
    return { errors, boothError: "Booth number is required." };
  }

  return { errors, boothError: "" };
}

function buildEditPayload(form: EditFormState, eventType: NormalizedEventType) {
  const payload: Record<string, unknown> = {
    title: form.title.trim(),
    description: form.description.trim(),
    start_date: form.startDate.trim(),
    end_date: form.endDate.trim(),
  };

  switch (eventType) {
    case "art_fair":
      payload.booth_number = form.boothNumber.trim();
      payload.location = {
        city: form.city.trim(),
        country: form.country.trim(),
      };
      if (form.vipPreviewDate.trim()) payload.vip_preview_date = form.vipPreviewDate.trim();
      return payload;
    case "exhibition":
      payload.location = {
        venue: form.venue.trim(),
        city: form.city.trim(),
        country: form.country.trim(),
      };
      return payload;
    case "viewing_room":
      payload.external_url = form.externalUrl.trim() || null;
      return payload;
    default:
      return payload;
  }
}

type EditEventBottomSheetProps = {
  readonly isOpen: boolean;
  readonly event: GalleryEventRecord;
  readonly isSaving: boolean;
  readonly onClose: () => void;
  readonly onSave: (payload: Record<string, unknown>) => void;
};

export default function EditEventBottomSheet({
  isOpen,
  event,
  isSaving,
  onClose,
  onSave,
}: Readonly<EditEventBottomSheetProps>) {
  const insets = useSafeAreaInsets();
  const eventType = normalizeEventType(event);
  const eventTypeLabel = eventType ? eventType.replaceAll("_", " ") : "presentation";
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
        .map((country) => ({ label: country.name, value: country.name })),
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
    const validation = validateEditPayload(editForm, eventType);
    if (Object.keys(validation.errors).length) {
      setErrors(validation.errors);
      return;
    }
    if (validation.boothError) {
      setBoothError(validation.boothError);
      return;
    }

    setBoothError("");
    setErrors({});
    onSave(buildEditPayload(editForm, eventType));
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

            <EventTypeSpecificFields
              eventType={eventType}
              editForm={editForm}
              boothError={boothError}
              setBoothError={setBoothError}
              setEditForm={setEditForm}
              setActiveDateField={setActiveDateField}
              countryOptions={countryOptions}
              formatDateForDisplay={formatYmdForDisplay}
            />

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
