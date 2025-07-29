import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { getEditorialImageFilePreview } from 'lib/editorial/lib/getEditorialImageFilePreview';
import { colors } from 'config/colors.config';
import { fontNames } from 'constants/fontNames.constants';

type EditorialCardProps = {
  cover: string;
  headline: string;
  width: number;
  onPress: () => void;
};

export default function EditorialCard({ cover, headline, width, onPress }: EditorialCardProps) {
  const imageUrl = getEditorialImageFilePreview(cover, width);

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <View style={{ width }}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <Text numberOfLines={2} style={styles.headline}>
          {headline}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 220,
    borderRadius: 5,
    backgroundColor: colors.grey,
  },
  headline: {
    fontSize: 14,
    color: colors.primary_black,
    marginTop: 15,
    fontWeight: '500',
    fontFamily: fontNames.dmSans + 'Medium',
  },
});
