import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import ArtworkCard from "components/artwork/ArtworkCard";
import { fetchArtworks } from "services/artworks/fetchArtworks";
import { colors } from "config/colors.config";
import ArtworkCardLoader from "components/general/ArtworkCardLoader";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { screenName } from "constants/screenNames.constants";
import ViewAllCategoriesButton from "components/buttons/ViewAllCategoriesButton";
import EmptyArtworks from "components/general/EmptyArtworks";
import { fontNames } from "constants/fontNames.constants";

export default function NewArtworksListing({
  refreshCount,
}: {
  refreshCount?: number;
}) {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState([]);

  useEffect(() => {
    handleFetchArtworks();
  }, [refreshCount]);

  const handleFetchArtworks = async () => {
    setIsLoading(true);

    const results = await fetchArtworks({ listingType: "recent", page: 1 });

    if (results.isOk) {
      const resData = results.body.data;
      setData(resData);
    } else {
      console.log(results);
    }

    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate(screenName.catalog)}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            paddingHorizontal: 20,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: 500,
              flex: 1,
              fontFamily: fontNames.dmSans + "Medium",
            }}
          >
            New artworks for you
          </Text>
          <Feather name="chevron-right" color={colors.grey} size={20} />
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
                availiablity={item.availability}
                impressions={item.impressions}
                like_IDs={item.like_IDs}
                art_id={item.art_id}
              />
            );
          }}
          keyExtractor={(_, index) => JSON.stringify(index)}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 20 }}
          contentContainerStyle={{ paddingRight: 20 }}
        />
      )}
      {!isLoading && data.length < 1 && (
        <EmptyArtworks size={70} writeUp="No new artworks at the moment" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
  },
});
