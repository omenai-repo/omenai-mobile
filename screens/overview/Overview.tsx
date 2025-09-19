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

export const QK = {
  highlight: (slice: 'artworks' | 'sales' | 'net' | 'revenue') =>
    ['overview', 'highlight', slice] as const,
  salesOverview: ['overview', 'salesOverview'] as const,
  overviewOrders: ['overview', 'orders', 'recent'] as const,
  popularArtworks: ['overview', 'popularArtworks'] as const,
};

export default function Overview() {
  const [refreshing, setRefreshing] = useState(false);
  const inflight = useRef(0);
  const qc = useQueryClient();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      qc.invalidateQueries({ queryKey: QK.highlight('artworks') }),
      qc.invalidateQueries({ queryKey: QK.highlight('sales') }),
      qc.invalidateQueries({ queryKey: QK.highlight('net') }),
      qc.invalidateQueries({ queryKey: QK.highlight('revenue') }),
      qc.invalidateQueries({ queryKey: QK.salesOverview }),
      qc.invalidateQueries({ queryKey: QK.overviewOrders }),
      qc.invalidateQueries({ queryKey: QK.popularArtworks }),
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
      <ScrollWrapper
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
