import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { colors } from "config/colors.config";
import { EvilIcons, Feather, Octicons } from "@expo/vector-icons";
import { SvgXml } from "react-native-svg";
import { downArrIcon, upArrwIcon } from "utils/SvgImages";
import { LinearGradient } from "expo-linear-gradient";
import tw from "twrnc";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export default function Coverage() {
  const [expand, setExpand] = useState(false);
  const height = useSharedValue(0);

  const handleToggle = () => {
    if (expand) {
      height.value = withSpring(0, {
        damping: 20,
        mass: 1,
        stiffness: 100,
        overshootClamping: true,
        restDisplacementThreshold: 0.001,
        restSpeedThreshold: 0.001,
      }); // Collapse
    } else {
      height.value = withSpring(120); // Adjust this value to match content height
    }
    setExpand(!expand);
  };

  // Animated style for height
  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
    overflow: "hidden",
  }));
  return (
    <LinearGradient
      colors={["#FFF50914", "#45FEFE14"]}
      style={styles.container}
    >
      <Pressable onPress={handleToggle} style={styles.header}>
        <Text style={styles.title}>Covered by the Omenai Guarantee</Text>
        <View
          style={tw`bg-[#FFFFFF] shadow-md shadow-[#FFF5097A] h-[30px] w-[30px] rounded-full justify-center items-center`}
        >
          <SvgXml xml={expand ? downArrIcon : upArrwIcon} />
        </View>
      </Pressable>
      <Animated.View style={[animatedStyle]}>
        <LinearGradient
          colors={["#FFF508", "#45FEFE"]}
          start={{ x: 0.2, y: 0.1 }}
          style={tw`h-[1px] w-full`}
        />
        <View style={styles.mainContainer}>
          <View style={styles.detailItem}>
            <Feather name="lock" size={16} color={"#00000090"} />
            <Text style={[styles.detailItemText]}>Secure Checkout</Text>
          </View>
          <View style={styles.detailItem}>
            <Octicons name="verified" size={16} color={"#00000090"} />
            <Text style={[styles.detailItemText]}>Authenticity Guarantee</Text>
          </View>
          <Text
            style={{
              textAlign: "center",
              marginTop: 5,
              textDecorationLine: "underline",
            }}
          >
            Learn more
          </Text>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#141414",
    borderRadius: 20,
    paddingHorizontal: 25,
  },
  header: {
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.white,
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
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
  },
});
