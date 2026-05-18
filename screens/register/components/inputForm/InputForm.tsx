import { View } from "react-native";
import React, { useCallback, useRef, useState } from "react";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { useIndividualAuthRegisterStore } from "#store/auth/register/IndividualAuthRegisterStore";
import { useGalleryAuthRegisterStore } from "#store/auth/register/GalleryAuthRegisterStore";
import { useArtistAuthRegisterStore } from "#store/auth/register/ArtistAuthRegisterStore";
import AuthTabs from "#components/auth/AuthTabs";
import IndividualForm from "./individual/IndividualForm";
import GalleryForm from "./gallery/GalleryForm";
import ArtistForm from "./artist/ArtistForm";
import tw from "twrnc";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLowRiskFeatureFlag } from "#hooks/useFeatureFlag";
import FormSkeleton from "#components/skeleton/FormSkeleton";
import { tabIndexFromAccountType } from "#utils/auth/tabIndexFromAccountType";

type InputFormProps = Readonly<{
  onTabChange?: (index: number) => void;
  onGalleryInviteValidated?: (validated: boolean) => void;
  onArtistInviteValidated?: (validated: boolean) => void;
}>;

export default function InputForm({
  onTabChange,
  onGalleryInviteValidated,
  onArtistInviteValidated,
}: InputFormProps) {
  const route = useRoute<any>();
  const onTabChangeRef = useRef(onTabChange);
  onTabChangeRef.current = onTabChange;

  const [selectedIndex, setSelectedIndex] = useState(() => {
    const idx = tabIndexFromAccountType(route.params?.account_type);
    return idx ?? 0;
  });
  const clearIndividual = useIndividualAuthRegisterStore((s) => s.clearState);
  const clearGallery = useGalleryAuthRegisterStore((s) => s.clearState);
  const clearArtist = useArtistAuthRegisterStore((s) => s.clearState);

  const resetAll = () => {
    clearIndividual();
    clearGallery();
    clearArtist();
  };

  const handleTabSwitch = (e: number) => {
    resetAll();
    setSelectedIndex(e);
    onTabChange?.(e);
  };

  useFocusEffect(
    useCallback(() => {
      const idx = tabIndexFromAccountType(route.params?.account_type);
      if (idx !== null) {
        setSelectedIndex(idx);
        onTabChangeRef.current?.(idx);
      }
    }, [route.params?.account_type]),
  );

  const insets = useSafeAreaInsets();

  const { value: collectorOnboardingEnabled, loading: collectorLoading } =
    useLowRiskFeatureFlag("collectoronboardingenabled", false);
  const { value: artistOnboardingEnabled, loading: artistLoading } =
    useLowRiskFeatureFlag("artistonboardingenabled");
  const { value: galleryOnboardingEnabled, loading: galleryLoading } =
    useLowRiskFeatureFlag("galleryonboardingenabled");
  const { value: waitlistActivated, loading: waitlistLoading } =
    useLowRiskFeatureFlag("waitlistActivated");

  return (
    <View style={[tw`flex-1 px-5 mt-5`, { marginBottom: insets.bottom }]}>
      <AuthTabs
        tabs={["Collector", "Artist", "Gallery"]}
        stateIndex={selectedIndex}
        handleSelect={handleTabSwitch}
      />
      {collectorLoading ||
      artistLoading ||
      galleryLoading ||
      waitlistLoading ? (
        <FormSkeleton style={tw`mt-2`} rows={4} />
      ) : (
        <>
          {selectedIndex === 0 && (
            <IndividualForm isEnabled={collectorOnboardingEnabled} />
          )}
          {selectedIndex === 1 && (
            <ArtistForm
              onInviteValidated={onArtistInviteValidated}
              isEnabled={artistOnboardingEnabled}
              waitlistActivated={waitlistActivated}
            />
          )}
          {selectedIndex === 2 && (
            <GalleryForm
              onInviteValidated={onGalleryInviteValidated}
              isEnabled={galleryOnboardingEnabled}
              waitlistActivated={waitlistActivated}
            />
          )}
        </>
      )}
    </View>
  );
}
