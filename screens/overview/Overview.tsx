import { StyleSheet, Text, RefreshControl, View, Platform } from 'react-native';
import React, { useState } from 'react';
import WithModal from 'components/modal/WithModal';
import Header from 'components/header/Header';
import SalesOverview from './components/SalesOverview';
import RecentOrders from './components/RecentOrders';
import { HighlightCard } from './components/HighlightCard';
import ScrollWrapper from 'components/general/ScrollWrapper';

export default function Overview() {
  const [refreshCount, setRefreshCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    // setRefreshing(true);
    setRefreshCount((prev) => prev + 1);
  }, []);

  return (
    <WithModal>
      <ScrollWrapper
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Header />
        <View style={styles.container}>
          <HighlightCard refreshCount={refreshCount} />
        </View>
        <SalesOverview refreshCount={refreshCount} userType="gallery" />
        {/* <PopularArtworks refreshCount={refreshCount} /> */}
        <RecentOrders refreshCount={refreshCount} />
      </ScrollWrapper>
    </WithModal>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  contentsContainer: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 20,
  },
});
