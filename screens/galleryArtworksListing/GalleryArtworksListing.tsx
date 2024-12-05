import {
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Platform,
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
import WithModal from "components/modal/WithModal";
import { Feather } from "@expo/vector-icons";
import FittedBlackButton from "components/buttons/FittedBlackButton";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "constants/screenNames.constants";
import { fetchAllArtworksById } from "services/artworks/fetchAllArtworksById";
import MiniArtworkCardLoader from "components/general/MiniArtworkCardLoader";
import ScrollWrapper from "components/general/ScrollWrapper";
import ArtworksListing from "components/general/ArtworksListing";

export default function GalleryArtworksListing() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [isloading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    // setRefreshing(true);
    handleFetchGalleryArtworks();
  }, []);

  useEffect(() => {
    handleFetchGalleryArtworks();
  }, []);

  async function handleFetchGalleryArtworks() {
    setIsLoading(true);
    const results = await fetchAllArtworksById();
    setData(results.data);

    setIsLoading(false);
  }

  return (
    <WithModal>
      <SafeAreaView style={styles.safeArea}>
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
              fontSize: 24,
              flex: 1,
              fontWeight: "500",
              color: "#000",
            }}
          >
            Artworks
          </Text>
          <FittedBlackButton
            value="Upload artwork"
            isDisabled={false}
            onClick={() =>
              navigation.navigate(screenName.gallery.uploadArtwork)
            }
          >
            <Feather name="plus" color={"#fff"} size={20} />
          </FittedBlackButton>
        </View>
      </SafeAreaView>
      <ScrollWrapper
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {isloading ? (
          <MiniArtworkCardLoader />
        ) : (
          <View style={{ paddingBottom: 130, paddingHorizontal: 10 }}>
            <ArtworksListing data={data} />
          </View>
        )}
      </ScrollWrapper>
    </WithModal>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    // paddingHorizontal: 5,
    // backgroundColor: '#ff0000',
    paddingTop: 20,
    marginTop: 20,
  },
  safeArea: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
