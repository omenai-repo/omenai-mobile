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
          <Text style={{ fontSize: 20, flex: 1 }}>Artworks</Text>
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
          <ArtworksListing data={data} />
        )}
        <View style={{ paddingVertical: 25 }} />
      </ScrollWrapper>
    </WithModal>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
    // backgroundColor: '#ff0000',
    paddingTop: 20,
    marginTop: 20,
  },
  safeArea: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
