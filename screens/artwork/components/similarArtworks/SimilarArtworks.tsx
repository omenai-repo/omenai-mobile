import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "config/colors.config";
import ArtworkCard from "components/artwork/ArtworkCard";
import { fetchArtworksByCriteria } from "services/artworks/fetchArtworksByCriteria";
import ArtworkCardLoader from "components/general/ArtworkCardLoader";
import { FlatList } from "react-native-gesture-handler";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "constants/screenNames.constants";
import { Feather } from "@expo/vector-icons";

export default function SimilarArtworks({
  medium,
  title = "",
}: {
  medium: string;
  title: string;
}) {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<ArtworkFlatlistItem[]>([]);

  useEffect(() => {
    handleFetchArtworksByCiteria();
  }, []);

  const handleFetchArtworksByCiteria = async () => {
    setIsLoading(true);
    const results = await fetchArtworksByCriteria({
      medium,
      page: 1,
      filters: null,
    });

    if (results.isOk) {
      let resultsData = results.data as [];
      if (resultsData.length > 0) {
        const parsedResults = resultsData.filter((artwork: any) => {
          return artwork.title !== title;
        });

        setData(parsedResults.splice(0, 4));
      }
    }
    setIsLoading(false);
  };

  return (
    <View style={styles.similarContainer}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(screenName.artworksMedium, {
            catalog: medium,
          })
        }
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            paddingHorizontal: 20,
          }}
        >
          <Text style={styles.similarTitle}>Hot Recommendations</Text>
          <Feather name="chevron-right" color={colors.grey} size={20} />
        </View>
      </TouchableOpacity>
      <View style={styles.artworksContainer}>
        {isLoading ? (
          <ArtworkCardLoader />
        ) : (
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <ArtworkCard
                title={item.title}
                url={item.url}
                artist={item.artist}
                showPrice={item.pricing.shouldShowPrice === "Yes"}
                price={item.pricing.usd_price}
              />
            )}
            contentContainerStyle={{
              paddingRight: 20,
            }}
            keyExtractor={(item) => item.title}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  similarContainer: {
    marginTop: 0,
    marginBottom: 200,
  },
  similarTitle: {
    fontSize: 20,
    fontWeight: "500",
    color: colors.primary_black,
    flex: 1,
  },
  artworksContainer: {
    marginTop: 20,
  },
  singleColumn: {
    flex: 1,
    gap: 20,
  },
  viewMoreContainer: {
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
