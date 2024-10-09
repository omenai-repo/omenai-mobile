import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "config/colors.config";
import ArtworkCard from "components/artwork/ArtworkCard";
import { fetchArtworksByCriteria } from "services/artworks/fetchArtworksByCriteria";
import ArtworkCardLoader from "components/general/ArtworkCardLoader";
import { FlatList } from "react-native-gesture-handler";
import LongBlackButton from "components/buttons/LongBlackButton";
import FittedBlackButton from "components/buttons/FittedBlackButton";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "constants/screenNames.constants";

export default function SimilarArtworks({
  medium,
  title = "",
}: {
  medium: string;
  title: string;
}) {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState([]);

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
      <Text style={styles.similarTitle}>Hot Recommendations</Text>
      <View style={styles.artworksContainer}>
        {isLoading ? (
          <ArtworkCardLoader />
        ) : (
          <FlatList
            data={data}
            renderItem={({
              item,
              index,
            }: {
              item: ArtworkFlatlistItem;
              index: number;
            }) => (
              <>
                <ArtworkCard
                  title={item.title}
                  url={item.url}
                  artist={item.artist}
                  showPrice={item.pricing.shouldShowPrice === "Yes"}
                  price={item.pricing.usd_price}
                />
                {data.length - 1 === index && (
                  <View style={styles.viewMoreContainer}>
                    <FittedBlackButton
                      value="View more similar artworks"
                      onClick={() => {
                        navigation.navigate(screenName.home);
                        navigation.navigate(screenName.artworksMedium, {
                          catalog: medium,
                        });
                      }}
                    />
                  </View>
                )}
              </>
            )}
            keyExtractor={(_, index) => JSON.stringify(index)}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            // style={{marginTop: 20}}
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
    paddingHorizontal: 20,
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
