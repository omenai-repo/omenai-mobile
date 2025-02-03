import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "config/colors.config";
import { fetchUserSavedArtworks } from "services/artworks/fetchUserSavedArtwork";
import { UseSavedArtworksStore } from "store/artworks/SavedArtworksStore";
import { getImageFileView } from "lib/storage/getImageFileView";
import Loader from "components/general/Loader";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { screenName } from "constants/screenNames.constants";
import { utils_handleFetchUserID } from "utils/utils_asyncStorage";
import useLikedState from "custom/hooks/useLikedState";
import BackHeaderTitle from "components/header/BackHeaderTitle";
import { utils_formatPrice } from "utils/utils_priceFormatter";
import { StackNavigationProp } from "@react-navigation/stack";
import ScrollWrapper from "components/general/ScrollWrapper";

type SavedArtworkItemProps = {
  name: string;
  artistName: string;
  url: string;
  index: number;
  art_id: string;
  likeIds: string[];
  impressions: number;
  pricing: {
    currency: string;
    price: number;
    shouldShowPrice: "Yes" | "No";
    usd_price: number;
  };
};

export default function SavedArtworks() {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const isFocused = useIsFocused();

  const { isLoading, setIsLoading, data, setData } = UseSavedArtworksStore();
  const [refreshing, setRefreshing] = useState(false);

  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    handleFetchUserSessionData();
    handleFetchUserSavedArtorks();
  }, [isFocused]);

  const handleFetchUserSessionData = async () => {
    const userId = await utils_handleFetchUserID();
    setSessionId(userId);
  };

  const onRefresh = React.useCallback(() => {
    // setRefreshing(true);
    handleFetchUserSavedArtorks();
  }, []);

  const handleFetchUserSavedArtorks = async () => {
    setIsLoading(true);
    const results = await fetchUserSavedArtworks();

    if (results?.isOk) {
      setData(results.data);
    }

    setIsLoading(false);
  };

  const SavedArtworkItem = ({
    name,
    artistName,
    url,
    index,
    art_id,
    likeIds,
    impressions,
    pricing,
  }: SavedArtworkItemProps) => {
    let image_href = getImageFileView(url, 80);

    const { handleLike } = useLikedState(
      impressions,
      likeIds,
      sessionId,
      art_id
    );

    const handleRemove = () => {
      handleLike(false);

      //remove artwork from state
      let prevData = data;
      prevData.splice(index, 1);
      setData(prevData);
    };

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(screenName.artwork, { title: name, url })
        }
        activeOpacity={1}
      >
        <View style={styles.savedArtworkItem}>
          <View style={{ flex: 1, flexDirection: "row", gap: 15 }}>
            <Image
              source={{ uri: image_href }}
              style={styles.image}
              resizeMode="contain"
            />
            <View style={{ paddingTop: 5 }}>
              <Text style={{ fontSize: 16, color: colors.primary_black }}>
                {name}
              </Text>
              <Text style={{ fontSize: 14, color: "#858585", marginTop: 2 }}>
                {artistName}
              </Text>
              {pricing.shouldShowPrice === "Yes" && (
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.primary_black,
                    marginTop: 5,
                    fontWeight: 500,
                  }}
                >
                  {utils_formatPrice(pricing.usd_price)}
                </Text>
              )}
              <TouchableOpacity
                onPress={handleRemove}
                style={{ paddingTop: 5, flexWrap: "wrap" }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    padding: 10,
                    marginTop: 10,
                    borderRadius: 20,
                    backgroundColor: "#f1f1f1",
                  }}
                >
                  <AntDesign name="heart" color={"#ff0000"} size={14} />
                  <Text style={{ fontSize: 12, color: colors.primary_black }}>
                    Remove from saved
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <BackHeaderTitle title="Saved artworks" />
      <ScrollWrapper
        style={styles.mainContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {isLoading && <Loader />}
        {data.length > 0 && !isLoading && (
          <View style={styles.sectionContainer}>
            {data.map((artwork, index) => (
              <SavedArtworkItem
                name={artwork.title}
                artistName={artwork.artist}
                url={artwork.url}
                art_id={artwork.art_id}
                likeIds={artwork.like_ids}
                impressions={artwork.impressions}
                index={index}
                key={index}
                pricing={artwork.pricing}
              />
            ))}
          </View>
        )}
        {data.length === 0 && !isLoading && (
          <View
            style={{
              height: 400,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 20 }}>No Saved Artworks</Text>
          </View>
        )}
      </ScrollWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  mainContainer: {
    paddingHorizontal: 20,
    marginTop: 15,
    paddingTop: 15,
    flex: 1,
  },
  sectionContainer: {
    gap: 25,
  },
  savedArtworkItem: {
    flexDirection: "row",
    gap: 10,
  },
  image: {
    width: 80,
    height: 100,
    backgroundColor: "#f9f9f9",
  },
});
