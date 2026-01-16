import {
  StyleSheet,
  RefreshControl,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import tw from "twrnc";
import React, { useCallback, useRef, useState } from "react";
import WithModal from "#components/modal/WithModal";
import Header from "#components/header/Header";
import SalesOverview from "./components/SalesOverview";
import { HighlightCard } from "./components/HighlightCard";
import ScrollWrapper from "#components/general/ScrollWrapper";
import PopularArtworks from "./components/PopularArtworks";
import { useQueryClient } from "@tanstack/react-query";
import { QK } from "#utils/queryKeys";
import { useAppStore } from "#store/app/appStore";
import BlurStatusBar from "#components/general/BlurStatusBar";
import { useScrollY } from "#hooks/useScrollY";
import { useDevice } from "#hooks/useDevice";
import NavBtnComponent from "#components/artwork/NavBtnComponent";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { screenName } from "#constants/screenNames.constants";

export default function Overview() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [refreshing, setRefreshing] = useState(false);
  const inflight = useRef(0);
  const qc = useQueryClient();
  const { userSession } = useAppStore();
  const { scrollY, onScroll } = useScrollY();

  const { isTablet, width, horizontalPadding } = useDevice();
  // On Tablet, we have 40 padding (20 left + 20 right)
  const tabletAvailableWidth = width - 40;
  // Half width, minus some gap (e.g. 20 gap)
  const halfWidth = (tabletAvailableWidth - 20) / 2;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      qc.invalidateQueries({
        queryKey: QK.highlightGallery("artworks", userSession?.id),
      }),
      qc.invalidateQueries({
        queryKey: QK.highlightGallery("sales", userSession?.id),
      }),
      qc.invalidateQueries({
        queryKey: QK.highlightGallery("net", userSession?.id),
      }),
      qc.invalidateQueries({
        queryKey: QK.highlightGallery("revenue", userSession?.id),
      }),
      qc.invalidateQueries({ queryKey: QK.salesOverview(userSession?.id) }),

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
      <View style={tw`flex-1 bg-[#F7F7F7]`}>
        <BlurStatusBar scrollY={scrollY} intensity={80} tint="light" />
        <ScrollWrapper
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onScroll={onScroll}
        >
          <Header />
          <View style={styles.container}>
            <HighlightCard onLoadingChange={handleLoadingChange} />
          </View>

          <SalesOverview onLoadingChange={handleLoadingChange} />
          <PopularArtworks onLoadingChange={handleLoadingChange} />
        </ScrollWrapper>
      </View>
    </WithModal>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 20 },
});
