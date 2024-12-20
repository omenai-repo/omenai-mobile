import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Loader from "components/general/Loader";
import { Feather } from "@expo/vector-icons";
import { isLoading } from "expo-font";
import ArtworkCardLoader from "components/general/ArtworkCardLoader";
import { fetchPopularArtworks } from "services/artworks/fetchPopularArtworks";
import ArtworkCard from "components/artwork/ArtworkCard";
import EmptyArtworks from "components/general/EmptyArtworks";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "constants/screenNames.constants";
import NavBtnComponent from "components/artwork/NavBtnComponent";

export default function PopularArtworks({
  refreshCount,
}: {
  refreshCount: number;
}) {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    setIsLoading(true);
    async function handleFetchGalleryPopularArtworks() {
      const results = await fetchPopularArtworks();
      setData(results.data);

      setIsLoading(false);
    }

    handleFetchGalleryPopularArtworks();
  }, [refreshCount]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate(screenName.gallery.artworks)}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
          <Text
            style={{ fontSize: 18, fontWeight: "500", flex: 1, color: "#000" }}
          >
            Popular artworks
          </Text>
          <NavBtnComponent onPress={() => {}} />
        </View>
      </TouchableOpacity>
      {isLoading && <ArtworkCardLoader />}
      {!isLoading && data.length > 0 && (
        <FlatList
          data={data}
          renderItem={({
            item,
            index,
          }: {
            item: ArtworkFlatlistItem;
            index: number;
          }) => {
            return (
              <ArtworkCard
                title={item.title}
                url={item.url}
                artist={item.artist}
                showPrice={item.pricing.shouldShowPrice === "Yes"}
                price={item.pricing.usd_price}
                impressions={item.impressions}
                like_IDs={item.like_IDs}
                art_id={item.art_id}
                galleryView
              />
            );
          }}
          keyExtractor={(_, index) => JSON.stringify(index)}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 30 }}
          contentContainerStyle={{ paddingRight: 20 }}
        />
      )}
      {!isLoading && data.length === 0 && <EmptyArtworks size={70} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 25,
    paddingBottom: 20,
  },
});
