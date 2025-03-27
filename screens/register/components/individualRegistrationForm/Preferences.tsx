import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { colors } from "../../../../config/colors.config";
import BackFormButton from "../../../../components/buttons/BackFormButton";
import NextButton from "../../../../components/buttons/NextButton";
import { useIndividualAuthRegisterStore } from "../../../../store/auth/register/IndividualAuthRegisterStore";
import { mediumListing } from "data/uploadArtworkForm.data";
import tw from "twrnc";
import { useModalStore } from "store/modal/modalStore";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type TabItemProps = {
  name: string;
  isSelected: boolean;
  onSelect: () => void;
};

export default function Preferences() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { pageIndex, setPageIndex, preferences, setPreferences } =
    useIndividualAuthRegisterStore();
  const { updateModal } = useModalStore();

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

  const TabItem = ({ name, isSelected, onSelect }: TabItemProps) => {
    if (isSelected)
      return (
        <TouchableOpacity
          style={[styles.tabItem, styles.selectedTabItem]}
          activeOpacity={0.7}
          onPress={onSelect}
        >
          <Text style={{ fontSize: 12, color: "#fff" }}>{name}</Text>
        </TouchableOpacity>
      );

    return (
      <TouchableOpacity
        style={styles.tabItem}
        activeOpacity={0.7}
        onPress={onSelect}
      >
        <Text style={{ fontSize: 12, color: "#1a1a1a" }}>{name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ marginTop: 20 }}>
      <Text style={tw`text-[#1A1A1A] text-[20px] font-medium`}>
        Select your art preference
      </Text>
      <View style={styles.tabsContainer}>
        {mediumListing.map((i, idx) => (
          <TabItem
            name={i.value}
            key={idx}
            onSelect={() => handleSelect(i.value)}
            isSelected={preferences.includes(i.value)}
          />
        ))}
      </View>
      <View style={styles.buttonsContainer}>
        <BackFormButton handleBackClick={() => setPageIndex(pageIndex - 1)} />
        <View style={{ flex: 1 }} />
        <NextButton
          isDisabled={preferences.length < 5}
          handleButtonClick={() => setPageIndex(pageIndex + 1)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.primary_black,
    fontSize: 16,
  },
  tabsContainer: {
    marginTop: 20,
    backgroundColor: "#FAFAFA",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: 15,
    paddingVertical: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 25,
    columnGap: 10,
  },
  tabItem: {
    height: 40,
    paddingHorizontal: 20,
    backgroundColor: "#FAFAFA",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedTabItem: {
    backgroundColor: colors.black,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginTop: 40,
  },
});
