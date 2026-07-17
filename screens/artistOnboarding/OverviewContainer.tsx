import { View, Text, Pressable } from "react-native";
import React from "react";
import tw from "twrnc";
import { SvgXml } from "react-native-svg";
import { dropdownIcon, dropUpIcon } from "#utils/SvgImages";
import FittedBlackButton from "#components/buttons/FittedBlackButton";

const OverviewContainer = ({
  title,
  data,
  open,
  setOpen,
  index,
  openModal,
}: {
  title: string;
  data: string;
  open: boolean;
  setOpen: () => void;
  index: string;
  openModal: () => void;
}) => {
  return (
    <View
      style={tw.style(
        `border-t-[1px] border-l-[1px] border-r-[1px] border-[#0000001A] bg-[#fff] p-[15px]`,
        index === "bio" && "rounded-t-md",
        index === "CV Document" && "rounded-b-md border-b-[1px]",
      )}
    >
      <View style={tw`flex-row items-center`}>
        <Text style={tw`text-sm text-[#454545] font-bold flex-1`}>{title}</Text>
        <Pressable
          onPress={setOpen}
          style={tw`border border-[#F6F6F6] bg-[#F6F6F6] justify-center items-center h-[35px] w-[35px] rounded-sm`}
        >
          <SvgXml xml={open ? dropUpIcon : dropdownIcon} />
        </Pressable>
      </View>

      <Text style={tw`text-sm text-[#1A1A1A]00080] font-semibold mt-[3px]`}>
        Your answer: {data}
      </Text>

      {/* Display data when expanded */}
      {open && (
        <FittedBlackButton
          value="Edit"
          onClick={openModal}
          style={tw`h-[45px] mt-[10px]`}
          textStyle={tw`font-bold text-[14px]`}
        />
      )}
    </View>
  );
};

export default OverviewContainer;
