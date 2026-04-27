import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";
import * as ImagePicker from "expo-image-picker";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useQueryClient } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";

import LongBlackButton from "#components/buttons/LongBlackButton";
import BackHeaderTitle from "#components/header/BackHeaderTitle";
import { formTextInputStyle } from "#components/gallery/artistRoster/addArtistFormStyles";
import CustomSelectPicker from "#components/inputs/CustomSelectPicker";
import { colors } from "#config/colors.config";
import { appwriteConfig } from "#config/appwrite.config";
import { artist_countries_codes_currency } from "#data/artist_countries_codes_currency";
import {
  GalleryEventType,
  createGalleryEvent,
} from "#services/events/events.service";
import { useAppStore } from "#store/app/appStore";
import { useModalStore } from "#store/modal/modalStore";
import { uploadToAppwrite } from "#utils/uploadToAppwrite";
import { EVENTS_QK } from "#utils/queryKeys";
import {
  GalleryEventValidationSchema,
  type CreateGalleryEventPayload,
} from "#lib/validation/galleryEventValidation";
import ArtworkSelectorModal from "./components/ArtworkSelectorModal";

/** Multiline variant of `formTextInputStyle` (same border / fill as roster & other forms). */
const formMultilineInputStyle = [
  tw`w-full rounded-md border px-4 py-3 text-sm`,
  {
    borderColor: colors.inputBorder,
    backgroundColor: "#FAFAFA",
    color: colors.black,
    minHeight: 120,
    textAlignVertical: "top" as const,
  },
];

const EVENT_TYPES: { id: GalleryEventType; label: string }[] = [
  { id: "exhibition", label: "Gallery Exhibition" },
  { id: "art_fair", label: "Art Fair Presentation" },
  { id: "viewing_room", label: "Digital Viewing Room" },
];

const DUMMY_COVER_FOR_ZOD = "https://appwrite-pending.omenai.com/image.jpg";

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

type PickedAsset = { uri: string; mimeType?: string; name: string };
type DateFieldKey = "start_date" | "end_date" | "vip_preview_date";

type CreateStackParam = { "create-gallery-event": undefined };
type Props = NativeStackScreenProps<CreateStackParam, "create-gallery-event">;

export default function CreateGalleryEventScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { userSession } = useAppStore();
  const { updateModal } = useModalStore();

  const galleryId = (userSession?.id as string) || "";

  const [formData, setFormData] = useState({
    gallery_id: galleryId,
    event_type: "exhibition" as GalleryEventType,
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    location: { venue: "", city: "", country: "United States" },
    external_url: "",
    booth_number: "",
    vip_preview_date: "",
  });

  useEffect(() => {
    setFormData((prev) => ({ ...prev, gallery_id: galleryId }));
  }, [galleryId]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [coverAsset, setCoverAsset] = useState<PickedAsset | null>(null);
  const [coverPreviewUri, setCoverPreviewUri] = useState("");
  const [installationAssets, setInstallationAssets] = useState<PickedAsset[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingPayload, setPendingPayload] = useState<CreateGalleryEventPayload | null>(
    null,
  );
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [activeDateField, setActiveDateField] = useState<DateFieldKey | null>(null);

  const datePickerConfig = useMemo(() => {
    const sod = startOfToday();
    if (!activeDateField) return null;

    const startParsed = parseYmdLocal(formData.start_date);
    const endParsed = parseYmdLocal(formData.end_date);
    const vipParsed = parseYmdLocal(formData.vip_preview_date);

    if (activeDateField === "start_date") {
      const current =
        startParsed && startParsed.getTime() >= sod.getTime() ? startParsed : sod;
      return { min: sod, max: undefined as Date | undefined, current };
    }

    if (activeDateField === "end_date") {
      const minEnd =
        startParsed && startParsed.getTime() >= sod.getTime() ? startParsed : sod;
      const current =
        endParsed && endParsed.getTime() >= minEnd.getTime() ? endParsed : minEnd;
      return { min: minEnd, max: undefined as Date | undefined, current };
    }

    // VIP preview: mobile only — no min/max (API may still enforce shared rules).
    const current = vipParsed ?? sod;
    return { min: undefined as Date | undefined, max: undefined as Date | undefined, current };
  }, [activeDateField, formData.start_date, formData.end_date, formData.vip_preview_date]);

  const onDatePicked = (picked: Date) => {
    if (!activeDateField) return;
    const normalized = new Date(picked);
    normalized.setHours(0, 0, 0, 0);
    const ymd = formatYmdLocal(normalized);

    setErrors((prev) => ({ ...prev, [activeDateField]: "" }));

    if (activeDateField === "start_date") {
      setFormData((prev) => {
        let { end_date: end, vip_preview_date: vip } = prev;
        if (end) {
          const endD = parseYmdLocal(end);
          if (endD && endD.getTime() < normalized.getTime()) end = ymd;
        }
        return { ...prev, start_date: ymd, end_date: end, vip_preview_date: vip };
      });
    } else if (activeDateField === "end_date") {
      setFormData((prev) => ({ ...prev, end_date: ymd }));
    } else {
      setFormData((prev) => ({ ...prev, vip_preview_date: ymd }));
    }
    setActiveDateField(null);
  };

  const countryOptions = useMemo(
    () =>
      [...artist_countries_codes_currency]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((c) => ({ label: c.name, value: c.name })),
    [],
  );

  const handleChange = useCallback((field: string, value: string) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
    if (field.startsWith("location.")) {
      const key = field.split(".")[1] as keyof typeof formData.location;
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, [key]: value },
      }));
    } else if (field === "event_type") {
      setFormData((prev) => ({ ...prev, event_type: value as GalleryEventType }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value } as typeof prev));
    }
  }, []);

  const pickCover = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      updateModal({
        showModal: true,
        modalType: "error",
        message: "Photo library access is required to set a cover image.",
      });
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.9,
    });
    if (res.canceled || !res.assets?.[0]) return;
    const a = res.assets[0];
    setCoverAsset({
      uri: a.uri,
      mimeType: a.mimeType || "image/jpeg",
      name: a.fileName || `cover-${Date.now()}.jpg`,
    });
    setCoverPreviewUri(a.uri);
  };

  const addInstallationImages = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 1,
      selectionLimit: 12,
    });
    if (res.canceled || !res.assets?.length) return;
    const next: PickedAsset[] = res.assets.map((a, i) => ({
      uri: a.uri,
      mimeType: a.mimeType || "image/jpeg",
      name: a.fileName || `installation-${Date.now()}-${i}.jpg`,
    }));
    setInstallationAssets((prev) => [...prev, ...next]);
  };

  const removeInstallationAt = (index: number) => {
    setInstallationAssets((prev) => prev.filter((_, i) => i !== index));
  };

  const buildPayloadForValidation = useCallback(() => {
    const payload: Record<string, unknown> = {
      gallery_id: formData.gallery_id,
      title: formData.title.trim(),
      description: formData.description.trim(),
      cover_image: DUMMY_COVER_FOR_ZOD,
      participating_artists: [],
      featured_artworks: [],
    };

    if (formData.start_date.trim()) payload.start_date = formData.start_date.trim();
    if (formData.end_date.trim()) payload.end_date = formData.end_date.trim();
    if (formData.event_type === "viewing_room") {
      payload.event_type = "viewing_room";
      payload.external_url = formData.external_url.trim();
      return payload;
    }

    payload.location = {
      venue: formData.location.venue.trim(),
      city: formData.location.city.trim(),
      country: formData.location.country.trim(),
    };

    if (formData.event_type === "exhibition") {
      payload.event_type = "exhibition";
      return payload;
    }

    payload.event_type = "art_fair";
    payload.booth_number = formData.booth_number.trim();
    if (formData.vip_preview_date.trim())
      payload.vip_preview_date = formData.vip_preview_date.trim();
    return payload;
  }, [formData]);

  const onContinueToArtwork = (e?: { preventDefault?: () => void }) => {
    e?.preventDefault?.();
    if (!coverAsset) {
      setErrors({ cover_image: "A cover image is required." });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    const raw = buildPayloadForValidation();
    const validationResult = GalleryEventValidationSchema.safeParse(raw);

    if (!validationResult.success) {
      const newErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        newErrors[path] = issue.message;
      });
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    setPendingPayload(validationResult.data);
    setIsModalOpen(true);
    setIsSubmitting(false);
  };

  const executeFinalSubmission = async (art: {
    featured_artworks: string[];
    participating_artists: string[];
  }) => {
    if (!pendingPayload || !coverAsset || !appwriteConfig.promotionalBucketId) {
      updateModal({
        showModal: true,
        modalType: "error",
        message: "Missing cover image or configuration.",
      });
      return;
    }

    setIsFinalizing(true);
    setIsModalOpen(false);

    try {
      const coverUpload = await uploadToAppwrite({
        bucketId: appwriteConfig.promotionalBucketId,
        file: {
          uri: coverAsset.uri,
          name: coverAsset.name,
          type: coverAsset.mimeType || "image/jpeg",
        },
        fallbackName: coverAsset.name,
        fallbackType: coverAsset.mimeType || "image/jpeg",
        errorMessage: "Cover image upload failed",
      });

      const installationUploads = await Promise.all(
        installationAssets.map((asset) =>
          uploadToAppwrite({
            bucketId: appwriteConfig.promotionalBucketId,
            file: {
              uri: asset.uri,
              name: asset.name,
              type: asset.mimeType || "image/jpeg",
            },
            fallbackName: asset.name,
            fallbackType: asset.mimeType || "image/jpeg",
            errorMessage: "Installation image upload failed",
          }),
        ),
      );
      const installationViewIds = installationUploads.map((up) => up.$id);

      const dbPayload = {
        ...pendingPayload,
        cover_image: coverUpload.$id,
        featured_artworks: art.featured_artworks,
        participating_artists: art.participating_artists,
        ...(installationViewIds.length > 0
          ? { installation_views: installationViewIds }
          : {}),
      } as CreateGalleryEventPayload;

      const response = await createGalleryEvent(dbPayload);
      if (!response.isOk) {
        updateModal({
          showModal: true,
          modalType: "error",
          message:
            response.message ||
            "An error occurred while creating the event. Please try again.",
        });
        return;
      }

      await queryClient.invalidateQueries({ queryKey: EVENTS_QK.allShows });
      await queryClient.invalidateQueries({
        queryKey: [...EVENTS_QK.allFairsEvents("all")],
      });
      await queryClient.invalidateQueries({
        queryKey: EVENTS_QK.galleryProgramming(galleryId),
      });

      updateModal({
        showModal: true,
        modalType: "success",
        message: "Event successfully created.",
      });
      navigation.goBack();
    } catch (err: any) {
      updateModal({
        showModal: true,
        modalType: "error",
        message: err?.message || "An error occurred during final submission.",
      });
    } finally {
      setIsFinalizing(false);
    }
  };

  return (
    <View style={tw`flex-1 bg-[#F7F7F7]`}>
      <BackHeaderTitle title="Curate event" />
      <KeyboardAwareScrollView
        style={tw`flex-1`}
        contentContainerStyle={[
          tw`px-4`,
          { paddingTop: 8, paddingBottom: Math.max(insets.bottom + 24, 32) },
        ]}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        // extraScrollHeight={80}
        enableResetScrollToCoords={false}
      >
        <Text style={tw`text-sm text-neutral-500 mb-8`}>
          Define the specifics of your upcoming programming.
        </Text>

        {/* Cover */}
        <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500 mb-2`}>
          Cover Image
        </Text>
        <Pressable
          onPress={pickCover}
          style={[
            tw`w-full rounded-md border overflow-hidden mb-1`,
            { borderColor: colors.inputBorder, backgroundColor: "#FAFAFA" },
          ]}
        >
          {coverPreviewUri ? (
            <Image
              source={{ uri: coverPreviewUri }}
              style={tw`h-48 w-full bg-neutral-100`}
              resizeMode="cover"
            />
          ) : (
            <View style={tw`h-40 items-center justify-center bg-neutral-50`}>
              <Ionicons name="image-outline" size={36} color="#A3A3A3" />
              <Text style={tw`text-xs text-neutral-500 mt-2`}>Tap to choose cover</Text>
            </View>
          )}
        </Pressable>
        {errors.cover_image ? (
          <Text style={tw`text-[10px] text-red-600 mb-4`}>{errors.cover_image}</Text>
        ) : (
          <View style={tw`mb-4`} />
        )}

        {/* Installation views */}
        <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500 mb-2`}>
          Installation Views (optional)
        </Text>
        <View style={tw`flex-row flex-wrap gap-2 mb-6`}>
          {installationAssets.map((a, index) => (
            <View key={`${a.uri}-${index}`} style={tw`w-[88px]`}>
              <Image source={{ uri: a.uri }} style={tw`h-20 rounded-sm bg-neutral-200`} />
              <Pressable onPress={() => removeInstallationAt(index)} style={tw`mt-1 py-1`}>
                <Text style={tw`text-[10px] text-red-600 text-center`}>Remove</Text>
              </Pressable>
            </View>
          ))}
          <TouchableOpacity
            onPress={addInstallationImages}
            style={[
              tw`h-20 w-20 border border-dashed rounded-md items-center justify-center`,
              { borderColor: colors.inputBorder, backgroundColor: "#FAFAFA" },
            ]}
          >
            <Ionicons name="add" size={28} color="#737373" />
          </TouchableOpacity>
        </View>

        <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500 mb-3`}>
          Event Format
        </Text>
        <View style={tw`flex-row flex-wrap gap-2 mb-8`}>
          {EVENT_TYPES.map((type) => {
            const active = formData.event_type === type.id;
            return (
              <TouchableOpacity
                key={type.id}
                onPress={() => handleChange("event_type", type.id)}
                style={[
                  tw`px-4 py-3 rounded-md border`,
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

        <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500 mb-2`}>
          Presentation Title
        </Text>
        <TextInput
          value={formData.title}
          onChangeText={(t) => handleChange("title", t)}
          placeholder="e.g. Neon Reverie: New Works"
          placeholderTextColor={colors.inputLabel}
          style={[...formTextInputStyle, tw`text-base mb-1`]}
        />
        {errors.title ? (
          <Text style={tw`text-[10px] text-red-600 mb-4`}>{errors.title}</Text>
        ) : (
          <View style={tw`mb-4`} />
        )}

        <View style={tw`flex-row gap-3 mb-4`}>
          <View style={tw`flex-1`}>
            <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500 mb-2`}>
              Opening Date
            </Text>
            <Pressable
              onPress={() => setActiveDateField("start_date")}
              style={[...formTextInputStyle, tw`flex-row items-center justify-between`]}
            >
              <Text
                style={{
                  color: formData.start_date ? colors.black : colors.inputLabel,
                  fontSize: 14,
                }}
                numberOfLines={1}
              >
                {formData.start_date
                  ? formatYmdForDisplay(formData.start_date)
                  : "Select date"}
              </Text>
              <Ionicons name="calendar-outline" size={20} color="#737373" />
            </Pressable>
            {errors.start_date ? (
              <Text style={tw`text-[10px] text-red-600 mt-1`}>{errors.start_date}</Text>
            ) : null}
          </View>
          <View style={tw`flex-1`}>
            <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500 mb-2`}>
              Closing Date
            </Text>
            <Pressable
              onPress={() => setActiveDateField("end_date")}
              style={[...formTextInputStyle, tw`flex-row items-center justify-between`]}
            >
              <Text
                style={{
                  color: formData.end_date ? colors.black : colors.inputLabel,
                  fontSize: 14,
                }}
                numberOfLines={1}
              >
                {formData.end_date ? formatYmdForDisplay(formData.end_date) : "Select date"}
              </Text>
              <Ionicons name="calendar-outline" size={20} color="#737373" />
            </Pressable>
            {errors.end_date ? (
              <Text style={tw`text-[10px] text-red-600 mt-1`}>{errors.end_date}</Text>
            ) : null}
          </View>
        </View>

        <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500 mb-2`}>
          Curatorial Statement
        </Text>
        <TextInput
          value={formData.description}
          onChangeText={(t) => handleChange("description", t)}
          placeholder="Provide a detailed overview of the presentation..."
          placeholderTextColor={colors.inputLabel}
          multiline
          textAlignVertical="top"
          style={[...formMultilineInputStyle, tw`mb-1`]}
        />
        {errors.description ? (
          <Text style={tw`text-[10px] text-red-600 mb-6`}>{errors.description}</Text>
        ) : (
          <View style={tw`mb-6`} />
        )}

        {formData.event_type === "viewing_room" ? (
          <View style={tw`pt-4 border-t border-neutral-200 mb-6`}>
            <Text style={tw`text-sm text-neutral-900 font-medium mb-4`}>Digital Access</Text>
            <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500 mb-2`}>
              External Portal URL (optional)
            </Text>
            <TextInput
              value={formData.external_url}
              onChangeText={(t) => handleChange("external_url", t)}
              placeholder="https://..."
              placeholderTextColor={colors.inputLabel}
              autoCapitalize="none"
              keyboardType="url"
              style={formTextInputStyle}
            />
            {errors.external_url ? (
              <Text style={tw`text-[10px] text-red-600 mt-1`}>{errors.external_url}</Text>
            ) : null}
          </View>
        ) : (
          <View style={tw`pt-4 border-t border-neutral-200 mb-6`}>
            <Text style={tw`text-sm text-neutral-900 font-medium mb-4`}>Location Details</Text>
            <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500 mb-2`}>
              Venue Name
            </Text>
            <TextInput
              value={formData.location.venue}
              onChangeText={(t) => handleChange("location.venue", t)}
              placeholder={
                formData.event_type === "art_fair"
                  ? "e.g. Miami Beach Convention Center"
                  : "e.g. Main Gallery Space"
              }
              placeholderTextColor={colors.inputLabel}
              style={[...formTextInputStyle, tw`mb-4`]}
            />
            {errors["location.venue"] ? (
              <Text style={tw`text-[10px] text-red-600 mb-2`}>{errors["location.venue"]}</Text>
            ) : null}

            <View style={tw`z-20 mb-4`}>
              <CustomSelectPicker
                label="Event Location (Country)"
                placeholder="Select country"
                value={formData.location.country}
                data={countryOptions}
                search
                searchPlaceholder="Search countries"
                handleSetValue={(item) => handleChange("location.country", item.value)}
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
              onChangeText={(t) => handleChange("location.city", t)}
              placeholder="e.g. Miami"
              placeholderTextColor={colors.inputLabel}
              style={[...formTextInputStyle, tw`mb-4`]}
            />
            {errors["location.city"] ? (
              <Text style={tw`text-[10px] text-red-600 mb-2`}>{errors["location.city"]}</Text>
            ) : null}

            {formData.event_type === "art_fair" && (
              <View style={tw`gap-4`}>
                <View>
                  <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500 mb-2`}>
                    Booth Number
                  </Text>
                  <TextInput
                    value={formData.booth_number}
                    onChangeText={(t) => handleChange("booth_number", t)}
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
                      onPress={() => setActiveDateField("vip_preview_date")}
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
                        onPress={() => {
                          setFormData((p) => ({ ...p, vip_preview_date: "" }));
                          setErrors((e) => ({ ...e, vip_preview_date: "" }));
                        }}
                        style={tw`px-3 py-3 border border-neutral-300 rounded-md`}
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
            )}
          </View>
        )}

        <LongBlackButton
          value={isSubmitting ? "Processing..." : "Continue to Artwork Selection"}
          onClick={() => onContinueToArtwork()}
          isLoading={isSubmitting || isFinalizing}
          isDisabled={isFinalizing}
          style={tw`mb-16`}
        />
      </KeyboardAwareScrollView>

      <ArtworkSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        galleryId={galleryId}
        validatedPayload={pendingPayload}
        onFinalSubmit={executeFinalSubmission}
        alreadyFeaturedIds={[]}
      />

      {isFinalizing ? (
        <View
          style={tw`absolute inset-0 bg-black/30 items-center justify-center`}
          pointerEvents="auto"
        >
          <ActivityIndicator size="large" color={colors.white} />
        </View>
      ) : null}

      <DateTimePickerModal
        isVisible={activeDateField !== null && datePickerConfig !== null}
        mode="date"
        date={datePickerConfig?.current ?? startOfToday()}
        minimumDate={
          activeDateField === "vip_preview_date"
            ? undefined
            : (datePickerConfig?.min ?? startOfToday())
        }
        maximumDate={datePickerConfig?.max}
        onConfirm={onDatePicked}
        onCancel={() => setActiveDateField(null)}
        display={Platform.OS === "ios" ? "inline" : "default"}
      />
    </View>
  );
}
