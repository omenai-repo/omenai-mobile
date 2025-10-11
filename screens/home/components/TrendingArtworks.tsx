import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { fetchArtworks } from 'services/artworks/fetchArtworks';
import ArtworkCardLoader from 'components/general/ArtworkCardLoader';
import ViewAllCategoriesButton from 'components/buttons/ViewAllCategoriesButton';
import EmptyArtworks from 'components/general/EmptyArtworks';
import ArtworkCard from 'components/artwork/ArtworkCard';
import { Feather } from '@expo/vector-icons';
import { colors } from 'config/colors.config';
import { screenName } from 'constants/screenNames.constants';
import { fontNames } from 'constants/fontNames.constants';
import { HOME_QK } from 'utils/queryKeys';

export default function TrendingArtworks({ limit }: { limit: number }) {
  const navigation = useNavigation<any>();

  const { data = [], isLoading } = useQuery({
    queryKey: HOME_QK.trending(limit),
    queryFn: async () => {
      const res = await fetchArtworks({ listingType: 'trending', page: 1 });
      return res?.isOk ? res.body.data ?? [] : [];
    },
    select: (rows) => rows.slice(0, limit),
    staleTime: 60_000,
    gcTime: 10 * 60_000,
  });

  const showMoreButton = data.length >= limit;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate(screenName.artworkCategories, { title: 'trending' })}
      >
        <View
          style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20 }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: '500',
              flex: 1,
              fontFamily: fontNames.dmSans + 'Medium',
            }}
          >
            Trending Artworks
          </Text>
          <Feather name="chevron-right" color={colors.grey} size={20} />
        </View>
      </TouchableOpacity>

      {isLoading && <ArtworkCardLoader />}

      {!isLoading && data.length > 0 && (
        <FlatList
          data={data}
          keyExtractor={(_, i) => `trend-${i}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 20 }}
          contentContainerStyle={{ paddingRight: 20 }}
          renderItem={({ item, index }) =>
            index + 1 === data.length && showMoreButton ? (
              <ViewAllCategoriesButton label="View all trending artworks" listingType="trending" />
            ) : (
              <ArtworkCard
                title={item.title}
                url={item.url}
                artist={item.artist}
                showPrice={item.pricing.shouldShowPrice === 'Yes'}
                price={item.pricing.usd_price}
                availiablity={item.availability}
                impressions={item.impressions}
                like_IDs={item.like_IDs}
                art_id={item.art_id}
              />
            )
          }
        />
      )}

      {!isLoading && data.length < 1 && (
        <EmptyArtworks size={70} writeUp="No trending artworks at the moment" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({ container: { marginTop: 40 } });
