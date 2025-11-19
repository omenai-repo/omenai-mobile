import { StyleSheet, RefreshControl, View } from 'react-native';
import React, { useCallback, useRef, useState } from 'react';
import WithModal from 'components/modal/WithModal';
import Header from 'components/header/Header';
import SalesOverview from './components/SalesOverview';
import RecentOrders from './components/RecentOrders';
import { HighlightCard } from './components/HighlightCard';
import ScrollWrapper from 'components/general/ScrollWrapper';
import PopularArtworks from './components/PopularArtworks';
import { useQueryClient } from '@tanstack/react-query';
import { QK } from 'utils/queryKeys';
import { useAppStore } from 'store/app/appStore';
import BlurStatusBar from 'components/general/BlurStatusBar';
import { useScrollY } from 'hooks/useScrollY';

export default function Overview() {
  const [refreshing, setRefreshing] = useState(false);
  const inflight = useRef(0);
  const qc = useQueryClient();
  const { userSession } = useAppStore();
  const { scrollY, onScroll } = useScrollY();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      qc.invalidateQueries({ queryKey: QK.highlightGallery('artworks', userSession?.id) }),
      qc.invalidateQueries({ queryKey: QK.highlightGallery('sales', userSession?.id) }),
      qc.invalidateQueries({ queryKey: QK.highlightGallery('net', userSession?.id) }),
      qc.invalidateQueries({ queryKey: QK.highlightGallery('revenue', userSession?.id) }),
      qc.invalidateQueries({ queryKey: QK.salesOverview(userSession?.id) }),
      qc.invalidateQueries({ queryKey: QK.overviewOrders(userSession?.id) }),
      qc.invalidateQueries({ queryKey: QK.popularArtworks(userSession?.id) }),
    ]);
  }, [qc]);

  const handleLoadingChange = useCallback((isLoading: boolean) => {
    inflight.current += isLoading ? 1 : -1;
    if (inflight.current <= 0) {
      inflight.current = 0;
      setRefreshing(false);
    }
  }, []);

  return (
    <WithModal>
      <BlurStatusBar scrollY={scrollY} intensity={80} tint="light" />
      <ScrollWrapper
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        onScroll={onScroll}
      >
        <Header />
        <View style={styles.container}>
          <HighlightCard onLoadingChange={handleLoadingChange} />
        </View>
        <SalesOverview onLoadingChange={handleLoadingChange} />
        <RecentOrders onLoadingChange={handleLoadingChange} />
        <PopularArtworks onLoadingChange={handleLoadingChange} />
      </ScrollWrapper>
    </WithModal>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 20 },
});
