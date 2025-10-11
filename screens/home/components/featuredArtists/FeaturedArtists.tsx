import React from 'react';
import { Image, StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { colors } from 'config/colors.config';
import { fontNames } from 'constants/fontNames.constants';
import { getFeaturedArtists } from 'services/overview/fetchFeaturedArtist';
import { getImageFileView } from 'lib/storage/getImageFileView';
import { HOME_QK } from 'utils/queryKeys';

type Artist = {
  author_id: string;
  mostLikedArtwork: { url: string; artworkId: string; birthyear: string; country: string };
  artist: string;
  totalLikes: number;
};

const FeaturedArtists = () => {
  const navigation = useNavigation<any>();
  const { data: artists = [] } = useQuery({
    queryKey: HOME_QK.featuredArtists,
    queryFn: async () => {
      const res = await getFeaturedArtists();
      return res?.isOk && Array.isArray(res.data) ? (res.data as Artist[]) : [];
    },
    staleTime: 5 * 60_000,
    gcTime: 15 * 60_000,
  });

  const ArtistCard = ({
    image,
    name,
    details,
    totalLikes,
  }: {
    image: string;
    name: string;
    details: { birthyear: string; country: string };
    totalLikes?: number;
  }) => {
    const image_href = getImageFileView(image, 200);
    return (
      <View style={styles.artistCard}>
        <Image source={{ uri: image_href }} style={styles.artistImage} />
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <View style={styles.artistInfo}>
            <Text style={styles.artistName}>{name}</Text>
            <Text style={styles.artistDetails}>{details.country + ' b.' + details.birthyear}</Text>
          </View>
          <View style={{ marginTop: 5 }}>
            <Text
              style={{ fontSize: 12, color: '#858585', fontFamily: fontNames.dmSans + 'Regular' }}
            >
              {totalLikes || 0} Likes
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{ marginTop: 40 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: '500', flex: 1 }}>
          Artists making the rave on Omenai
        </Text>
      </View>

      {artists.length > 0 ? (
        <FlatList
          data={artists}
          keyExtractor={(item) => item.author_id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 20, paddingTop: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('DetailsScreen', {
                  type: 'artist',
                  id: item.author_id,
                  name: item.artist,
                  logo: item.mostLikedArtwork.url,
                })
              }
            >
              <ArtistCard
                image={item.mostLikedArtwork.url}
                name={item.artist}
                details={item.mostLikedArtwork}
                totalLikes={item.totalLikes}
              />
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={{ padding: 30 }}>
          <Text style={{ color: colors.grey, textAlign: 'center' }}>
            No featured artists available
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  artistCard: { width: 300, marginLeft: 20 },
  artistImage: { width: '100%', height: 200, borderRadius: 5, backgroundColor: '#eee' },
  artistInfo: { marginTop: 10 },
  artistName: { fontSize: 14, fontWeight: '600', color: colors.primary_black },
  artistDetails: {
    fontSize: 12,
    color: '#858585',
    fontFamily: fontNames.dmSans + 'Regular',
    marginTop: 4,
  },
});

export default React.memo(FeaturedArtists);
