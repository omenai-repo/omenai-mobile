import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { colors } from "../../../../config/colors.config";
import NextButton from "../../../../components/buttons/NextButton";
import { artistStyle } from "data/uploadArtworkForm.data";
import tw from "twrnc";
import { SvgXml } from "react-native-svg";
import { checkedBox, uncheckedBox } from "utils/SvgImages";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useArtistAuthRegisterStore } from "store/auth/register/ArtistAuthRegisterStore";

type TabItemProps = {
  name: string;
  isSelected: boolean;
  onSelect: () => void;
};

const ArtistPreference = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { pageIndex, setPageIndex, artStyles, setArtStyles } =
    useArtistAuthRegisterStore();
  const [checkBox, setCheckBox] = useState<any>([]);

  const checks = [
    {
      id: 1,
      text: "By ticking this box, I accept the Terms of use and Privacy Policy of creating an account with Onemai.",
    },
    {
      id: 2,
      text: "By ticking this box, I  agree to subscribing to Omenai’s  mailing list and receiving promotional emails.",
    },
  ];

  const handleCheckPress = (id: number) => {
    if (checkBox.includes(id)) {
      setCheckBox(checkBox.filter((checkId: number) => checkId !== id));
    } else {
      setCheckBox([...checkBox, id]);
    }
  };

  const handleSelect = (value: string) => {
    if (artStyles.includes(value)) {
      let arr = [...artStyles];
      let index = arr.indexOf(value);
      arr.splice(index, 1);
      setArtStyles(arr);
    } else if (artStyles.length < 5) {
      setArtStyles([...artStyles, value]);
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

  const Conatiner = ({
    onPress,
    text,
    id,
  }: {
    onPress: () => void;
    text: string;
    id: number;
  }) => {
    return (
      <Pressable onPress={onPress} style={tw`flex-row gap-[15px]`}>
        <SvgXml xml={checkBox.includes(id) ? checkedBox : uncheckedBox} />
        <Text style={tw`text-[14px] text-[#858585] leading-[20px]`}>
          {text}
        </Text>
      </Pressable>
    );
  };

  return (
    <View>
      <Text style={tw`text-[#1A1A1A] text-[20px] font-medium`}>
        Select your art style
      </Text>
      <View style={styles.tabsContainer}>
        {artistStyle.map((i, idx) => (
          <TabItem
            name={i.value}
            key={idx}
            onSelect={() => handleSelect(i.value)}
            isSelected={artStyles.includes(i.value)}
          />
        ))}
      </View>
      <View
        style={tw`border-[0.96px] border-[#E0E0E0] bg-[#FAFAFA] rounded-[8px] mt-[30px] pl-[15px] pr-[25px] pt-[20px] py-[30px] gap-[25px]`}
      >
        {checks.map(({ id, text }: { id: number; text: string }) => (
          <Conatiner
            key={id}
            id={id}
            text={text}
            onPress={() => handleCheckPress(id)}
          />
        ))}
      </View>
      <View style={tw`flex-row mt-[40px]`}>
        <View style={{ flex: 1 }} />
        <NextButton
          // isDisabled={checkIsDisabled()}
          isDisabled={false}
          handleButtonClick={() => setPageIndex(pageIndex + 1)}
        />
      </View>
    </View>
  );
};

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

export default ArtistPreference;
