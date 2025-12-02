import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import ArtworkCard from "components/artwork/ArtworkCard";
import { fetchArtworks } from "services/artworks/fetchArtworks";
import ArtworkCardLoader from "components/general/ArtworkCardLoader";
import EmptyArtworks from "components/general/EmptyArtworks";
import { Feather } from "@expo/vector-icons";
import { colors } from "config/colors.config";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "constants/screenNames.constants";
import { fontNames } from "constants/fontNames.constants";
import { HOME_QK } from "utils/queryKeys";
import { useAppStore } from "store/app/appStore";

export default function NewArtworksListing() {
  const navigation = useNavigation<any>();
  const { userSession } = useAppStore();

  const { data = [], isLoading } = useQuery({
    queryKey: HOME_QK.newArtworks(userSession?.id),
    queryFn: async () => {
      const results = await fetchArtworks({ listingType: "recent", page: 1 });
      return results?.isOk ? results.body.data ?? [] : [];
    },
    staleTime: 60_000,
    gcTime: 10 * 60_000,
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate(screenName.catalog)}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            marginBottom: 15,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              color: "#1A1A1A",
              fontFamily: fontNames.dmSans + "Bold",
            }}
          >
            New artworks for you
          </Text>
          <Feather name="chevron-right" color={colors.grey} size={24} />
        </View>
      </TouchableOpacity>

      {isLoading && <ArtworkCardLoader />}

      {!isLoading && data.length > 0 && (
        <FlatList
          data={data}
          keyExtractor={(_, i) => `new-${i}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 0 }}
          contentContainerStyle={{ paddingRight: 20 }}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={5}
          renderItem={({ item }) => (
            <ArtworkCard
              title={item.title}
              url={item.url}
              artist={item.artist}
              showPrice={item.pricing.shouldShowPrice === "Yes"}
              price={item.pricing.usd_price}
              availiablity={item.availability}
              impressions={item.impressions}
              like_IDs={item.like_IDs}
              art_id={item.art_id}
            />
          )}
        />
      )}

      {!isLoading && data.length < 1 && (
        <EmptyArtworks size={70} writeUp="No new artworks at the moment" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({ container: { marginTop: 40 } });
