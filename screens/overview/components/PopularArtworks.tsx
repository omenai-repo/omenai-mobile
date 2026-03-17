import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  InteractionManager,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
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
import { useDevice } from "#hooks/useDevice";

export default React.memo(function PopularArtworks({
  onLoadingChange,
}: {
  onLoadingChange?: (l: boolean) => void;
}) {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { userSession, userType } = useAppStore();
  const { isTablet, horizontalPadding, width } = useDevice();
  const estimatedItemSize = useMemo(
    () => (isTablet ? width * 0.4 + 20 : width * 0.7 + 20),
    [isTablet, width]
  );
  const horizontalContentStyle = useMemo(
    () => ({
      paddingLeft: isTablet ? horizontalPadding : 20,
      paddingRight: isTablet ? horizontalPadding : 20,
    }),
    [horizontalPadding, isTablet]
  );

  const [interactionsComplete, setInteractionsComplete] = useState(false);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setInteractionsComplete(true);
    });
    return () => task.cancel();
  }, []);

  const query = useQuery({
    queryKey: QK.popularArtworks(userSession?.id),
    queryFn: async () => {
      const res = await fetchPopularArtworks();
      return res?.data ?? [];
    },
    enabled: interactionsComplete,
  });

  useEffect(() => {
    onLoadingChange?.(query.isFetching || (query.isLoading && !query.data));
  }, [query.isFetching, query.isLoading, query.data, onLoadingChange]);

  const isLoading = query.isLoading && !query.data;
  const data = query.data ?? [];

  const renderItem = useCallback(
    ({ item }: { item: ArtworkFlatlistItem }) => (
      <ArtworkCard
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
      />
    ),
    []
  );

  const keyExtractor = useCallback(
    (item: ArtworkFlatlistItem, index: number) => String(item.art_id ?? index),
    []
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        disabled={["artist", "gallery"].includes(userType)}
        onPress={() => navigation.navigate(screenName.gallery.artworks)}
      >
        <View
          style={[
            tw`flex-row items-center`,
            { paddingHorizontal: isTablet ? horizontalPadding : 20 },
          ]}
        >
          <Text style={tw`font-medium flex-1 text-lg`}>Popular artworks</Text>
          {!["artist", "gallery"].includes(userType) && (
            <NavBtnComponent onPress={() => {}} />
          )}
        </View>
      </TouchableOpacity>

      {isLoading && <ArtworkCardLoader />}

      {!isLoading && data.length > 0 && (
        <View style={{ marginTop: isTablet ? 40 : 30, height: 320 }}>
          <FlashList
            data={data}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            horizontal
            nestedScrollEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={horizontalContentStyle}
            ItemSeparatorComponent={() => <View style={{ width: 20 }} />}
            // @ts-expect-error - FlashList expects estimatedItemSize but type definition might be outdated
            estimatedItemSize={estimatedItemSize}
          />
        </View>
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
  container: { paddingTop: 25, paddingBottom: 100 },
});
