import { useCallback, useMemo } from "react";
import { Text, View } from "react-native";

import { Feather } from "@expo/vector-icons";
import FittedBlackButton from "#components/buttons/FittedBlackButton";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "#constants/screenNames.constants";
import { fetchAllArtworksById } from "#services/artworks/fetchAllArtworksById";
import MiniArtworkCardLoader from "#components/general/MiniArtworkCardLoader";
import ScrollWrapper from "#components/general/ScrollWrapper";
import ArtworksListing from "#components/general/ArtworksListing";
import { useQuery } from "@tanstack/react-query";
import { useModalStore } from "#store/modal/modalStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppStore } from "#store/app/appStore";
import tw from "twrnc";
import { colors } from "#config/colors.config";

export default function GalleryArtworksListing() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { updateModal } = useModalStore();
  const insets = useSafeAreaInsets();
  const { userSession, userType } = useAppStore();

  const ARTWORKS_QK = useMemo(
    () => ["artworks", userSession?.id, userType],
    [userSession?.id, userType]
  );

  const artworksQuery = useQuery({
    queryKey: ARTWORKS_QK,
    queryFn: async () => {
      try {
        const res = await fetchAllArtworksById();
        if (!res?.isOk) throw new Error("Failed to fetch artworks");
        return Array.isArray(res.data) ? res.data : [];
      } catch (e: any) {
        updateModal({
          message: e?.message ?? "Failed to fetch artworks",
          showModal: true,
          modalType: "error",
        });
        return [];
      }
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true, // only if stale
    refetchOnReconnect: true, // only if stale
    refetchOnWindowFocus: true, // only if stale
    enabled: !!userSession?.id,
  });

  // Pull-to-refresh: force a network refetch now
  const onRefresh = useCallback(async () => {
    await artworksQuery.refetch();
  }, [artworksQuery]);

  const isInitialLoading = artworksQuery.isLoading && !artworksQuery.data;
  const data = useMemo(() => artworksQuery.data ?? [], [artworksQuery.data]);

  return (
    <>
      <View
        style={[
          tw`flex-row items-center gap-2.5 px-5`,
          {
            paddingTop: insets.top + 16,
          },
        ]}
      >
        <Text
          style={[tw`text-lg flex-1 font-medium `, { color: colors.black }]}
        >
          Artworks
        </Text>
        <FittedBlackButton
          value="Upload artwork"
          onClick={() => navigation.navigate(screenName.gallery.uploadArtwork)}
          style={tw`h-[36px] px-4`}
          textStyle={tw`text-[13px]`}
        >
          <Feather name="plus" color={"#fff"} size={16} />
        </FittedBlackButton>
      </View>

      {isInitialLoading ? (
        <ScrollWrapper
          style={tw`flex-1 mt-5`}
          showsVerticalScrollIndicator={false}
        >
          <MiniArtworkCardLoader />
        </ScrollWrapper>
      ) : (
        <View style={tw`flex-1 mt-5`}>
          <ArtworksListing data={data} onRefresh={onRefresh} />
        </View>
      )}
    </>
  );
}
