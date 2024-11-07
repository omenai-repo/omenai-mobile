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
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { colors } from "config/colors.config";
import { getPromotionalData } from "services/promotional/getPromotionalContent";
import { getPromotionalFileView } from "lib/storage/getPromotionalsFileView";
import BannerLoader from "./BannerLoader";

const { width: windowWidth } = Dimensions.get("window");
const ITEM_WIDTH = windowWidth; // Width of each item, adjust this to your needs
const CENTER_OFFSET = (windowWidth - ITEM_WIDTH) / 2;

type BannerItemProps = {
  image?: string;
  headline: string;
  subheadline: string;
  cta: string;
};

export default function Banner({ reloadCount }: { reloadCount: number }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState([]);

  useEffect(() => {
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

  const Item = ({ image, headline, subheadline, cta }: BannerItemProps) => {
    const [img, setImg] = useState("");
    useEffect(() => {
      if (image) {
        const image_href = getPromotionalFileView(image, 500);
        setImg(image_href);
      }
    }, [image]);

    return (
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: img ? img : undefined }}
            style={{ width: 180, height: 270 }}
            resizeMode="cover"
          />
        </View>
        <View style={styles.contentContainer}>
          <Text
            style={{ fontSize: 21, fontWeight: "500", color: colors.white }}
          >
            {headline}
          </Text>
          <Text style={{ fontSize: 14, color: colors.white, marginTop: 7 }}>
            {subheadline}
          </Text>

          <TouchableOpacity onPress={() => handleClick(cta)}>
            <View style={{ flexWrap: "wrap" }}>
              <View style={styles.button}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "500",
                    color: colors.white,
                  }}
                >
                  View resource
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View>
      <View
        style={{
          backgroundColor: colors.primary_black,
          marginTop: 40,
          minHeight: 200,
        }}
      >
        {loading && data.length === 0 && <BannerLoader />}
        {!loading && data.length > 0 && (
          <FlatList
            data={data}
            renderItem={({ item }: { item: BannerItemProps }) => (
              <Item
                cta={item.cta}
                headline={item.headline}
                subheadline={item.subheadline}
                image={item.image}
              />
            )}
            keyExtractor={(_, index) => JSON.stringify(index)}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToAlignment="center"
            snapToInterval={ITEM_WIDTH}
            decelerationRate="fast"
            onScroll={onScroll}
            scrollEventThrottle={16}
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
    flexDirection: "row",
    width: windowWidth,
  },
  imageContainer: {
    width: 190,
  },
  contentContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    flex: 1,
    justifyContent: "center",
  },
  button: {
    borderWidth: 1,
    borderColor: colors.white,
    borderRadius: 30,
    flexWrap: "wrap",
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginTop: 30,
  },
  indicatorsContainer: {
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  indicator: {
    height: 8,
    width: 8,
    borderRadius: 5,
    backgroundColor: "#ddd",
  },
});
