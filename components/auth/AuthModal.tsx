import { View, Text, Modal, Pressable, useWindowDimensions } from 'react-native';
import React from 'react';
import tw from 'twrnc';
import { SvgXml } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

const AuthModal = ({
  modalVisible,
  setModalVisible,
  icon,
  text,
  btn1Text,
  btn2Text,
  onPress1,
  onPress2,
}: {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  icon: string;
  text: string;
  btn1Text: string;
  btn2Text: string;
  onPress1: () => void;
  onPress2: () => void;
}) => {
  const { width } = useWindowDimensions();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(!modalVisible)}
    >
      <Pressable
        onPressOut={() => setModalVisible(false)}
        style={tw`flex-1 bg-[#0003] justify-center items-center`}
      >
        <Pressable onPress={(e) => e.stopPropagation()}>
          <LinearGradient
            colors={['#FFFFFF', '#C4837A33']}
            start={{ x: 2, y: 1 }}
            end={{ x: 0.1, y: 0.8 }}
            style={tw.style(
              `bg-white p-[25px] self-center rounded-[16px] border-[1.09px] border-[#0000001A]`,
              {
                width: width - 120,
              },
            )}
          >
            <SvgXml xml={icon} style={tw`self-center`} />
            <Text style={tw`text-[16px] font-medium text-[#1A1A1A]000B2] text-center mt-[20px]`}>
              {text}
            </Text>
            <View style={tw`flex-row items-center self-center mt-[25px]`}>
              <Pressable onPress={onPress1}>
                <Text style={tw`text-[15px] text-[#1A1A1A]000]`}>{btn1Text}</Text>
              </Pressable>
              <View style={tw`h-[15px] bg-[#00000080] w-[2px] mx-[10px]`} />
              <Pressable onPress={onPress2}>
                <Text style={tw`text-[15px] text-[#1A1A1A]000]`}>{btn2Text}</Text>
              </Pressable>
            </View>
          </LinearGradient>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default AuthModal;
