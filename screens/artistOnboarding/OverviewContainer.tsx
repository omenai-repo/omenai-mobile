import { View, Text, Pressable } from 'react-native';
import React from 'react';
import tw from 'twrnc';
import { SvgXml } from 'react-native-svg';
import { dropdownIcon, dropUpIcon } from 'utils/SvgImages';

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
        index === 'bio' && 'rounded-t-[15px]',
        index === 'CV Document' && 'rounded-b-[15px] border-b-[1px]',
      )}
    >
      <View style={tw`flex-row items-center`}>
        <Text style={tw`text-[15px] text-[#454545] font-bold flex-1`}>{title}</Text>
        <Pressable
          onPress={setOpen}
          style={tw`border border-[#F6F6F6] bg-[#F6F6F6] justify-center items-center h-[35px] w-[35px] rounded-[8px]`}
        >
          <SvgXml xml={open ? dropUpIcon : dropdownIcon} />
        </Pressable>
      </View>

      <Text style={tw`text-[13px] text-[#1A1A1A]00080] font-semibold mt-[3px]`}>
        Your answer: {data}
      </Text>

      {/* Display data when expanded */}
      {open && (
        <Pressable
          onPress={openModal}
          style={tw`h-[45px] rounded-full bg-[#1A1A1A] justify-center items-center mt-[10px]`}
        >
          <Text style={tw`text-white font-bold text-[14px]`}>Edit</Text>
        </Pressable>
      )}
    </View>
  );
};

export default OverviewContainer;
