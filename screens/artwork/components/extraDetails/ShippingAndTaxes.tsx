import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { colors } from "config/colors.config";
import { LinearGradient } from "expo-linear-gradient";
import { SvgXml } from "react-native-svg";
import { downArrIcon, upArrwIcon } from "utils/SvgImages";
import tw from "twrnc";
import Animated, { FadeInDown, FadeOut } from "react-native-reanimated";

export default function ShippingAndTaxes() {
  const [expand, setExpand] = useState(false);

  const handleToggle = () => {
    setExpand(!expand);
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={handleToggle} style={styles.header}>
        <Text style={styles.title}>Shipping & taxes</Text>

        <SvgXml xml={!expand ? downArrIcon : upArrwIcon} />
      </Pressable>

      {!expand && (
        <Animated.View
          entering={FadeInDown.duration(600).damping(300)} // Duration in milliseconds
          exiting={FadeOut.duration(500).damping(300)}
          style={tw`mb-[30px]`}
        >
          <View style={tw`h-[1px] w-full bg-[#0f0f0f]`} />
          <View style={styles.detailItem}>
            <Text
              style={[styles.detailItemText, { width: 120, fontWeight: "500" }]}
            >
              Taxes
            </Text>
            <Text style={[styles.detailItemText, { flex: 1 }]}>
              Calculated at checkout
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text
              style={[styles.detailItemText, { width: 120, fontWeight: "500" }]}
            >
              Shipping fee
            </Text>
            <Text style={[styles.detailItemText, { flex: 1 }]}>
              Calculated at checkout
            </Text>
          </View>
          <Text
            style={{
              textAlign: "center",
              marginTop: 5,
              textDecorationLine: "underline",
              color: "#fff",
              paddingTop: 10,
            }}
          >
            Learn more
          </Text>
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
    borderColor: "#0f0f0f",
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
  detailItem: {
    flexDirection: "row",
    gap: 20,
    paddingTop: 25,
  },
  detailItemText: {
    color: "#000",
    fontSize: 14,
  },
});
