import { Image, StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors } from '../../../../config/colors.config';
import { fontNames } from 'constants/fontNames.constants';
import { useNavigation } from '@react-navigation/native';
import { getFeaturedArtists } from 'services/overview/fetchFeaturedArtist';
import { getImageFileView } from 'lib/storage/getImageFileView';
import { getGalleryLogoFileView } from 'lib/storage/getGalleryLogoFileView';

type Artist = {
  author_id: string;
  mostLikedArtwork: {
    url: string;
    artworkId: string;
    birthyear: string;
    country: string;
  };
  artist: string;
  totalLikes: number;
};

export default function FeaturedArtists() {
  const navigation = useNavigation<any>();
  const [artists, setArtists] = useState<Artist[]>([]);

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    const res = await getFeaturedArtists();
    if (res?.isOk && Array.isArray(res.data)) {
      console.log(res.data);
      setArtists(res.data);
    } else {
      console.warn('Failed to fetch featured artists');
    }
  };

  const ArtistCard = ({
    image,
    name,
    details,
    totalLikes,
  }: {
    image: string;
    name: string;
    details: {
      birthyear: string;
      country: string;
    };
    totalLikes?: number;
  }) => {
    const image_href = getImageFileView(image, 200);
    return (
      <View style={styles.artistCard}>
        <Image source={{ uri: image_href }} style={styles.artistImage} />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
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
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          paddingHorizontal: 20,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: '500', flex: 1 }}>
          Artists making the rave on Omenai
        </Text>
      </View>
      <FlatList
        data={artists}
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
        keyExtractor={(item) => item.author_id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 20, paddingTop: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  artistCard: {
    width: 300,
    marginLeft: 20,
  },
  artistImage: {
    width: '100%',
    height: 200,
    borderRadius: 5,
    backgroundColor: '#eee',
  },
  artistInfo: {
    marginTop: 10,
  },
  artistName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary_black,
  },
  artistDetails: {
    fontSize: 12,
    color: '#858585',
    fontFamily: fontNames.dmSans + 'Regular',
    marginTop: 4,
  },
});
