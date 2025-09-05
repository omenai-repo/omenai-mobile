import { KeyboardAvoidingView, Platform, StyleSheet, View, StatusBar } from 'react-native';
import React, { startTransition, useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from 'config/colors.config';
import BackScreenButton from 'components/buttons/BackScreenButton';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import OrderSummary from './components/OrderSummary';
import { useOrderSummaryStore } from 'store/orders/OrderSummaryStore';
import ShippingDetails from './components/ShippingDetails';
import { fetchsingleArtworkOnPurchase } from 'services/artworks/fetchSingleArtworkOnPurchase';
import Loader from 'components/general/Loader';
import PriceQuoteSent from './components/PriceQuoteSent';
import { screenName } from 'constants/screenNames.constants';
import WithModal from 'components/modal/WithModal';
import ScrollWrapper from 'components/general/ScrollWrapper';
import { useQueryClient } from '@tanstack/react-query';
import { useAppStore } from 'store/app/appStore';

export default function PurchaseArtwork() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute();
  const userId = useAppStore((state) => state.userSession.id);

  const queryClient = useQueryClient();
  const {
    selectedSectionIndex,
    setIsLoading,
    artworkOrderData,
    setArtworkOrderData,
    isLoading,
    resetState,
    setSelectedSectionIndex,
  } = useOrderSummaryStore();

  const handleFetchArtworkDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const { title } = route.params as RouteParamsType;
      const results = await fetchsingleArtworkOnPurchase(title);
      if (results.isOk) setArtworkOrderData(results.data);
    } finally {
      setIsLoading(false);
    }
  }, [route.params, setArtworkOrderData, setIsLoading]);

  useEffect(() => {
    handleFetchArtworkDetails();
  }, [handleFetchArtworkDetails]);

  const handleBackNavigation = useCallback(
    (goHome?: boolean) => {
      if (selectedSectionIndex === 2) {
        // Smooth, non-blocking UI update (React 18)
        startTransition(() => {
          setSelectedSectionIndex(selectedSectionIndex > 1 ? selectedSectionIndex - 1 : 1);
        });
        return;
      } else if (selectedSectionIndex === 1) {
        // Go back to previous screen
        resetState();
        navigation.goBack();
        return;
      } else if (selectedSectionIndex === 3) {
        // On final step, either go home or back
        resetState();
        navigation.goBack();
      }

      if (goHome) {
        // 1) clear local wizard state
        resetState();

        queryClient.invalidateQueries({ queryKey: ['orders', userId] });
        navigation.goBack();
        return;
      }

      // default “back”
      resetState();
      navigation.goBack();
    },
    [queryClient, navigation, resetState, selectedSectionIndex],
  );

  return (
    <WithModal>
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <SafeAreaView style={styles.safeArea}>
          <View style={{ paddingHorizontal: 20 }}>
            <BackScreenButton handleClick={handleBackNavigation} />
          </View>
        </SafeAreaView>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.scrollContainer}
        >
          <ScrollWrapper nestedScrollEnabled={true}>
            {/* <TabsIndicator selectedIndex={selectedSectionIndex} /> */}
            {isLoading && <Loader />}
            {!isLoading && artworkOrderData ? (
              <View key={selectedSectionIndex /* remount on step change for snappy UI */}>
                {selectedSectionIndex === 1 && <OrderSummary data={artworkOrderData} />}
                {selectedSectionIndex === 2 && <ShippingDetails data={artworkOrderData} />}
                {selectedSectionIndex === 3 && (
                  <PriceQuoteSent handleClick={() => handleBackNavigation(true)} />
                )}
              </View>
            ) : null}
          </ScrollWrapper>
        </KeyboardAvoidingView>
      </View>
    </WithModal>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: colors.white,
    // marginTop: 10,
  },
  safeArea: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});
