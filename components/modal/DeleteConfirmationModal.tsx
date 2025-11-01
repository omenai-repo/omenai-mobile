import React from 'react';
import { Modal, Text, View, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import LongBlackButton from 'components/buttons/LongBlackButton';
import { colors } from 'config/colors.config';
import { BlurView } from 'expo-blur';

type DeleteConfirmationModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onConfirmDelete: () => void;
};

export default function DeleteConfirmationModal({
  isVisible,
  onClose,
  onConfirmDelete,
}: DeleteConfirmationModalProps) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={tw`flex-1 justify-center items-center`}>
        <BlurView intensity={30} style={tw`absolute inset-0`} />
        <View style={tw`bg-white rounded-2xl p-6 w-[90%] max-w-md items-center`}>
          {/* Question Mark Icon */}
          <View style={tw`w-16 h-16 rounded-full bg-yellow-400 items-center justify-center mb-4`}>
            <Text style={tw`text-black text-4xl font-bold`}>?</Text>
          </View>

          <Text style={tw`text-2xl font-bold text-[#1A1A1A] mb-2`}>Are you sure?</Text>
          <Text style={tw`text-base text-[#1A1A1A] text-center mb-3`}>
            You want to delete your account permanently.
          </Text>
          <Text style={tw`text-sm text-[#858585] text-center mb-6 leading-5`}>
            Ensuring that the user understands the consequences of deleting their account{' '}
            <Text style={tw`font-bold text-[#1A1A1A]`}>loss of data, subscriptions, etc.</Text>
          </Text>

          <View style={tw`flex-row w-full gap-3`}>
            <View style={tw`flex-1`}>
              <LongBlackButton
                value="Delete"
                onClick={onConfirmDelete}
                bgColor="#ff0000"
                textColor={colors.white}
              />
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onClose}
              style={tw`flex-1 h-[55px] border border-black rounded-[95px] items-center justify-center bg-white`}
            >
              <Text style={tw`text-base text-black`}>Keep Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
