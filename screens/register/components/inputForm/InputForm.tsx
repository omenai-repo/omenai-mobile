import { View } from "react-native";
import React, { useEffect, useState } from "react";
import { useIndividualAuthRegisterStore } from "#store/auth/register/IndividualAuthRegisterStore";
import { useGalleryAuthRegisterStore } from "#store/auth/register/GalleryAuthRegisterStore";
import { useArtistAuthRegisterStore } from "#store/auth/register/ArtistAuthRegisterStore";
import AuthTabs from "../../../../components/auth/AuthTabs";
import IndividualForm from "./individual/IndividualForm";
import GalleryForm from "./gallery/GalleryForm";
import ArtistForm from "./artist/ArtistForm";
import tw from "twrnc";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLowRiskFeatureFlag } from "#hooks/useFeatureFlag";
import FormSkeleton from "#components/skeleton/FormSkeleton";

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
  const [selectedIndex, setSelectedIndex] = useState(0);
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

  const insets = useSafeAreaInsets();
  const [tabsKey, setTabsKey] = useState("init");

  const { value: collectorOnboardingEnabled, loading: collectorLoading } =
    useLowRiskFeatureFlag("collectoronboardingenabled", false);
  const { value: artistOnboardingEnabled, loading: artistLoading } =
    useLowRiskFeatureFlag("artistonboardingenabled");
  const { value: galleryOnboardingEnabled, loading: galleryLoading } =
    useLowRiskFeatureFlag("galleryonboardingenabled");
  const { value: waitlistActivated, loading: waitlistLoading } =
    useLowRiskFeatureFlag("waitlistActivated");

  useEffect(() => {
    // Force remount of AuthTabs after first paint to ensure animated values initialize
    const t = setTimeout(() => setTabsKey("ready"), 0);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={[tw`flex-1 px-5 mt-5`, { marginBottom: insets.bottom }]}>
      <AuthTabs
        key={tabsKey}
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
