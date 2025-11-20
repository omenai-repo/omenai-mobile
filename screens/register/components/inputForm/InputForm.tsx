import { View } from "react-native";
import React, { useState } from "react";
import { useIndividualAuthRegisterStore } from "store/auth/register/IndividualAuthRegisterStore";
import { useGalleryAuthRegisterStore } from "store/auth/register/GalleryAuthRegisterStore";
import { useArtistAuthRegisterStore } from "store/auth/register/ArtistAuthRegisterStore";
import AuthTabs from "../../../../components/auth/AuthTabs";
import IndividualForm from "./individual/IndividualForm";
import GalleryForm from "./gallery/GalleryForm";
import ArtistForm from "./artist/ArtistForm";
import tw from "twrnc";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function InputForm() {
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
  };
  const insets = useSafeAreaInsets();

  return (
    <View style={[tw`flex-1 px-5 mt-5`, { marginBottom: insets.bottom }]}>
      <AuthTabs
        tabs={["Collector", "Artist", "Gallery"]}
        stateIndex={selectedIndex}
        handleSelect={handleTabSwitch}
      />
      {selectedIndex === 0 && <IndividualForm />}
      {selectedIndex === 1 && <ArtistForm />}
      {selectedIndex === 2 && <GalleryForm />}
    </View>
  );
}
