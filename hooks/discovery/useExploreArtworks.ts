import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { useHomeStore } from "#store/discovery/homeStore";
import { fetchArtworks } from "#services/artwork/fetchArtworks";
import { fetchCuratedArtworks } from "#services/artwork/fetchCuratedArtworks";

export function useExploreArtworks() {
  const { isLoading, setIsLoading, listingType } = useHomeStore();
  const [data, setData] = useState<any[]>([]);

  const loadArtworks = useCallback(async () => {
    setIsLoading(true);
    setData([]);

    const results =
      listingType === "curated"
        ? await fetchCuratedArtworks({ page: 1 })
        : await fetchArtworks({ listingType, page: 1 });

    if (results.isOk) {
      const items = results.body.data;
      if (items?.length > 0) {
        const slice = items.slice(0, 4);
        const indexToSplit = slice.length / 2;
        setData([slice.slice(0, 2), slice.slice(indexToSplit, 4)]);
      }
    } else {
      Alert.alert(results.body);
    }

    setIsLoading(false);
  }, [listingType, setIsLoading]);

  useEffect(() => {
    loadArtworks();
  }, [loadArtworks]);

  return { data, isLoading, listingType };
}
