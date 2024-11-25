import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useRef } from "react";
import { colors } from "config/colors.config";
import LottieView from "lottie-react-native";
import loaderAnimation from "assets/other/loader-animation.json";

type FittedBlackButtonProps = {
  value: string;
  isDisabled?: boolean;
  onClick: () => void;
  isLoading?: boolean;
};

export default function GetCodeButton({
  value,
  isDisabled,
  onClick,
  isLoading,
}: FittedBlackButtonProps) {
  const animation = useRef(null);

  if (isDisabled || isLoading)
    return (
      <View style={[styles.container, { backgroundColor: "#E0E0E0" }]}>
        {isDisabled ? (
          <Text style={[styles.text, { color: "#A1A1A1" }]}>{value}</Text>
        ) : (
          <LottieView
            autoPlay
            ref={animation}
            style={{
              width: 100,
              height: 100,
            }}
            source={loaderAnimation}
          />
        )}
      </View>
    );

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.container}
      onPress={onClick}
    >
      <Text style={styles.text}>{value}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    paddingHorizontal: 20,
    backgroundColor: colors.primary_black,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    alignContent: "center",
    borderRadius: 91,
    gap: 10,
  },
  text: {
    color: colors.white,
    fontSize: 16,
  },
});
