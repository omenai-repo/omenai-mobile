import React, { useEffect } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ArtworkCardLoader from 'components/general/ArtworkCardLoader';
import { fetchPopularArtworks } from 'services/artworks/fetchPopularArtworks';
import ArtworkCard from 'components/artwork/ArtworkCard';
import EmptyArtworks from 'components/general/EmptyArtworks';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { screenName } from 'constants/screenNames.constants';
import NavBtnComponent from 'components/artwork/NavBtnComponent';
import { useQuery } from '@tanstack/react-query';
import { QK } from '../Overview';

export default function PopularArtworks({
  onLoadingChange,
}: {
  onLoadingChange?: (l: boolean) => void;
}) {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const query = useQuery({
    queryKey: QK.popularArtworks,
    queryFn: async () => {
      const res = await fetchPopularArtworks();
      return res?.data ?? [];
    },
    staleTime: 60_000,
    gcTime: 10 * 60_000,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    onLoadingChange?.(query.isFetching || (query.isLoading && !query.data));
  }, [query.isFetching, query.isLoading, query.data, onLoadingChange]);

  const isLoading = query.isLoading && !query.data;
  const data = query.data ?? [];

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate(screenName.gallery.artworks)}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: '500', flex: 1, color: '#000' }}>
            Popular artworks
          </Text>
          <NavBtnComponent onPress={() => {}} />
        </View>
      </TouchableOpacity>

      {isLoading && <ArtworkCardLoader />}

      {!isLoading && data.length > 0 && (
        <FlatList
          data={data}
          renderItem={({ item }: { item: ArtworkFlatlistItem }) => (
            <ArtworkCard
              title={item.title}
              url={item.url}
              artist={item.artist}
              showPrice={item.pricing.shouldShowPrice === 'Yes'}
              price={item.pricing.usd_price}
              impressions={item.impressions}
              like_IDs={item.like_IDs}
              art_id={item.art_id}
              galleryView
            />
          )}
          keyExtractor={(item, index) => String(item.art_id ?? index)}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 30 }}
          contentContainerStyle={{ paddingRight: 20 }}
        />
      )}

      {!isLoading && data.length === 0 && <EmptyArtworks size={70} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: 25, paddingBottom: 150 },
});
