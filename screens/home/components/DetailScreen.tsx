import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  useWindowDimensions,
  FlatList,
  Pressable,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import BackHeaderTitle from 'components/header/BackHeaderTitle';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { getFeaturedArtistData } from 'services/overview/fetchFeaturedArtistData';
import { getFeaturedGalleryData } from 'services/overview/fetchFeaturedGalleryData';
import { getImageFileView } from 'lib/storage/getImageFileView';
import { getGalleryLogoFileView } from 'lib/storage/getGalleryLogoFileView';
import MiniArtworkCardLoader from 'components/general/MiniArtworkCardLoader';
import EmptyArtworks from 'components/general/EmptyArtworks';
import { resizeImageDimensions } from 'utils/utils_resizeImageDimensions.utils';
import MiniArtworkCard from 'components/artwork/MiniArtworkCard';

type DetailsRouteProp = RouteProp<
  { params: { type: 'artist' | 'gallery'; id: string; name: string; logo?: string } },
  'params'
>;

const DetailsScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<DetailsRouteProp>();
  const { height } = useWindowDimensions();
  const { type, id, name, logo } = route.params;

  const [bio, setBio] = useState('');
  const [artworks, setArtworks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = () => setExpanded(!expanded);

  const numberOfLines = expanded ? undefined : 3;
  const shouldShowToggle = bio && bio.split(' ').length > 20; // adjust threshold

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
      console.log(res.data);
      setBio(res.data?.data?.bio ?? '');
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
      renderItem={({ item }) => (
        <View style={tw`mb-4`}>
          <MiniArtworkCard
            title={item.title}
            url={item.url}
            artist={item.artist}
            showPrice={item.pricing?.shouldShowPrice === 'Yes'}
            price={item.pricing?.usd_price}
            impressions={item.impressions}
            like_IDs={item.like_IDs}
            art_id={item.art_id}
            availability={item.availability}
          />
        </View>
      )}
      scrollEnabled={false}
    />
  );

  const image_href =
    type === 'artist'
      ? getImageFileView(logo ?? '', 120, 120)
      : getGalleryLogoFileView(logo ?? '', 120, 120);

  const [imageDimensions, setImageDimensions] = useState({
    width: 250,
    height: 250,
  });

  useEffect(() => {
    let isMounted = true;

    if (image_href) {
      Image.getSize(
        image_href,
        (defaultWidth, defaultHeight) => {
          if (!isMounted) return;
          const { width, height } = resizeImageDimensions(
            { width: defaultWidth, height: defaultHeight },
            250, // maxWidth
            250, // optional maxHeight to fully constrain
          );
          setImageDimensions({ width, height });
        },
        (error) => {
          console.warn('Failed to get image size:', error?.message || error);
        },
      );
    }

    return () => {
      isMounted = false; // clean up to avoid setting state after unmount
    };
  }, [image_href]);

  return (
    <View style={tw`flex-1 bg-[#F7F7F7]`}>
      <Animated.View entering={FadeInDown.duration(600)}>
        <BackHeaderTitle title={`${type === 'artist' ? 'Artist' : 'Gallery'} Details`} />
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`px-[20px] pb-12 pt-4`}
      >
        {/* Banner Image */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <Image
            source={{ uri: image_href }}
            style={tw.style(`rounded-[10px] bg-[#0505]`, {
              height: imageDimensions.height,
              width: imageDimensions.width,
            })}
            resizeMode="cover"
          />
        </Animated.View>

        {/* Name */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={tw`mt-6`}>
          <Text style={tw`text-2xl font-bold text-[#1A1A1A]`}>{name}</Text>
        </Animated.View>

        {/* Bio */}
        {type === 'artist' && (
          <Animated.View entering={FadeInDown.delay(300).duration(500)} style={tw`mt-8`}>
            <Text style={tw`text-lg font-semibold text-[#1A1A1A] mb-2`}>About</Text>
            <Text style={tw`text-sm text-[#333] leading-6`} numberOfLines={numberOfLines}>
              {bio || 'No biography available.'}
            </Text>
            {shouldShowToggle && (
              <Pressable onPress={toggleExpanded}>
                <Text style={tw`text-sm text-blue-500 mt-1`}>
                  {expanded ? 'Read less' : 'Read more'}
                </Text>
              </Pressable>
            )}
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
            <View style={tw`flex-row gap-[15px]`}>
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
