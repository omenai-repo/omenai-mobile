import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Platform,
  StatusBar,
} from "react-native";
import React from "react";
import BackScreenButton from "components/buttons/BackScreenButton";
import { colors } from "config/colors.config";
import { uploadArtworkStore } from "store/gallery/uploadArtworkStore";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";

export default function HeaderIndicator() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { activeIndex, setActiveIndex, isUploaded, clearData } =
    uploadArtworkStore();

  const titles = [
    "Upload artwork",
    "Dimensions",
    "Pricing",
    "Artist details",
    "Upload image",
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <BackScreenButton
          handleClick={() => {
            if (activeIndex === 1 || isUploaded) {
              navigation.goBack();
              clearData();
            } else {
              setActiveIndex(activeIndex - 1);
            }
          }}
          cancle={activeIndex === 1 || isUploaded}
        />
        <Text style={styles.topTitle}>{titles[activeIndex - 1]}</Text>
        <View style={{ width: 50 }} />
      </View>
      <View style={styles.indicatorContainer}>
        {titles.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              activeIndex >= index + 1 && { backgroundColor: "#000" },
            ]}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  indicatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  indicator: {
    height: 4,
    flex: 1,
    borderRadius: 2,
    backgroundColor: "#eee",
  },
  topTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    color: colors.primary_black,
  },
  safeArea: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
