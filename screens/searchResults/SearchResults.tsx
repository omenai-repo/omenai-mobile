import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Platform,
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "../../config/colors.config";
import { useSearchStore } from "store/search/searchStore";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { fetchSearchKeyWordResults } from "services/search/fetchSearchKeywordResults";
import ResultsListing from "./components/resultsListing/ResultsListing";
import SearchInput from "components/inputs/SearchInput";
import MiniArtworkCardLoader from "components/general/MiniArtworkCardLoader";
import EmptyArtworks from "components/general/EmptyArtworks";

export default function SearchResults() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { searchQuery, setIsLoading, isLoading } = useSearchStore();

  const [data, setData] = useState<any[]>([]);
  const [dataLength, setDataLength] = useState(0);

  useEffect(() => {
    if (searchQuery.length > 2) {
      handleFetchSearch();
    } else if (searchQuery.length === 0) {
      setData([]);
      setDataLength(0);
    }
  }, [searchQuery]);

  const handleFetchSearch = async () => {
    setIsLoading(true);
    const results = await fetchSearchKeyWordResults(searchQuery);

    let arr = [];

    if (results.isOk) {
      arr = results.body.data;
      setData(arr);
      setDataLength(arr.length);
    } else {
      Alert.alert(results.body);
    }

    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={{ paddingHorizontal: 15 }}>
        <SearchInput />
        {searchQuery.length > 0 ? (
          <>
            <Text style={styles.headerText}>Search for “{searchQuery}”:</Text>
            <Text style={{ fontSize: 16, color: colors.grey }}>
              {dataLength} results found
            </Text>
          </>
        ) : (
          <View>
            <Text style={styles.headerText}>Search for artworks on Omenai</Text>
          </View>
        )}
      </View>
      {isLoading && (
        <View style={{ marginTop: 30 }}>
          <MiniArtworkCardLoader />
        </View>
      )}
      {!isLoading && dataLength > 0 && (
        <View style={{ flex: 1 }}>
          {/* <Filters dataLength={dataLength}  /> */}
          <ResultsListing data={data} />
        </View>
      )}
      {searchQuery.length > 0 && dataLength === 0 && !isLoading && (
        <View style={{ marginTop: 40 }}>
          <EmptyArtworks
            size={100}
            writeUp={
              searchQuery.length < 3 && dataLength === 0
                ? "Please enter at least 3 characters to search..."
                : `Can't find artwork you're looking for, try checking for mispellings`
            }
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: Platform.OS === "ios" ? 80 : 50,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "500",
    color: colors.primary_black,
    paddingVertical: 20,
  },
  artworksContainer: {
    flexDirection: "row",
    gap: 20,
  },
  singleColumn: {
    flex: 1,
    gap: 20,
  },
  loadingContainer: {
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  safeArea: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
