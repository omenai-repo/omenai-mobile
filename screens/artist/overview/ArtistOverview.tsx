import React, { useCallback, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useDevice } from "#hooks/useDevice";
import {
  View,
  Text,
  RefreshControl,
  Image,
  Pressable,
  Animated,
} from "react-native";
import tw from "twrnc";
import { SvgXml } from "react-native-svg";
import { dropdownIcon, dropUpIcon, arrowUpRightWhite } from "#utils/SvgImages";
import Header from "#components/header/Header";
import ScrollWrapper from "#components/general/ScrollWrapper";
import SalesOverview from "#screens/overview/components/SalesOverview";
import PopularArtworks from "#screens/overview/components/PopularArtworks";

import { HighlightCard } from "./HighlightCard";
import { useQueryClient } from "@tanstack/react-query";
import { QK } from "#utils/queryKeys";
import { useAppStore } from "#store/app/appStore";
import BlurStatusBar from "#components/general/BlurStatusBar";
import { useScrollY } from "#hooks/useScrollY";
import { screenName } from "#constants/screenNames.constants";

const ArtistOverview = () => {
  const queryClient = useQueryClient();
  const { userSession } = useAppStore();
  const { scrollY, onScroll } = useScrollY();
  const isAnyFetching = false;

  const onRefresh = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: QK.highlightArtist("sales", userSession?.id),
      }),
      queryClient.invalidateQueries({
        queryKey: QK.highlightArtist("net", userSession?.id),
      }),
      queryClient.invalidateQueries({
        queryKey: QK.highlightArtist("revenue", userSession?.id),
      }),
      queryClient.invalidateQueries({
        queryKey: QK.highlightArtist("balance", userSession?.id),
      }),
      queryClient.invalidateQueries({
        queryKey: QK.salesOverview(userSession?.id),
      }),
      queryClient.invalidateQueries({
        queryKey: QK.popularArtworks(userSession?.id),
      }),
    ]);
  }, [queryClient, userSession?.id]);

  return (
    <View style={tw`flex-1 bg-[#F7F7F7]`}>
      <BlurStatusBar scrollY={scrollY} intensity={80} tint="light" />
      <ScrollWrapper
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isAnyFetching} onRefresh={onRefresh} />
        }
        onScroll={onScroll}
      >
        <Header />

        {/* Highlight Cards & Sales chart use their own queries and report loading via onLoadingChange if needed */}
        <HighlightCard />

        <>
          <SalesOverview />
        </>
        <PopularArtworks />
      </ScrollWrapper>
    </View>
  );
};

export default ArtistOverview;
