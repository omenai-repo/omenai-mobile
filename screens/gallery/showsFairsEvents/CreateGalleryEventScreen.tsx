import React, { useCallback } from "react";
import {
  ActivityIndicator,
  Platform,
  Text,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import tw from "twrnc";

import LongBlackButton from "#components/buttons/LongBlackButton";
import LongWhiteButton from "#components/buttons/LongWhiteButton";
import BackHeaderTitle from "#components/header/BackHeaderTitle";
import PremiumStateCard from "#components/general/PremiumStateCard";
import { colors } from "#config/colors.config";
import { useModalStore } from "#store/modal/modalStore";
import { screenName } from "#constants/screenNames.constants";

import { startOfToday } from "./helpers/createEventHelpers";
import { useCreateGalleryEventForm } from "./hooks/useCreateGalleryEventForm";
import { useEventDatePicker } from "./hooks/useEventDatePicker";
import { useGalleryEventMedia } from "./hooks/useGalleryEventMedia";
import CreateEventFormFields from "./components/CreateEventFormFields";
import ArtworkSelectorModal from "./components/ArtworkSelectorModal";

type CreateStackParam = {
  "create-gallery-event": { accessRestricted?: boolean } | undefined;
};
type Props = NativeStackScreenProps<CreateStackParam, "create-gallery-event">;

function CreateGalleryEventScreenImpl({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { updateModal } = useModalStore();
  const isAccessRestricted = Boolean(route?.params?.accessRestricted);

  const onSuccess = useCallback(() => navigation.goBack(), [navigation]);

  const {
    galleryId,
    formData,
    setFormData,
    errors,
    setErrors,
    isSubmitting,
    isModalOpen,
    setIsModalOpen,
    isFinalizing,
    countryOptions,
    handleChange,
    onContinueToArtwork,
    executeFinalSubmission,
  } = useCreateGalleryEventForm(onSuccess);

  const {
    coverAsset,
    coverPreviewUri,
    installationAssets,
    pickCover,
    addInstallationImages,
    removeInstallationAt,
  } = useGalleryEventMedia(updateModal);

  const {
    activeDateField,
    setActiveDateField,
    datePickerConfig,
    handleDatePicked,
  } = useEventDatePicker(
    formData.start_date,
    formData.end_date,
    formData.vip_preview_date,
  );

  const onDateConfirm = useCallback(
    (picked: Date) => handleDatePicked(picked, setFormData, setErrors),
    [handleDatePicked, setFormData, setErrors],
  );

  const onClearVipDate = useCallback(() => {
    setFormData((p) => ({ ...p, vip_preview_date: "" }));
    setErrors((e) => ({ ...e, vip_preview_date: "" }));
  }, [setFormData, setErrors]);

  const handleContinue = useCallback(
    () => onContinueToArtwork(coverAsset),
    [onContinueToArtwork, coverAsset],
  );

  const handleFinalSubmit = useCallback(
    (art: { featured_artworks: string[]; participating_artists: string[] }) => {
      if (!coverAsset) return;
      executeFinalSubmission(art, coverAsset, installationAssets);
    },
    [executeFinalSubmission, coverAsset, installationAssets],
  );

  if (isAccessRestricted) {
    return (
      <PremiumStateCard
        icon="lock-closed"
        title="Access Restricted"
        description="You are not eligible to access this resource because it requires a higher subscription tier. Upgrade to the Principal plan to unlock this feature and gain full access."
        onBack={() => navigation.goBack()}
        actionButton={
          <LongWhiteButton
            value="Upgrade to Principal Plan"
            onClick={() =>
              (navigation as any).navigate(screenName.gallery.billing, {
                plan_action: null,
              })
            }
            outline={false}
            style={{ height: 48, backgroundColor: colors.white }}
            textStyle={{
              color: colors.primary_black,
              fontSize: 14,
              fontWeight: "bold",
            }}
          />
        }
      />
    );
  }

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
        enableResetScrollToCoords={false}
      >
        <Text style={tw`text-sm text-neutral-500 mb-8`}>
          Define the specifics of your upcoming programming.
        </Text>

        <CreateEventFormFields
          formData={formData}
          errors={errors}
          coverPreviewUri={coverPreviewUri}
          installationAssets={installationAssets}
          countryOptions={countryOptions}
          onPickCover={pickCover}
          onAddInstallations={addInstallationImages}
          onRemoveInstallation={removeInstallationAt}
          onFieldChange={handleChange}
          onOpenDatePicker={setActiveDateField}
          onClearVipDate={onClearVipDate}
        />

        <LongBlackButton
          value={isSubmitting ? "Processing..." : "Continue to Artwork Selection"}
          onClick={handleContinue}
          isLoading={isSubmitting || isFinalizing}
          isDisabled={isFinalizing}
          style={tw`mb-16`}
        />
      </KeyboardAwareScrollView>

      <ArtworkSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        galleryId={galleryId}
        onFinalSubmit={handleFinalSubmit}
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
        onConfirm={onDateConfirm}
        onCancel={() => setActiveDateField(null)}
        display={Platform.OS === "ios" ? "inline" : "default"}
      />
    </View>
  );
}

export default function CreateGalleryEventScreen(props: Props) {
  return <CreateGalleryEventScreenImpl {...props} />;
}
