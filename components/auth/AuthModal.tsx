import { View, Text, Modal, Pressable, useWindowDimensions } from "react-native";
import React from "react";
import tw from "twrnc";
import { colors } from "config/colors.config";
import { SvgXml } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";

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
        style={[tw`flex-1 justify-center items-center`, { backgroundColor: `${colors.black}60` }]}
      >
        <Pressable onPress={(e) => e.stopPropagation()}>
          <LinearGradient
            colors={["#FFFFFF", "#FFFFFF"]}
            start={{ x: 2, y: 1 }}
            end={{ x: 0.1, y: 0.8 }}
            style={[
              tw`bg-white p-[25px] self-center rounded-[16px] border-[1.09px]`,
              {
                width: width - 120,
                borderColor: `${colors.black}1A`,
              },
            ]}
          >
            <SvgXml xml={icon} style={tw`self-center`} />
            <Text
              style={[
                tw`text-[16px] font-medium text-center mt-[20px]`,
                { color: colors.primary_black },
              ]}
            >
              {text}
            </Text>
            <View style={tw`flex-row items-center self-center mt-[25px]`}>
              <Pressable onPress={onPress1}>
                <Text style={[tw`text-[15px]`, { color: colors.primary_black }]}>{btn1Text}</Text>
              </Pressable>
              <View
                style={[tw`h-[15px] w-[2px] mx-[10px]`, { backgroundColor: `${colors.black}80` }]}
              />
              <Pressable onPress={onPress2}>
                <Text style={[tw`text-[15px]`, { color: colors.primary_black }]}>{btn2Text}</Text>
              </Pressable>
            </View>
          </LinearGradient>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default AuthModal;
