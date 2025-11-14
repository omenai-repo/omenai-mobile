import { Pressable, Text, View } from "react-native";
import React from "react";
import { colors } from "../../../../config/colors.config";
import NextButton from "../../../../components/buttons/NextButton";
import { mediumListing } from "data/uploadArtworkForm.data";
import tw from "twrnc";
import { useArtistAuthRegisterStore } from "store/auth/register/ArtistAuthRegisterStore";
import BackFormButton from "components/buttons/BackFormButton";

type TabItemProps = {
  name: string;
  isSelected: boolean;
  onSelect: () => void;
};

const ArtistPreference = () => {
  const { pageIndex, setPageIndex, artistRegisterData, setArtStyles } =
    useArtistAuthRegisterStore();

  const handleSelect = (value: string) => {
    // If the selected value is already selected, deselect it
    // Otherwise, select the new value (replacing any previous selection)
    setArtStyles(artistRegisterData.art_style === value ? "" : value);
  };

  const TabItem = ({ name, isSelected, onSelect }: TabItemProps) => (
    <Pressable
      onPress={onSelect}
      style={[
        tw`h-10 px-5 rounded-lg border items-center justify-center`,
        { borderColor: colors.inputBorder },
        isSelected ? { backgroundColor: colors.black } : { backgroundColor: "#FAFAFA" },
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
    >
      <Text style={[tw`text-xs`, { color: isSelected ? colors.white : colors.primary_black }]}>
        {name}
      </Text>
    </Pressable>
  );

  return (
    <View>
      <Text style={[tw`text-xl font-medium`, { color: colors.primary_black }]}>
        Select your art style
      </Text>
      <View
        style={[
          tw`mt-3 bg-[#FAFAFA] rounded-lg border p-3 flex-row flex-wrap`,
          { borderColor: colors.inputBorder, rowGap: 10, columnGap: 10 },
        ]}
      >
        {mediumListing.map((i, idx) => (
          <TabItem
            name={i.value}
            key={idx}
            onSelect={() => handleSelect(i.value)}
            isSelected={artistRegisterData.art_style === i.value}
          />
        ))}
      </View>

      <View style={tw`flex-row mt-10 items-center justify-between`}>
        <BackFormButton handleBackClick={() => setPageIndex(pageIndex - 1)} />
        <NextButton
          isDisabled={!artistRegisterData.art_style} // Disabled if nothing is selected
          handleButtonClick={() => setPageIndex(pageIndex + 1)}
        />
      </View>
    </View>
  );
};

export default ArtistPreference;
