import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  NativeSyntheticEvent,
  NativeScrollEvent,
  FlatList,
  TouchableOpacity,
  Linking,
} from 'react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { colors } from 'config/colors.config';
import { getPromotionalData } from 'services/promotional/getPromotionalContent';
import { getPromotionalFileView } from 'lib/storage/getPromotionalsFileView';
import BannerLoader from './BannerLoader';
import BannerCard from './BannerCard';

const { width: windowWidth } = Dimensions.get('window');
const ITEM_WIDTH = windowWidth - 50; // Width of each item, adjust this to your needs
const CENTER_OFFSET = (windowWidth - ITEM_WIDTH) / 2;

type BannerItemProps = {
  image?: string;
  headline: string;
  subheadline: string;
  cta: string;
};

export default function Banner({ reloadCount }: { reloadCount: number }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState([]);

  useMemo(() => {
    setData([]);
    async function handlePromitionalContent() {
      setLoading(true);

      const res = await getPromotionalData();

      if (res?.isOk) {
        setData(res.data);
      }

      setLoading(false);
    }

    handlePromitionalContent();
  }, [reloadCount]);

  const handleClick = async (url: string) => {
    const supportedLink = await Linking.canOpenURL(url);
    if (supportedLink) {
      await Linking.openURL(url);
    }
  };

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / ITEM_WIDTH);
    setCurrentIndex(index);
  };

  return (
    <View>
      <View
        style={{
          // backgroundColor: colors.primary_black,
          marginTop: 20,
        }}
      >
        {loading && data.length === 0 && <BannerLoader />}
        {!loading && data.length > 0 && (
          <FlatList
            data={data}
            renderItem={({ item }: { item: BannerItemProps }) => (
              <BannerCard
                cta={item.cta}
                headline={item.headline}
                subheadline={item.subheadline}
                image={item.image}
                handleClick={handleClick}
              />
            )}
            keyExtractor={(_, index) => JSON.stringify(index)}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            snapToAlignment="center"
            snapToInterval={ITEM_WIDTH}
            decelerationRate="fast"
            onScroll={onScroll}
            scrollEventThrottle={16}
            contentContainerStyle={{ paddingRight: 15 }}
          />
        )}
      </View>
      <View style={styles.indicatorsContainer}>
        {data.map((_, index) => (
          <View
            style={[
              styles.indicator,
              index === currentIndex && {
                backgroundColor: colors.primary_black,
              },
            ]}
            key={index}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 250,
    backgroundColor: colors.primary_black,
    flexDirection: 'row',
    width: windowWidth,
  },
  imageContainer: {
    width: 190,
  },
  contentContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    borderWidth: 1,
    borderColor: colors.white,
    borderRadius: 30,
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginTop: 30,
  },
  indicatorsContainer: {
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  indicator: {
    height: 8,
    width: 8,
    borderRadius: 5,
    backgroundColor: '#ddd',
  },
});
