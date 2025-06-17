import { Image, StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import React from 'react';
import { colors } from '../../../../config/colors.config';
import { fontNames } from 'constants/fontNames.constants';
import { useNavigation } from '@react-navigation/native';

type Artist = {
  image: string;
  name: string;
  genre: string;
  experience: string;
  description: string;
  contact: string;
  socialLinks: {
    instagram: string;
    twitter: string;
    website: string;
  };
};

const data: Artist[] = [
  {
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    name: 'Liam Harper',
    genre: 'Contemporary',
    experience: '10 years',
    description: `Liam Harper is a leading contemporary artist whose work explores the intersection of urban life and psychological space. His signature use of layered textures and contrasting palettes creates an emotional resonance that connects deeply with viewers.`,
    contact: 'liam.harper@artmail.com',
    socialLinks: {
      instagram: 'https://instagram.com/liamharper_art',
      twitter: 'https://twitter.com/liam_harper',
      website: 'https://liamharperart.com',
    },
  },
  {
    image: 'https://randomuser.me/api/portraits/women/45.jpg',
    name: 'Sophia Bennett',
    genre: 'Abstract',
    experience: '8 years',
    description: `Sophia Bennett's abstract compositions are inspired by nature, memory, and emotion. Her work is known for its fluidity, bold colors, and immersive style. She regularly exhibits across Europe and runs workshops for aspiring artists.`,
    contact: 'sophia.b@artmail.com',
    socialLinks: {
      instagram: 'https://instagram.com/sophiabennett',
      twitter: 'https://twitter.com/sophiab_art',
      website: 'https://sophiabennettart.com',
    },
  },
  {
    image: 'https://randomuser.me/api/portraits/men/56.jpg',
    name: 'Ethan Fox',
    genre: 'Minimalism',
    experience: '5 years',
    description: `Ethan Fox is a minimalist visual artist who embraces the "less is more" philosophy. His works often explore silence, emptiness, and space through the use of geometric forms and a monochromatic color scheme.`,
    contact: 'ethan.fox@minimal.art',
    socialLinks: {
      instagram: 'https://instagram.com/ethanfoxart',
      twitter: 'https://twitter.com/ethanfox_min',
      website: 'https://ethanfoxminimal.com',
    },
  },
  {
    image: 'https://randomuser.me/api/portraits/women/12.jpg',
    name: 'Ava Martinez',
    genre: 'Realism',
    experience: '12 years',
    description: `Ava Martinez is celebrated for her hyperrealistic portraits and urban scenes that capture human vulnerability with precision. Her attention to light and emotion brings her subjects to life in hauntingly beautiful detail.`,
    contact: 'ava.m@hyperreal.art',
    socialLinks: {
      instagram: 'https://instagram.com/avamartinez_realism',
      twitter: 'https://twitter.com/ava_martinez',
      website: 'https://avamartinezart.com',
    },
  },
];

type ArtistCardProps = {
  image: string;
  name: string;
  genre: string;
};

export default function FeaturedArtists() {
  const navigation = useNavigation<any>();
  const ArtistCard = ({ image, name, genre }: ArtistCardProps) => (
    <View style={styles.artistCard}>
      <Image source={{ uri: image }} style={styles.artistImage} />
      <View style={styles.artistInfo}>
        <Text style={styles.artistName}>{name}</Text>
        <Text style={styles.artistGenre}>{genre}</Text>
      </View>
    </View>
  );

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
        data={data}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('DetailsScreen', {
                type: 'artist',
                image: item.image,
                name: item.name,
                genre: item.genre,
                experience: item.experience,
                contact: item.contact,
                description: item.description,
                socialLinks: item.socialLinks,
              })
            }
          >
            <ArtistCard image={item.image} name={item.name} genre={item.genre} />
          </TouchableOpacity>
        )}
        keyExtractor={(_, index) => index.toString()}
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
