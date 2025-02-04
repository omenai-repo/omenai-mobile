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
  children?: React.ReactNode;
  height?: number;
};

export default function FittedBlackButton({
  value,
  isDisabled,
  onClick,
  isLoading,
  children,
  height,
}: FittedBlackButtonProps) {
  const animation = useRef(null);

  if (isDisabled || isLoading)
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: "#E0E0E0" },
          height ? { height: height } : null,
        ]}
      >
        {isDisabled ? (
          <>
            <Text style={[styles.text, { color: "#A1A1A1" }]}>{value}</Text>
            {children}
          </>
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
      activeOpacity={0.9}
      style={[styles.container, height ? { height: height } : null]}
      onPress={onClick}
    >
      <Text style={styles.text}>{value}</Text>
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 45,
    backgroundColor: colors.primary_black,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    alignContent: "center",
    borderRadius: 91,
    gap: 10,
    paddingHorizontal: 20,
  },
  text: {
    color: colors.white,
    fontSize: 16,
  },
});
