import { View, Text, Pressable, Modal } from 'react-native';
import React, { useState } from 'react';
import tw from 'twrnc';
import { warningIconSm } from 'utils/SvgImages';
import FittedBlackButton from 'components/buttons/FittedBlackButton';
import LargeInput from 'components/inputs/LargeInput';

const DeclineOrderModal = ({
  isModalVisible,
  setIsModalVisible,
  confirmBtn,
}: {
  isModalVisible: boolean;
  setIsModalVisible: (e: boolean) => void;
  confirmBtn: () => void;
}) => {
  const [declineReason, setDeclineReason] = useState('');
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
          style={tw.style(`bg-white p-[30px] border border-[#0000001A] rounded-[14px] w-[80%]`)}
        >
          <LargeInput
            label="Reason for declining order"
            placeHolder="Input reason"
            value={declineReason}
            defaultValue={declineReason}
            onInputChange={(value) => setDeclineReason(value)}
            containerStyle={{
              flex: 0,
            }}
          />

          <Pressable
            onPress={() => {}}
            style={tw`h-[50px] justify-center items-center bg-[#C71C16] rounded-[30px] mt-[30px]`}
          >
            <Text style={tw`text-[15px] text-[#fff] font-semibold`}>Decline order</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default DeclineOrderModal;
