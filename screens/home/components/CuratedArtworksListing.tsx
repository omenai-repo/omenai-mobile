import { StyleSheet, Text, View, ImageBackground, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import ArtworkCard from 'components/artwork/ArtworkCard';
import { fetchArtworks } from 'services/artworks/fetchArtworks';
import { colors } from 'config/colors.config';
import ArtworkCardLoader from 'components/general/ArtworkCardLoader';
import curatedBg from 'assets/images/curated_bg.png';
import { fetchCuratedArtworks } from 'services/artworks/fetchCuratedArtworks';
import ViewAllCategoriesButton from 'components/buttons/ViewAllCategoriesButton';
import { screenName } from 'constants/screenNames.constants';
import EmptyArtworks from 'components/general/EmptyArtworks';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { fontNames } from 'constants/fontNames.constants';

export default function CuratedArtworksListing({
  refreshCount,
  limit,
}: {
  refreshCount?: number;
  limit: number;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<StackNavigationProp<any>>();

  const [data, setData] = useState<any[]>([]);
  const [showMoreButton, setshowMoreButton] = useState(false);

  useEffect(() => {
    handleFetchArtworks();
  }, [refreshCount]);

  const handleFetchArtworks = async () => {
    setIsLoading(true);

    const results = await fetchCuratedArtworks({ page: 1 });

    if (results) {
      const resData = results.data;

      setData(resData.splice(0, limit));
      if (resData.length >= 20) {
        setshowMoreButton(true);
      }
    } else {
      console.log(results);
    }

    setIsLoading(false);
  };

  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={{ paddingHorizontal: 20 }}
        onPress={() =>
          navigation.navigate(screenName.artworkCategories, {
            title: 'curated',
          })
        }
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: 500,
            flex: 1,
            color: colors.white,
            fontFamily: fontNames.dmSans + 'Medium',
          }}
        >
          Artworks based on your interests
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: colors.white,
            marginTop: 10,
            opacity: 0.9,
            fontFamily: fontNames.dmSans + 'Regular',
          }}
        >
          Explore artworks based off your interests and interactions within the past days
        </Text>
      </TouchableOpacity>
      <View style={{ marginTop: 20 }}>
        {isLoading && <ArtworkCardLoader />}
        {!isLoading && data.length > 0 && (
          <FlatList
            data={data}
            renderItem={({ item, index }: { item: ArtworkFlatlistItem; index: number }) => {
              if (index + 1 === limit && showMoreButton) {
                return (
                  <ViewAllCategoriesButton
                    label="View all curated artworks"
                    listingType="curated"
                    darkMode
                  />
                );
              }
              return (
                <ArtworkCard
                  title={item.title}
                  url={item.url}
                  artist={item.artist}
                  showPrice={item.pricing.shouldShowPrice === 'Yes'}
                  price={item.pricing.usd_price}
                  availiablity={item.availability}
                  lightText={true}
                  // width={310}
                  impressions={item.impressions}
                  like_IDs={item.like_IDs}
                  art_id={item.art_id}
                />
              );
            }}
            keyExtractor={(_, index) => JSON.stringify(index)}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 20 }}
            contentContainerStyle={{ paddingRight: 20 }}
          />
        )}
        {!isLoading && data.length < 1 && (
          <EmptyArtworks size={70} writeUp="No artworks to match your interests" darkTheme />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    backgroundColor: colors.primary_black,
  },
  mainContainer: {
    paddingBottom: 50,
    backgroundColor: colors.black,
    marginTop: 50,
    paddingTop: 50,
  },
});
