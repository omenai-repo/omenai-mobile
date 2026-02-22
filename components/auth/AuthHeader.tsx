import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { colors } from "../../config/colors.config";
import { SafeAreaView } from "react-native-safe-area-context";

import { useDevice } from "#hooks/useDevice";

type AuthHeaderProps = {
  readonly title: string;
  readonly subTitle: string;
  readonly handleBackClick: () => void;
};

export default function AuthHeader({
  title,
  subTitle,
  handleBackClick,
}: AuthHeaderProps) {
  const { isTablet } = useDevice();

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          paddingHorizontal: isTablet ? 40 : 20,
          paddingBottom: isTablet ? 30 : 20,
          paddingTop: 10,
        }}
      >
        <TouchableOpacity style={styles.backButton} onPress={handleBackClick}>
          <AntDesign name="arrow-left" color={colors.white} size={20} />
        </TouchableOpacity>
        <Text style={[styles.headerText, isTablet && { fontSize: 28 }]}>
          {title}
        </Text>
        <Text style={[styles.subText, isTablet && { fontSize: 18 }]}>
          {subTitle}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.black,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  backButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.black_light,
  },
  headerText: {
    fontSize: 18,
    color: colors.white,
    fontWeight: "400",
    marginTop: 20,
  },
  subText: {
    fontSize: 12,
    marginTop: 10,
    color: colors.white,
  },
});
