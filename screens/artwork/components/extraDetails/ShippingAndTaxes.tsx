import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { colors } from "config/colors.config";
import { LinearGradient } from "expo-linear-gradient";
import { SvgXml } from "react-native-svg";
import { downArrIcon, upArrwIcon } from "utils/SvgImages";
import tw from "twrnc";
import Animated, {
  useSharedValue,
  withTiming,
  Easing,
  withSpring,
  useAnimatedStyle,
} from "react-native-reanimated";

export default function ShippingAndTaxes() {
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
        <Text style={styles.title}>Shipping & taxes</Text>
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
        {/* <Text
          style={{
            textAlign: "center",
            marginTop: 5,
            textDecorationLine: "underline",
            color: "#fff",
            paddingTop: 10,
          }}
        >
          Learn more
        </Text> */}
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
  detailItem: {
    flexDirection: "row",
    gap: 20,
    paddingTop: 25,
  },
  detailItemText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
});
