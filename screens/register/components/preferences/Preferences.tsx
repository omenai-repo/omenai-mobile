import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { colors } from "../../../../config/colors.config";
import { prefrencesList } from "../../../../constants/preferences.constants";
import BackFormButton from "../../../../components/buttons/BackFormButton";
import NextButton from "../../../../components/buttons/NextButton";
import { useIndividualAuthRegisterStore } from "../../../../store/auth/register/IndividualAuthRegisterStore";
import { mediumListing } from "data/uploadArtworkForm.data";
import tw from "twrnc";
import { SvgXml } from "react-native-svg";
import { checkedBox, uncheckedBox } from "utils/SvgImages";
import { registerAccount } from "services/register/registerAccount";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { screenName } from "constants/screenNames.constants";
import { useModalStore } from "store/modal/modalStore";

type TabItemProps = {
  name: string;
  isSelected: boolean;
  onSelect: () => void;
};

export default function Preferences() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const {
    pageIndex,
    setPageIndex,
    preferences,
    setPreferences,
    individualRegisterData,
    isLoading,
    setIsLoading,
    clearState,
  } = useIndividualAuthRegisterStore();
  const { updateModal } = useModalStore();
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

  const handleSubmit = async () => {
    setIsLoading(true);

    const data = {
      ...individualRegisterData,
      preferences,
    };

    const results = await registerAccount(data, "individual");

    if (results?.isOk) {
      const resultsBody = results?.body;
      clearState();
      navigation.navigate(screenName.verifyEmail, {
        account: { id: resultsBody.id, type: "individual" },
      });
    } else {
      updateModal({
        message: results?.body.message,
        modalType: "error",
        showModal: true,
      });
    }

    setIsLoading(false);
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
      <View style={styles.buttonsContainer}>
        <BackFormButton handleBackClick={() => setPageIndex(pageIndex - 1)} />
        <View style={{ flex: 1 }} />
        <Pressable
          style={tw.style(
            `rounded-[95px] h-[50px] px-[22px] justify-center items-center`,
            preferences.length < 5 ? `bg-[#E0E0E0]` : `bg-[#1A1A1A]`
          )}
          disabled={preferences.length < 5}
          onPress={handleSubmit}
        >
          <Text
            style={tw.style(
              `text-[15px] `,
              preferences.length < 5 ? `text-[#A1A1A1]` : `text-[#FFFFFF]`
            )}
          >
            {isLoading ? "Loading..." : "Create my account"}
          </Text>
        </Pressable>
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
