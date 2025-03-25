import { View, Text, Pressable, Modal } from 'react-native';
import React from 'react';
import tw from 'twrnc';
import { SvgXml } from 'react-native-svg';
import { warningIconSm } from 'utils/SvgImages';

const ConfirmationModal = ({
  isModalVisible,
  setIsModalVisible,
  confirmBtn,
}: {
  isModalVisible: boolean;
  setIsModalVisible: (e: boolean) => void;
  confirmBtn: () => void;
}) => {
  return (
    <Modal
      visible={isModalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setIsModalVisible(false)}
    >
      <Pressable
        onPressOut={() => setIsModalVisible(false)}
        style={tw`flex-1 bg-[#0003] justify-center items-center`}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={tw.style(`bg-white p-5 border border-[#0000001A] rounded-[14px] w-[80%]`)}
        >
          <View style={tw`flex-row self-center items-center gap-[20px]`}>
            <SvgXml xml={warningIconSm} />
            <Text style={tw`text-[16px] text-[#1A1A1A] font-medium`}>Verify your Information</Text>
          </View>
          <View style={tw`bg-[#00000033] h-[1px] my-[25px]`} />

          <Text style={tw`text-[14px] text-[#1A1A1A] text-center mx-[30px]`}>
            Please ensure that all the information provided is accurate and correctly reflected in
            your CV/Resume, as it will directly impact the outcome of your account verification.
          </Text>

          <Pressable
            onPress={confirmBtn}
            style={tw`rounded-[20px] mt-[30px] border border-[#000000] h-[40px] justify-center items-center`}
          >
            <Text style={tw`text-[14px] text-[#000000] font-medium`}>
              I understand and I wish to Proceed
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default ConfirmationModal;
