import { View } from "react-native";
import React, { useState } from "react";
import AuthTabs from "../../../../components/auth/AuthTabs";
import IndividualForm from "./individual/IndividualForm";
import GalleryForm from "./gallery/GalleryForm";
import ArtistForm from "./artist/ArtistForm";
import tw from "twrnc";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function InputForm() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const insets = useSafeAreaInsets();

  return (
    <View style={[tw`flex-1 px-5 mt-5`, { marginBottom: insets.bottom }]}>
      <AuthTabs
        tabs={["Collector", "Artist", "Gallery"]}
        stateIndex={selectedIndex}
        handleSelect={(e) => setSelectedIndex(e)}
      />
      {selectedIndex === 0 && <IndividualForm />}
      {selectedIndex === 1 && <ArtistForm />}
      {selectedIndex === 2 && <GalleryForm />}
    </View>
  );
}
