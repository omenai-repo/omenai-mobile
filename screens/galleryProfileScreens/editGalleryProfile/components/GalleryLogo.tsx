import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { colors } from "config/colors.config";
import { getGalleryLogoFileView } from "lib/storage/getGalleryLogoFileView";
import { Feather } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "constants/screenNames.constants";

type GalleryLogoProps = {
  logo: string;
};

export default function GalleryLogo({ logo }: GalleryLogoProps) {
  const navigation = useNavigation<StackNavigationProp<any>>();

  let imageUrl = "";
  if (logo) {
    imageUrl = getGalleryLogoFileView(logo, 120, 120);
  }

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={() => navigation.navigate(screenName.gallery.uploadNewLogo)}
    >
      <ImageBackground
        source={imageUrl.length > 0 ? { uri: imageUrl } : { uri: "" }}
        style={styles.image}
      >
        <View style={styles.overlay}>
          <Feather name="edit-2" size={20} color={colors.white} />
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 120,
    width: 120,
    alignSelf: "center",
    backgroundColor: colors.grey50,
    marginBottom: 20,
    borderRadius: 60,
    overflow: "hidden",
  },
  image: {
    height: 120,
    width: 120,
    borderRadius: 60,
    overflow: "hidden",
  },
  overlay: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: `${colors.black}50`,
  },
});
