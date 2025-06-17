import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { colors } from '../../../../config/colors.config';
import { Feather } from '@expo/vector-icons';
import galleryImage from '../../../../assets/images/gallery-banner.png';
import { FlatList } from 'react-native-gesture-handler';

import gallery_one from '../../../../assets/images/gallery_one.png';
import gallery_two from '../../../../assets/images/gallery_two.png';
import gallery_three from '../../../../assets/images/gallery_three.jpg';
import gallery_four from '../../../../assets/images/gallery_four.jpg';
import { fontNames } from 'constants/fontNames.constants';
import { useNavigation } from '@react-navigation/native';

import { ImageSourcePropType } from 'react-native';

type Gallery = {
  image: ImageSourcePropType;
  name: string;
  location: string;
  founded: string;
  description: string;
  contact: string;
  socialLinks: {
    instagram: string;
    twitter: string;
    website: string;
  };
};

const data: Gallery[] = [
  {
    image: gallery_one,
    name: 'Midas',
    location: '1035 Manchester, London',
    founded: '1995',
    description: `Midas Gallery is renowned for nurturing emerging European artists. With an eye for innovation, Midas has curated hundreds of exhibitions that challenge traditional art boundaries, fostering bold artistic voices in contemporary visual culture.`,
    contact: 'contact@midasgallery.co.uk',
    socialLinks: {
      instagram: 'https://instagram.com/midasgallery',
      twitter: 'https://twitter.com/midas_gallery',
      website: 'https://midasgallery.co.uk',
    },
  },
  {
    image: gallery_two,
    name: 'The Expresso Gallery',
    location: '25 Expresso, Dublin',
    founded: '2003',
    description: `Expresso Gallery offers an eclectic blend of contemporary and heritage art. It serves as a hub for cultural dialogue, hosting talks, residencies, and international showcases with a focus on storytelling and identity in art.`,
    contact: 'info@expressoart.ie',
    socialLinks: {
      instagram: 'https://instagram.com/expressogallery',
      twitter: 'https://twitter.com/expressoart',
      website: 'https://expressoart.ie',
    },
  },
  {
    image: gallery_three,
    name: 'Midas',
    location: 'London',
    founded: '1998',
    description: `This branch of Midas focuses on abstract and minimalistic art forms, curating global exhibitions with an emphasis on light, space, and emotional resonance. It’s a favorite among collectors seeking rare, thought-provoking pieces.`,
    contact: 'hello@midasart.uk',
    socialLinks: {
      instagram: 'https://instagram.com/midas_london',
      twitter: 'https://twitter.com/midasabstract',
      website: 'https://midasart.uk',
    },
  },
  {
    image: gallery_four,
    name: 'The Boys',
    location: 'New York, USA',
    founded: '1980',
    description: `The Boys is an iconic NYC gallery rooted in street culture and pop art. Known for launching the careers of now-legendary artists, it continues to be a breeding ground for bold, politically charged, and rebellious art.`,
    contact: 'connect@theboysnyc.com',
    socialLinks: {
      instagram: 'https://instagram.com/theboysnyc',
      twitter: 'https://twitter.com/theboys_gallery',
      website: 'https://theboysnyc.com',
    },
  },
];

type GalleryCardProps = {
  image: ImageSourcePropType;
  name: string;
  location: string;
};

export default function FeaturedGalleries() {
  const navigation = useNavigation<any>();

  const Gallery = ({ image, name, location }: GalleryCardProps) => {
    return (
      <View style={styles.gallery}>
        <Image source={image} style={styles.image} />
        <View style={styles.contentContainer}>
          <Text style={{ fontSize: 14, color: colors.primary_black }}>{name}</Text>
          <Text
            style={{
              fontSize: 12,
              marginTop: 5,
              color: '#858585',
              fontFamily: fontNames.dmSans + 'Regular',
            }}
          >
            {location}
          </Text>
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
        <Text style={{ fontSize: 18, fontWeight: 500, flex: 1 }}>Featured Galleries</Text>
      </View>
      <FlatList
        data={data}
        renderItem={({ item }: { item: Gallery }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('DetailsScreen', {
                type: 'gallery',
                image: item.image,
                name: item.name,
                contact: item.contact,
                description: item.description,
                socialLinks: item.socialLinks,
              })
            }
          >
            <Gallery name={item.name} image={item.image} location={item.location} />
          </TouchableOpacity>
        )}
        keyExtractor={(_, index) => JSON.stringify(index)}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 20 }}
        contentContainerStyle={{ paddingRight: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  seeMoreButton: {
    height: 50,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderRadius: 30,
    gap: 10,
  },
  featuredListing: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 20,
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
  },
});
