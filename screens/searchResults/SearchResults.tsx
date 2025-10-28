import { Alert, Platform, StatusBar, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import * as Sentry from '@sentry/react-native';
import { colors } from '../../config/colors.config';
import { useSearchStore } from 'store/search/searchStore';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { fetchSearchKeyWordResults } from 'services/search/fetchSearchKeywordResults';
import ResultsListing from './components/resultsListing/ResultsListing';
import SearchInput from 'components/inputs/SearchInput';
import MiniArtworkCardLoader from 'components/general/MiniArtworkCardLoader';
import EmptyArtworks from 'components/general/EmptyArtworks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SearchResults() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { searchQuery, setIsLoading, isLoading } = useSearchStore();
  const insets = useSafeAreaInsets();

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

    // Breadcrumb: user initiated a search
    Sentry.addBreadcrumb({
      category: 'search',
      message: `Search initiated for "${searchQuery}"`,
      level: 'info',
    });

    try {
      const results = await fetchSearchKeyWordResults(searchQuery);

      if (results?.isOk) {
        const arr = results.body.data ?? [];
        setData(arr);
        setDataLength(arr.length);

        Sentry.addBreadcrumb({
          category: 'search',
          message: `Search completed for "${searchQuery}" - ${arr.length} results`,
          level: 'info',
        });
      } else {
        Sentry.setContext('searchResponse', { query: searchQuery, response: results });
        Sentry.captureMessage(`Search API returned non-ok for "${searchQuery}"`, 'error');

        Alert.alert(results?.body ?? 'Something went wrong while searching');
      }
    } catch (err: any) {
      Sentry.addBreadcrumb({
        category: 'exception',
        message: `Search threw exception for "${searchQuery}"`,
        level: 'error',
      });
      Sentry.captureException(err);

      Alert.alert(err?.message ?? 'An unexpected error occurred while searching');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <View style={{ paddingHorizontal: 15 }}>
        <SearchInput />
        {searchQuery.length > 0 ? (
          <>
            <Text style={styles.headerText}>Search for “{searchQuery}”:</Text>
            <Text style={{ fontSize: 16, color: colors.grey }}>{dataLength} results found</Text>
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
                ? 'Please enter at least 3 characters to search...'
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
  },
  headerText: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.primary_black,
    paddingVertical: 20,
  },
  artworksContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  singleColumn: {
    flex: 1,
    gap: 20,
  },
  loadingContainer: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  safeArea: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});
