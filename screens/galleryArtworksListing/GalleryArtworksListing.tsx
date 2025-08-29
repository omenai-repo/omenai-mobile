import React, { useCallback, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Platform } from 'react-native';
import WithModal from 'components/modal/WithModal';
import { Feather } from '@expo/vector-icons';
import FittedBlackButton from 'components/buttons/FittedBlackButton';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { screenName } from 'constants/screenNames.constants';
import { fetchAllArtworksById } from 'services/artworks/fetchAllArtworksById';
import MiniArtworkCardLoader from 'components/general/MiniArtworkCardLoader';
import ScrollWrapper from 'components/general/ScrollWrapper';
import ArtworksListing from 'components/general/ArtworksListing';

export default function GalleryArtworksListing() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const inFlight = useRef(false); // single-flight guard
  const isMounted = useRef(true);

  const handleFetchGalleryArtworks = useCallback(async (opts?: { isPull?: boolean }) => {
    if (inFlight.current) return;
    inFlight.current = true;
    try {
      // show skeleton only for first load or non-pull refresh
      if (!opts?.isPull) setIsLoading(true);

      const results = await fetchAllArtworksById();
      const list = results?.data ?? [];
      if (isMounted.current) {
        setData([...list].reverse());
      }
    } catch (e) {
      console.error('Failed to fetch gallery artworks', e);
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
      inFlight.current = false;
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      isMounted.current = true;
      handleFetchGalleryArtworks();
      return () => {
        isMounted.current = false;
      };
    }, [handleFetchGalleryArtworks]),
  );

  const onRefresh = useCallback(async () => {
    await handleFetchGalleryArtworks({ isPull: true });
  }, [handleFetchGalleryArtworks]);

  return (
    <WithModal>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          paddingHorizontal: 20,
          marginTop: Platform.OS === 'ios' ? 80 : 40,
        }}
      >
        <Text style={{ fontSize: 18, flex: 1, fontWeight: '500', color: '#000' }}>Artworks</Text>
        <FittedBlackButton
          value="Upload artwork"
          isDisabled={false}
          onClick={() => navigation.navigate(screenName.gallery.uploadArtwork)}
        >
          <Feather name="plus" color={'#fff'} size={20} />
        </FittedBlackButton>
      </View>

      <ScrollWrapper style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <MiniArtworkCardLoader />
        ) : (
          <View style={{ paddingBottom: 130, paddingHorizontal: 10 }}>
            {/* Let the list manage pull-to-refresh */}
            <ArtworksListing data={data} onRefresh={onRefresh} />
          </View>
        )}
      </ScrollWrapper>
    </WithModal>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    paddingTop: 20,
    marginTop: 20,
  },
});
