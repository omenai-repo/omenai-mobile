import { Pressable, Text, View } from "react-native";
import React from "react";
import { colors } from "../../../../config/colors.config";
import BackFormButton from "../../../../components/buttons/BackFormButton";
import NextButton from "../../../../components/buttons/NextButton";
import { useIndividualAuthRegisterStore } from "../../../../store/auth/register/IndividualAuthRegisterStore";
import { mediumListing } from "data/uploadArtworkForm.data";
import tw from "twrnc";

type TabItemProps = {
  name: string;
  isSelected: boolean;
  onSelect: () => void;
};

export default function Preferences() {
  const { pageIndex, setPageIndex, preferences, setPreferences } = useIndividualAuthRegisterStore();

  const handleSelect = (value: string) => {
    if (preferences.includes(value)) {
      let arr = [...preferences];
      let index = arr.indexOf(value);
      arr.splice(index, 1);
      setPreferences(arr);
    } else if (preferences.length < 5) {
      setPreferences([...preferences, value]);
    }
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
        Select your art preference
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
            isSelected={preferences.includes(i.value)}
          />
        ))}
      </View>
      <View style={tw`flex-row gap-2.5 items-center mt-10 justify-between`}>
        <BackFormButton handleBackClick={() => setPageIndex(pageIndex - 1)} />
        <NextButton
          isDisabled={preferences.length < 5}
          handleButtonClick={() => setPageIndex(pageIndex + 1)}
        />
      </View>
    </View>
  );
}
