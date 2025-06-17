import React, { useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import tw from 'twrnc';
import BackHeaderTitle from 'components/header/BackHeaderTitle';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';

type DetailItem = {
  type: 'artist' | 'gallery';
  image: string;
  name: string;
  location?: string;
  genre?: string;
  description?: string;
  contact?: string;
  founded?: string;
  experience?: string;
  artworks?: string[];
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    website?: string;
  };
};

type DetailsRouteProp = RouteProp<{ params: DetailItem }, 'params'>;

const DetailsScreen = () => {
  const route = useRoute<DetailsRouteProp>();
  const { height } = useWindowDimensions();

  const {
    type,
    image,
    name,
    location,
    genre,
    description,
    contact,
    founded,
    experience,
    artworks = [],
    socialLinks = {},
  } = route.params;

  return (
    <View style={tw`flex-1 bg-[#F7F7F7]`}>
      <Animated.View entering={FadeInDown.duration(600)}>
        <BackHeaderTitle title={`${type === 'artist' ? 'Artist' : 'Gallery'} Details`} />
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`px-5 pb-12 pt-4`}>
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <Image
            source={typeof image === 'string' ? { uri: image } : image}
            style={tw.style(`w-full rounded-2xl`, { height: height * 0.3 })}
            resizeMode="cover"
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={tw`mt-6`}>
          <Text style={tw`text-2xl font-bold text-[#1A1A1A] text-center`}>{name}</Text>

          {type === 'gallery' && (
            <>
              {location && <Text style={tw`text-center text-[#555] mt-2`}>📍 {location}</Text>}
              {founded && (
                <Text style={tw`text-center text-[#555] mt-1`}>🏛️ Founded: {founded}</Text>
              )}
            </>
          )}

          {type === 'artist' && (
            <>
              {genre && <Text style={tw`text-center text-[#555] mt-2`}>🎨 Genre: {genre}</Text>}
              {experience && (
                <Text style={tw`text-center text-[#555] mt-1`}>🕰️ Experience: {experience}</Text>
              )}
            </>
          )}

          {contact && <Text style={tw`text-center text-[#555] mt-1`}>📧 Contact: {contact}</Text>}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(500)} style={tw`mt-8`}>
          <Text style={tw`text-lg font-semibold text-[#1A1A1A] mb-2`}>About</Text>
          <Text style={tw`text-sm text-[#333] leading-6`}>
            {description ??
              `This ${type} has a rich history in modern art and continues to inspire audiences globally with thought-provoking works.`}
          </Text>
        </Animated.View>

        {/* Artworks */}
        {artworks?.length > 0 && (
          <Animated.View entering={FadeInDown.delay(400).duration(500)} style={tw`mt-8`}>
            <Text style={tw`text-lg font-semibold text-[#1A1A1A] mb-3`}>Artworks</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={tw`gap-3`}
            >
              {artworks.map((uri, idx) => (
                <Image
                  key={idx}
                  source={{ uri }}
                  style={tw`w-[120px] h-[120px] rounded-xl bg-gray-300`}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          </Animated.View>
        )}

        {/* Social Links */}
        {(socialLinks.instagram || socialLinks.twitter || socialLinks.website) && (
          <Animated.View entering={FadeInDown.delay(500).duration(500)} style={tw`mt-10`}>
            <Text style={tw`text-lg font-semibold text-[#1A1A1A] mb-3`}>Follow</Text>
            <View style={tw`flex-row gap-4`}>
              {socialLinks.instagram && (
                <TouchableOpacity onPress={() => console.log('Instagram')}>
                  <Feather name="instagram" size={24} color="#C13584" />
                </TouchableOpacity>
              )}
              {socialLinks.twitter && (
                <TouchableOpacity onPress={() => console.log('Twitter')}>
                  <Feather name="twitter" size={24} color="#1DA1F2" />
                </TouchableOpacity>
              )}
              {socialLinks.website && (
                <TouchableOpacity onPress={() => console.log('Website')}>
                  <Feather name="globe" size={24} color="#1A1A1A" />
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
};

export default DetailsScreen;
