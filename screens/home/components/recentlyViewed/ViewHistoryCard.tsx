import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { screenName } from 'constants/screenNames.constants';
import { getImageFileView } from 'lib/storage/getImageFileView';
import { colors } from 'config/colors.config';
import { resizeImageDimensions } from 'utils/utils_resizeImageDimensions.utils';

export default function ViewHistoryCard({
  url,
  art_id,
  artist,
  artwork,
}: {
  url: string;
  art_id: string;
  artwork: string;
  artist: string;
}) {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const image_href = getImageFileView(url, 270);

  const [imageDimensions, setImageDimensions] = useState({
    width: 200,
    height: 200,
  });

  useEffect(() => {
    let isMounted = true;

    Image.getSize(
      image_href,
      (defaultWidth, defaultHeight) => {
        if (!isMounted) return;
        const { width, height } = resizeImageDimensions(
          { width: defaultWidth, height: defaultHeight },
          300,
          300, // Optional maxHeight
        );
        setImageDimensions({ height, width });
      },
      (error) => {
        console.warn('Failed to get image size for history card:', error?.message || error);
      },
    );

    return () => {
      isMounted = false;
    };
  }, [image_href]);

  return (
    <View>
      <View style={{ flex: 1 }} />
      <TouchableOpacity
        activeOpacity={1}
        style={styles.container}
        onPress={() => {
          navigation.navigate(screenName.artwork, { title: artwork, url });
        }}
      >
        <Image
          source={{ uri: image_href }}
          style={{
            width: imageDimensions.width,
            height: imageDimensions.height,
            borderRadius: 10,
          }}
          resizeMode="cover"
        />
        <View style={styles.mainDetailsContainer}>
          <Text style={{ fontSize: 14, color: colors.primary_black }}>{artwork}</Text>
          <Text
            style={{
              fontSize: 12,
              color: colors.primary_black,
              opacity: 0.7,
              marginTop: 5,
            }}
          >
            {artist}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // width: 270,
    marginLeft: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  mainDetailsContainer: {
    marginTop: 10,
  },
});
