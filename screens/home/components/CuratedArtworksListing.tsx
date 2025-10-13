import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { fetchCuratedArtworks } from 'services/artworks/fetchCuratedArtworks';
import ArtworkCardLoader from 'components/general/ArtworkCardLoader';
import ViewAllCategoriesButton from 'components/buttons/ViewAllCategoriesButton';
import EmptyArtworks from 'components/general/EmptyArtworks';
import ArtworkCard from 'components/artwork/ArtworkCard';
import { colors } from 'config/colors.config';
import { screenName } from 'constants/screenNames.constants';
import { fontNames } from 'constants/fontNames.constants';
import { HOME_QK } from 'utils/queryKeys';
import { useAppStore } from 'store/app/appStore';

export default function CuratedArtworksListing({ limit }: { limit: number }) {
  const navigation = useNavigation<any>();
  const { userSession } = useAppStore();

  const { data = [], isLoading } = useQuery({
    queryKey: HOME_QK.curated(limit, userSession?.id),
    queryFn: async () => {
      const res = await fetchCuratedArtworks({ page: 1 });
      return res?.data ?? [];
    },
    select: (rows) => rows.slice(0, limit),
    staleTime: 60_000,
    gcTime: 10 * 60_000,
  });

  const showMoreButton = data.length >= limit;

  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={{ paddingHorizontal: 20 }}
        onPress={() => navigation.navigate(screenName.artworkCategories, { title: 'curated' })}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: '500',
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
            keyExtractor={(_, i) => `curated-${i}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 20 }}
            contentContainerStyle={{ paddingRight: 20 }}
            renderItem={({ item, index }) =>
              index + 1 === limit && showMoreButton ? (
                <ViewAllCategoriesButton
                  label="View all curated artworks"
                  listingType="curated"
                  darkMode
                />
              ) : (
                <ArtworkCard
                  title={item.title}
                  url={item.url}
                  artist={item.artist}
                  showPrice={item.pricing.shouldShowPrice === 'Yes'}
                  price={item.pricing.usd_price}
                  availiablity={item.availability}
                  lightText
                  impressions={item.impressions}
                  like_IDs={item.like_IDs}
                  art_id={item.art_id}
                />
              )
            }
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
  mainContainer: {
    paddingBottom: 50,
    backgroundColor: colors.black,
    marginTop: 50,
    paddingTop: 50,
  },
});
