import { Dimensions, Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors } from 'config/colors.config';
import { getImageFileView } from 'lib/storage/getImageFileView';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { screenName } from 'constants/screenNames.constants';
import { resizeImageDimensions } from 'utils/utils_resizeImageDimensions.utils';
import { utils_formatPrice } from 'utils/utils_priceFormatter';
import EditArtworkButton from 'components/buttons/EditArtworkButton';

type MiniArtworkCardType = {
  title: string;
  url: string;
  art_id: string;
  artist: string;
  usd_price: number;
};

export default function GalleryMiniArtworkCard({
  url,
  title,
  art_id,
  artist,
  usd_price,
}: MiniArtworkCardType) {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const screenWidth = Dimensions.get('window').width;
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [renderImage, setRenderImage] = useState(false);

  let imageWidth = 0;
  imageWidth = (screenWidth - 60) / 2; //screen width minus paddings applied to grid view tnen divided by two, to get the width of a single card
  const image_href = getImageFileView(url, imageWidth);

  useEffect(() => {
    const calculatedWidth = (screenWidth - 60) / 2; // 20px left + 20px right + 20px gap between
    const image_href = getImageFileView(url, Math.round(calculatedWidth));

    Image.getSize(image_href, (defaultWidth, defaultHeight) => {
      const { width, height } = resizeImageDimensions(
        { width: defaultWidth, height: defaultHeight },
        calculatedWidth,
        300, // optional max height
      );
      setImageDimensions({ height, width });
      setRenderImage(true);
    });
  }, [url, screenWidth]);

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={[styles.container, { width: imageDimensions.width }]}
      onPress={() => {
        navigation.push(screenName.artwork, { title, url });
      }}
    >
      {renderImage ? (
        <View
          style={{
            width: imageDimensions.width,
            height: imageDimensions.height,
            position: 'relative',
          }}
        >
          <Image
            source={{ uri: image_href }}
            style={{
              width: imageDimensions.width,
              height: imageDimensions.height,
              objectFit: 'contain',
            }}
            resizeMode="contain"
          />
          <EditArtworkButton
            handlePress={() => {
              navigation.navigate(screenName.gallery.editArtwork, {
                art_id: art_id,
              });
              console.log('here');
            }}
          />
        </View>
      ) : (
        <View
          style={{
            width: imageDimensions.width || (screenWidth - 60) / 2,
            height: imageDimensions.height || 200,
            backgroundColor: '#f5f5f5',
          }}
        />
      )}
      <View style={styles.mainDetailsContainer}>
        <Text style={{ fontSize: 14, color: colors.primary_black }}>{title}</Text>
        <Text style={{ fontSize: 12, color: colors.primary_black, opacity: 0.7 }}>{artist}</Text>
        <Text>{utils_formatPrice(usd_price, '$')}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 0,
  },
  mainDetailsContainer: {
    marginTop: 10,
    gap: 5,
  },
});
