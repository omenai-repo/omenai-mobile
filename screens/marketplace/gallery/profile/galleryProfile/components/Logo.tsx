import { Image, StyleSheet } from "react-native";
import React from "react";
import { colors } from "#config/colors.config";
import { getGalleryLogoFileView } from "#lib/storage/getGalleryLogoFileView";
import { images } from "#constants/images.constants";
import tw from "#lib/tailwind";

export default function Logo({ url }: { url: string }) {
  const image = url ? getGalleryLogoFileView(url, 120, 120) : null;
  return (
    <Image
      source={image ? { uri: image } : images.omenaiAvatar}
      style={[tw`rounded-sm`, styles.container]}
      resizeMode="cover"
    />
  );
}

const styles = StyleSheet.create({
  container: {
    height: 120,
    width: 120,
    backgroundColor: colors.grey50,
  },
});
