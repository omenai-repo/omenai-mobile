import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { colors } from "../../config/colors.config";
import AntDesign from "@expo/vector-icons/AntDesign";

type handleBackCLickProp = {
  handleBackClick: () => void;
  disabled?: boolean;
};

export default function BackFormButton({
  handleBackClick,
  disabled,
}: handleBackCLickProp) {
  return (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.container}
      disabled={disabled}
      onPress={handleBackClick}
    >
      <AntDesign name="arrowleft" color={colors.primary_black} size={24} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    width: 70,
    borderWidth: 1,
    borderColor: colors.primary_black,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 95,
  },
});
