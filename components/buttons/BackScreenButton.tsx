import { StyleSheet, View, TouchableOpacity } from "react-native";
import React from "react";
import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "#config/colors.config";
import { useDevice } from "#hooks/useDevice";

type BackScreenButtonTypes = {
  handleClick: () => void;
  cancle?: boolean;
  color?: string;
};

export default function BackScreenButton({
  handleClick,
  cancle,
  color,
}: Readonly<BackScreenButtonTypes>) {
  const { isTablet } = useDevice();
  const iconSize = isTablet ? 30 : 25;

  return (
    <TouchableOpacity activeOpacity={1} onPress={handleClick}>
      <View
        style={[
          styles.container,
          isTablet && { height: 60, width: 60, borderRadius: 30 },
        ]}
      >
        {cancle ? (
          <Feather
            name="x"
            color={color ?? colors.primary_black}
            size={iconSize}
          />
        ) : (
          <MaterialCommunityIcons
            name="keyboard-backspace"
            size={iconSize}
            color={color ?? colors.primary_black}
          />
          // <AntDesign
          //   name="arrow-left"
          //   color={color ?? colors.primary_black}
          //   size={iconSize}
          // />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    width: 50,

    alignItems: "center",
    justifyContent: "center",
  },
});
