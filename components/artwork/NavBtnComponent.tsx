import { View, Text, Pressable } from "react-native";
import React from "react";
import { SvgXml } from "react-native-svg";
import { rightArrowIcon } from "utils/SvgImages";
import tw from "twrnc";

const NavBtnComponent = ({ onPress }: { onPress: () => void }) => {
  return (
    <Pressable
      onPress={onPress}
      style={tw`justify-center items-center h-[40px] w-[40px]`}
    >
      <SvgXml xml={rightArrowIcon} />
    </Pressable>
  );
};

export default NavBtnComponent;
