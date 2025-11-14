import { Text, View } from "react-native";
import React from "react";
import { colors } from "../../../../config/colors.config";
import NextButton from "../../../../components/buttons/NextButton";
import { mediumListing } from "data/uploadArtworkForm.data";
import tw from "twrnc";
import { useArtistAuthRegisterStore } from "store/auth/register/ArtistAuthRegisterStore";
import BackFormButton from "components/buttons/BackFormButton";
import SelectableTag from "components/general/SelectableTag";

const ArtistPreference = () => {
  const { pageIndex, setPageIndex, artistRegisterData, setArtStyles } =
    useArtistAuthRegisterStore();

  const handleSelect = (value: string) => {
    setArtStyles(artistRegisterData.art_style === value ? "" : value);
  };

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
          <SelectableTag
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
