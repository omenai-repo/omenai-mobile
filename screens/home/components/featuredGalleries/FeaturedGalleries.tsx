import { Image, StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors } from '../../../../config/colors.config';
import { fontNames } from 'constants/fontNames.constants';
import { useNavigation } from '@react-navigation/native';
import { getFeaturedGalleries } from 'services/overview/fetchFeaturedGallery';
import { getGalleryLogoFileView } from 'lib/storage/getGalleryLogoFileView';

type Gallery = {
  gallery_id: string;
  name: string;
  logo: string;
};

export default function FeaturedGalleries() {
  const navigation = useNavigation<any>();
  const [galleries, setGalleries] = useState<Gallery[]>([]);

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    const res = await getFeaturedGalleries();
    if (res?.isOk) {
      setGalleries(res.data);
    }
  };

  const GalleryCard = ({ item }: { item: Gallery }) => {
    const image_href = getGalleryLogoFileView(item.logo, 200);
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('DetailsScreen', {
            type: 'gallery',
            id: item.gallery_id,
            name: item.name,
            logo: item.logo,
          })
        }
      >
        <View style={styles.gallery}>
          <Image source={{ uri: image_href }} style={styles.image} />
          <View style={styles.contentContainer}>
            <Text style={{ fontSize: 14, color: colors.primary_black }}>{item.name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ marginTop: 40 }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Featured Galleries</Text>
      </View>
      <FlatList
        data={galleries}
        renderItem={({ item }) => <GalleryCard item={item} />}
        keyExtractor={(item) => item.gallery_id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 20 }}
        style={{ marginTop: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '500',
    flex: 1,
  },
  gallery: {
    flex: 1,
    width: 300,
    marginLeft: 20,
  },
  contentContainer: {
    paddingTop: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 5,
    backgroundColor: '#eee',
  },
});
