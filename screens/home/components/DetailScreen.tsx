import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
} from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { screenName } from "#constants/screenNames.constants";
import tw from "twrnc";
import BackHeaderTitle from "#components/header/BackHeaderTitle";
import Animated, { FadeInDown } from "react-native-reanimated";
import { getFeaturedArtistData } from "#services/overview/fetchFeaturedArtistData";
import { getFeaturedGalleryData } from "#services/overview/fetchFeaturedGalleryData";
import { getGalleryLogoFileView } from "#lib/storage/getGalleryLogoFileView";
import MiniArtworkCardLoader from "#components/general/MiniArtworkCardLoader";
import EmptyArtworks from "#components/general/EmptyArtworks";
import MiniArtworkCard from "#components/artwork/MiniArtworkCard";

type DetailsRouteProp = RouteProp<
  {
    params: {
      type: "artist" | "gallery";
      id: string;
      name: string;
      logo?: string;
    };
  },
  "params"
>;

const DetailsScreen = () => {
  const route = useRoute<DetailsRouteProp>();
  const navigation = useNavigation<any>();
  const { type, id, name, logo } = route.params;

  useEffect(() => {
    if (type === "artist") {
      navigation.replace(screenName.individual.artistDetails, {
        artistId: id,
        name,
        logo,
        coverUrl: logo,
      });
    }
  }, [type, id, name, logo, navigation]);

  const [artworks, setArtworks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) getGalleryOrArtistData();
  }, [id]);

  const getGalleryOrArtistData = async () => {
    setIsLoading(true);
    const res =
      type === "artist"
        ? await getFeaturedArtistData({ artist_id: id })
        : await getFeaturedGalleryData({ gallery_id: id });

    if (res?.isOk) {
      const arts =
        type === "artist"
          ? res.data?.artist_artworks
          : res.data?.gallery_artworks;

      setArtworks(arts ?? []);
    }
    setIsLoading(false);
  };

  const columnsData = useMemo(() => {
    const numCols = 2;
    const timestamp = Date.now();
    const columns = Array.from({ length: numCols }, (_, i) => ({
      id: `detail-column-${timestamp}-${i}`,
      data: [] as any[],
    }));
    artworks.forEach((item, idx) => {
      columns[idx % numCols].data.push(item);
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
            showPrice={item.pricing?.shouldShowPrice === "Yes"}
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

  const image_href = getGalleryLogoFileView(logo ?? "", 800);

  if (type === "artist") return null;

  return (
    <View style={tw`flex-1 bg-[#F7F7F7]`}>
      <Animated.View entering={FadeInDown.duration(600)}>
        <BackHeaderTitle title="Gallery Details" />
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`px-[20px] pb-12 pt-4`}
      >
        {/* Banner Image */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <Image
            source={{ uri: image_href }}
            style={tw`rounded-sm bg-[#0505] w-full h-[250px]`}
            resizeMode="cover"
          />
        </Animated.View>

        {/* Name */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(500)}
          style={tw`mt-3`}
        >
          <Text style={tw`text-2xl font-bold text-[#1A1A1A]`}>{name}</Text>
        </Animated.View>

        {/* Artworks */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(500)}
          style={tw`mt-10`}
        >
          <Text style={tw`text-lg font-semibold text-[#1A1A1A] mb-3`}>
            Artworks
          </Text>
          {isLoading ? (
            <MiniArtworkCardLoader />
          ) : artworks.length === 0 ? (
            <EmptyArtworks size={20} writeUp="No artworks available" />
          ) : (
            <View style={tw`flex-row gap-[15px]`}>
              {columnsData.map((col) => (
                <View key={col.id} style={tw`flex-1`}>
                  {renderColumn(col.data)}
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
