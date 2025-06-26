import { Image, StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors } from '../../../../config/colors.config';
import { fontNames } from 'constants/fontNames.constants';
import { useNavigation } from '@react-navigation/native';
import { getFeaturedArtists } from 'services/overview/fetchFeaturedArtist';
import { getImageFileView } from 'lib/storage/getImageFileView';
import { getGalleryLogoFileView } from 'lib/storage/getGalleryLogoFileView';

type Artist = {
  _id: string;
  artist_id: string;
  logo: string;
  name: string;
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
      setArtists(res.data);
    } else {
      console.warn('Failed to fetch featured artists');
    }
  };

  const ArtistCard = ({ image, name }: { image: string; name: string }) => {
    const image_href = getGalleryLogoFileView(image, 200);
    return (
      <View style={styles.artistCard}>
        <Image source={{ uri: image_href }} style={styles.artistImage} />
        <View style={styles.artistInfo}>
          <Text style={styles.artistName}>{name}</Text>
          {/* <Text style={styles.artistGenre}>Visual Artist</Text> */}
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
        <Text style={{ fontSize: 18, fontWeight: '500', flex: 1 }}>Featured Artists</Text>
      </View>
      <FlatList
        data={artists}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('DetailsScreen', {
                type: 'artist',
                id: item.artist_id,
                name: item.name,
                logo: item.logo,
              })
            }
          >
            <ArtistCard image={item.logo} name={item.name} />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item._id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 20, paddingTop: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  artistCard: {
    width: 150,
    marginLeft: 20,
    alignItems: 'center',
  },
  artistImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: colors.primary_black,
  },
  artistInfo: {
    marginTop: 10,
    alignItems: 'center',
  },
  artistName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary_black,
    textAlign: 'center',
  },
  artistGenre: {
    fontSize: 12,
    color: '#858585',
    fontFamily: fontNames.dmSans + 'Regular',
    marginTop: 4,
    textAlign: 'center',
  },
});
