import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";

type SkeletonCardProps = {
  cardWidth: number;
  style?: ViewStyle;
};

export const SkeletonHighlightCard = ({
  cardWidth,
  style,
}: SkeletonCardProps) => {
  return (
    <Animated.View style={[styles.skeletonCard, { width: cardWidth }, style]}>
      <View style={{ flex: 1 }}>
        <View style={styles.skeletonLine} />
        <View style={[styles.skeletonLine, { width: "50%", marginTop: 6 }]} />
      </View>
      <View style={styles.skeletonCircle} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  skeletonCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  skeletonCircle: {
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: "#333",
    marginLeft: 10,
  },
  skeletonLine: {
    height: 10,
    width: "70%",
    borderRadius: 4,
    backgroundColor: "#333",
  },
});
