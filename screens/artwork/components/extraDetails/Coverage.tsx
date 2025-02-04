import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { colors } from "config/colors.config";
import { Feather, Octicons } from "@expo/vector-icons";
import { SvgXml } from "react-native-svg";
import { downArrIcon, upArrwIcon } from "utils/SvgImages";
import { LinearGradient } from "expo-linear-gradient";
import tw from "twrnc";
import Animated, { FadeInDown, FadeOut } from "react-native-reanimated";

export default function Coverage() {
  const [expand, setExpand] = useState(false);

  const handleToggle = () => {
    setExpand(!expand);
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={handleToggle} style={styles.header}>
        <Text style={styles.title}>Covered by the Omenai Guarantee</Text>

        <SvgXml xml={!expand ? downArrIcon : upArrwIcon} />
      </Pressable>
      {!expand && (
        <Animated.View
          entering={FadeInDown.duration(600).damping(300)} // Duration in milliseconds
          exiting={FadeOut.duration(500).damping(300)}
          style={tw`mb-[10px]`}
        >
          <View style={tw`h-[1px] w-full bg-[#00000033]`} />

          <View style={styles.mainContainer}>
            <View style={styles.detailItem}>
              <Feather name="lock" size={16} color={"#000"} />
              <Text style={[styles.detailItemText]}>Secure Checkout</Text>
            </View>
            <View style={styles.detailItem}>
              <Octicons name="verified" size={16} color={"#000"} />
              <Text style={[styles.detailItemText]}>
                Authenticity Guarantee
              </Text>
            </View>
            <Text
              style={{
                textAlign: "center",
                marginTop: 5,
                textDecorationLine: "underline",
                color: "#000",
              }}
            >
              Learn more
            </Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 25,
    borderWidth: 1,
    borderColor: "#00000033",
  },
  header: {
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.black,
    flex: 1,
  },
  mainContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 15,
  },
  detailItem: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  detailItemText: {
    color: "#000",
    fontSize: 14,
    lineHeight: 20,
  },
});
