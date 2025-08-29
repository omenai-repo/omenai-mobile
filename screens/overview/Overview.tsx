import { StyleSheet, Text, RefreshControl, View } from 'react-native';
import React, { useCallback, useRef, useState } from 'react';
import WithModal from 'components/modal/WithModal';
import Header from 'components/header/Header';
import SalesOverview from './components/SalesOverview';
import RecentOrders from './components/RecentOrders';
import { HighlightCard } from './components/HighlightCard';
import ScrollWrapper from 'components/general/ScrollWrapper';
import PopularArtworks from './components/PopularArtworks';

export default function Overview() {
  const [refreshCount, setRefreshCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const inflight = useRef(0);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setRefreshCount((prev) => prev + 1);
  }, []);

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
          <HighlightCard refreshCount={refreshCount} onLoadingChange={handleLoadingChange} />
        </View>
        <SalesOverview refreshCount={refreshCount} onLoadingChange={handleLoadingChange} />
        <RecentOrders refreshCount={refreshCount} onLoadingChange={handleLoadingChange} />
        <PopularArtworks refreshCount={refreshCount} onLoadingChange={handleLoadingChange} />
      </ScrollWrapper>
    </WithModal>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 20 },
});
