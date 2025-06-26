import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, ScrollView, Image, useWindowDimensions, FlatList } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import tw from 'twrnc';
import BackHeaderTitle from 'components/header/BackHeaderTitle';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { getFeaturedArtistData } from 'services/overview/fetchFeaturedArtistData';
import { getFeaturedGalleryData } from 'services/overview/fetchFeaturedGalleryData';
import { getImageFileView } from 'lib/storage/getImageFileView';
import { getGalleryLogoFileView } from 'lib/storage/getGalleryLogoFileView';
import MiniArtworkCardLoader from 'components/general/MiniArtworkCardLoader';
import EmptyArtworks from 'components/general/EmptyArtworks';

type DetailsRouteProp = RouteProp<
  { params: { type: 'artist' | 'gallery'; id: string; name: string; logo?: string } },
  'params'
>;

const DetailsScreen = () => {
  const route = useRoute<DetailsRouteProp>();
  const { height } = useWindowDimensions();
  const { type, id, name, logo } = route.params;

  const [bio, setBio] = useState('');
  const [artworks, setArtworks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) getGalleryOrArtistData();
  }, [id]);

  const getGalleryOrArtistData = async () => {
    setIsLoading(true);
    const res =
      type === 'artist'
        ? await getFeaturedArtistData({ artist_id: id })
        : await getFeaturedGalleryData({ gallery_id: id });

    if (res?.isOk) {
      setBio(res.data?.data?.[0]?.bio ?? '');
      const arts =
        type === 'artist'
          ? res.data?.artist_artworks
          : type === 'gallery'
          ? res.data?.gallery_artworks
          : [];

      setArtworks(arts);
    }
    setIsLoading(false);
  };

  const columnsData = useMemo(() => {
    const numCols = 2;
    const columns: any[][] = Array.from({ length: numCols }, () => []);
    artworks.forEach((item, idx) => {
      columns[idx % numCols].push(item);
    });
    return columns;
  }, [artworks]);

  const renderColumn = (columnData: any[]) => (
    <FlatList
      data={columnData}
      keyExtractor={(item) => item.art_id}
      renderItem={({ item }) => {
        const image = getImageFileView(item.url, 200);
        return (
          <View style={tw`mb-4`}>
            <Image
              source={{ uri: image }}
              style={tw`w-full h-40 rounded-xl bg-gray-300`}
              resizeMode="cover"
            />
            <Text style={tw`mt-2 text-[13px] text-[#1A1A1A] font-semibold`}>{item.title}</Text>
          </View>
        );
      }}
      scrollEnabled={false}
    />
  );

  const image_href = getGalleryLogoFileView(logo ?? '', 120, 120);

  return (
    <View style={tw`flex-1 bg-[#F7F7F7]`}>
      <Animated.View entering={FadeInDown.duration(600)}>
        <BackHeaderTitle title={`${type === 'artist' ? 'Artist' : 'Gallery'} Details`} />
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`px-5 pb-12 pt-4`}>
        {/* Banner Image */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <Image
            source={{ uri: image_href }}
            style={tw.style(`w-full rounded-2xl bg-[#0505]`, { height: height * 0.3 })}
            resizeMode="cover"
          />
        </Animated.View>

        {/* Name */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={tw`mt-6`}>
          <Text style={tw`text-2xl font-bold text-[#1A1A1A] text-center`}>{name}</Text>
        </Animated.View>

        {/* Bio */}
        {type === 'artist' && (
          <Animated.View entering={FadeInDown.delay(300).duration(500)} style={tw`mt-8`}>
            <Text style={tw`text-lg font-semibold text-[#1A1A1A] mb-2`}>About</Text>
            <Text style={tw`text-sm text-[#333] leading-6`}>
              {bio || 'No biography available.'}
            </Text>
          </Animated.View>
        )}

        {/* Artworks */}
        <Animated.View entering={FadeInDown.delay(400).duration(500)} style={tw`mt-8`}>
          <Text style={tw`text-lg font-semibold text-[#1A1A1A] mb-3`}>Artworks</Text>
          {isLoading ? (
            <MiniArtworkCardLoader />
          ) : artworks.length === 0 ? (
            <EmptyArtworks size={20} writeUp="No artworks available" />
          ) : (
            <View style={tw`flex-row gap-3`}>
              {columnsData.map((col, idx) => (
                <View key={idx} style={tw`flex-1`}>
                  {renderColumn(col)}
                </View>
              ))}
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default DetailsScreen;
