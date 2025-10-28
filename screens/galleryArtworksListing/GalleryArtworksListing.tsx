import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
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
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useModalStore } from 'store/modal/modalStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Sentry from '@sentry/react-native';
import { useAppStore } from 'store/app/appStore';

export default function GalleryArtworksListing() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { updateModal } = useModalStore();
  const insets = useSafeAreaInsets();
  const { userSession, userType } = useAppStore();

  const ARTWORKS_QK = useMemo(
    () => ['artworks', userSession.id, userType],
    [userSession?.id, userType],
  );

  const artworksQuery = useQuery({
    queryKey: ARTWORKS_QK,
    queryFn: async () => {
      try {
        const res = await fetchAllArtworksById();
        if (!res?.isOk) throw new Error('Failed to fetch artworks');
        return Array.isArray(res.data) ? res.data : [];
      } catch (e: any) {
        Sentry.captureException(e);
        updateModal({
          message: e?.message ?? 'Failed to fetch artworks',
          showModal: true,
          modalType: 'error',
        });
        return [];
      }
    },

    staleTime: 30_000,
    gcTime: 10 * 60_000,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    select: (list: any[]) => [...list].reverse(),
  });

  const onRefresh = useCallback(async () => {
    await artworksQuery.refetch();
  }, [artworksQuery]);

  const isInitialLoading = artworksQuery.isLoading && !artworksQuery.data;
  const data = artworksQuery.data ?? [];

  return (
    <WithModal>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          paddingHorizontal: 20,
          paddingTop: insets.top + 16,
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
        {isInitialLoading ? (
          <MiniArtworkCardLoader />
        ) : (
          <View style={{ paddingBottom: 130, paddingHorizontal: 10 }}>
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
