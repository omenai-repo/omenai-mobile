import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { colors } from 'config/colors.config';
import { getGalleryLogoFileView } from 'lib/storage/getGalleryLogoFileView';
import omenaiAvatar from '../../../../assets/images/omenai-avatar.png';

export default function Logo({ url }: { url: string }) {
  const image = url ? getGalleryLogoFileView(url, 120, 120) : null;

  return (
    <Image
      source={image ? { uri: image } : omenaiAvatar}
      style={styles.container}
      resizeMode="cover"
    />
  );
}

const styles = StyleSheet.create({
  container: {
    height: 132,
    width: 132,
    backgroundColor: colors.grey50,
    borderRadius: 70,
  },
});
