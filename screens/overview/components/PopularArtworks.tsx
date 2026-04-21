import React, { useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ArtworkCardLoader from "#components/general/ArtworkCardLoader";
import { fetchPopularArtworks } from "#services/artworks/fetchPopularArtworks";
import ArtworkCard from "#components/artwork/ArtworkCard";
import EmptyArtworks from "#components/general/EmptyArtworks";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "#constants/screenNames.constants";
import NavBtnComponent from "#components/artwork/NavBtnComponent";
import { useQuery } from "@tanstack/react-query";
import { QK } from "#utils/queryKeys";
import { useAppStore } from "#store/app/appStore";
import tw from "twrnc";

export default React.memo(function PopularArtworks({
  onLoadingChange,
}: {
  onLoadingChange?: (l: boolean) => void;
}) {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { userSession, userType } = useAppStore();
  const userId = userSession?.id;

  const query = useQuery({
    queryKey: QK.popularArtworks(userId),
    queryFn: async () => {
      const res = await fetchPopularArtworks();
      return res?.data ?? [];
    },
    enabled: !!userId,
  });

  useEffect(() => {
    onLoadingChange?.(query.isFetching || (query.isLoading && !query.data));
  }, [query.isFetching, query.isLoading, query.data, onLoadingChange]);

  const isLoading = query.isLoading && !query.data;
  const data = query.data ?? [];

  return (
    <View style={styles.container}>
      <TouchableOpacity
        disabled={["artist", "gallery"].includes(userType)}
        onPress={() => navigation.navigate(screenName.gallery.artworks)}
      >
        <View style={tw`flex-row items-center`}>
          <Text style={tw`font-medium flex-1 text-lg`}>Popular artworks</Text>
          {!["artist", "gallery"].includes(userType) && (
            <NavBtnComponent onPress={() => { }} />
          )}
        </View>
      </TouchableOpacity>

      {isLoading && <ArtworkCardLoader />}

      {!isLoading && data.length > 0 && (
        <ScrollView
          horizontal
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[tw`gap-5 pt-5`, { alignItems: "flex-end" }]}
        >
          {data.map((item: ArtworkFlatlistItem, index: number) => (
            <ArtworkCard
              key={item.art_id?.toString() ?? `popular-${index}`}
              title={item.title}
              url={item.url}
              artist={item.artist}
              showPrice={item.pricing?.shouldShowPrice === "Yes"}
              price={item.pricing?.usd_price}
              availiablity={item.availability}
              impressions={item.impressions}
              like_IDs={item.like_IDs}
              art_id={item.art_id}
              galleryView
              hideBackground
              useImageLoadAspectRatio
            />
          ))}
        </ScrollView>
      )}

      {!isLoading && data.length === 0 && (
        <View style={tw`flex-1 pt-10 min-h-[300px]`}>
          <EmptyArtworks />
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: { paddingTop: 25, paddingBottom: 60 },
});
