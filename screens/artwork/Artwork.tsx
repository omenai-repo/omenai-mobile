import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import {
  FlatList,
  Image,
  Text,
  View,
  Dimensions,
  PixelRatio,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import LongBlackButton from "#components/buttons/LongBlackButton";
import DetailsCard from "./components/detailsCard/DetailsCard";
import ArtistInformationCard from "./components/detailsCard/ArtistInformationCard";
import ArtworkImageSection from "./components/ArtworkImageSection";
import ArtworkContentSection from "./components/ArtworkContentSection";
import ArtworkCard from "#components/artwork/ArtworkCard";
import { fetchsingleArtwork } from "#services/artworks/fetchSingleArtwork";
import { getImageFileView } from "#lib/storage/getImageFileView";
import SimilarArtworks from "./components/similarArtworks/SimilarArtworks";
import { screenName } from "#constants/screenNames.constants";
import { requestArtworkPrice } from "#services/artworks/requestArtworkPrice";
import { utils_getAsyncData } from "#utils/utils_asyncStorage";
import { useModalStore } from "#store/modal/modalStore";
import ArtworkSkeleton from "#components/skeleton/ArtworkSkeleton";
import { useAppStore } from "#store/app/appStore";
import BackHeaderTitle from "#components/header/BackHeaderTitle";
import { createViewHistory } from "#services/artworks/viewHistory/createViewHistory";
import { fetchArtworkByArtist } from "#services/artworks/fetchArtworkByArtist";
import tw from "twrnc";
import ScrollWrapper from "#components/general/ScrollWrapper";
import { resizeImageDimensions } from "#utils/utils_resizeImageDimensions.utils";
import ZoomArtwork from "./ZoomArtwork";
import { useScrollY } from "#hooks/useScrollY";
import { ArtworkDataType } from "#types/types";
import { Analytics } from "#utils/analytics";
import { colors } from "#config/colors.config";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type RouteParams = { art_id: string; url: string };

const useTabletLandscape = () => {
  const [win, setWin] = useState(Dimensions.get("window"));
  useEffect(() => {
    const sub = Dimensions.addEventListener("change", ({ window }) =>
      setWin(window),
    );
    return () => sub?.remove();
  }, []);
  const isTabletLandscape =
    win.width > win.height && Math.min(win.width, win.height) >= 768;
  return {
    isTabletLandscape,
    screenWidth: win.width,
    screenHeight: win.height,
  };
};

export default function Artwork() {
  const formatPackaging = (type: string | undefined) => {
    if (!type) return "Standard Packaging";
    if (type === "rolled") return "Rolled";
    if (type === "stretched") return "Stretched";
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const insets = useSafeAreaInsets();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute();
  const { art_id, url } = route.params as RouteParams;

  const { updateModal } = useModalStore();
  const { userType, userSession } = useAppStore();
  const { isTabletLandscape, screenWidth } = useTabletLandscape();
  const isTabletSize = Math.min(screenWidth) >= 768;

  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const [loadingPriceQuote, setLoadingPriceQuote] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { onScroll } = useScrollY();

  // 1) Fetch the artwork (cached; no re-fetch during staleTime window from App.tsx)
  const {
    data: artwork,
    isLoading: isLoadingArtwork,
    isError: isArtworkError,
  } = useQuery({
    queryKey: ["artwork", art_id],
    queryFn: async () => {
      const res = await fetchsingleArtwork(art_id);
      if (!res?.isOk) throw new Error("Failed to load artwork");
      return res.body.data as ArtworkDataType;
    },
    enabled: !!art_id,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });

  // 2) Fetch other works by the same artist (depends on artwork)
  const { data: similarArtworksByArtist = [] } = useQuery({
    queryKey: ["artist-artworks", artwork?.artist],
    enabled: !!artwork?.artist,
    queryFn: async () => {
      const res = await fetchArtworkByArtist(artwork!.artist as string);
      if (!res?.isOk) return [];
      const list = res.body.data as any[];
      return list.filter((a) => a.title !== artwork!.title);
    },
  });

  // 3) Record view history ONCE per session
  const viewedRef = useRef(false);
  useEffect(() => {
    if (!artwork || viewedRef.current) return;
    if (!userSession?.id) return;
    viewedRef.current = true;

    // Track in Vexo
    Analytics.track("view_artwork", {
      art_id: artwork.art_id,
      title: artwork.title,
      viewer_type: userType,
      user_id: userSession.id,
      artwork: artwork,
    });

    // Fire-and-forget; don’t block UI
    createViewHistory(
      artwork.title,
      artwork.artist,
      artwork.art_id,
      userSession.id,
      artwork.url,
    ).catch(() => {
      // silent fail
    });
  }, [artwork, userSession?.id, userType]);

  const dpr = PixelRatio.get();
  const displayWidth = Math.max(200, screenWidth - 40);
  const fetchWidth = useMemo(
    () => Math.round(displayWidth * dpr),
    [displayWidth, dpr],
  );

  const imageUri = useMemo(
    () => (artwork ? getImageFileView(artwork.url, fetchWidth) : ""),
    [artwork, fetchWidth],
  );

  const [imageDimensions, setImageDimensions] = useState({
    width: 350,
    height: 250,
  });
  useEffect(() => {
    if (!imageUri) return;
    Image.getSize(imageUri, (w, h) => {
      const maxWidth = screenWidth - 40; // padding
      const maxHeight = isTabletLandscape ? 500 : 400;
      const next = resizeImageDimensions(
        { width: w, height: h },
        maxWidth,
        maxHeight,
      );
      setImageDimensions(next);
    });
  }, [imageUri, isTabletLandscape, screenWidth]);

  const handleRequestPriceQuote = useCallback(async () => {
    if (!artwork) return;
    setLoadingPriceQuote(true);

    const us = await utils_getAsyncData("userSession");
    if (!us.value) {
      setLoadingPriceQuote(false);
      return;
    }
    const { email, name, id } = JSON.parse(us.value);

    const artwork_data = {
      title: artwork.title,
      artist: artwork.artist,
      art_id: artwork.art_id,
      url: artwork.url,
      medium: artwork.medium,
      pricing: { ...artwork.pricing, currency: "USD" },
    };

    const results = await requestArtworkPrice(artwork_data, email, name);
    if (results.isOk) {
      Analytics.track("artwork_price_requested", {
        ids: {
          art_id: artwork.art_id,
          user_id: id,
        },
        title: artwork.title,
        artist: artwork.artist,
        user_type: userType,
        payload: artwork_data,
        response: results,
      });

      updateModal({
        message: `Price quote for ${artwork_data.title} has been sent to ${email}`,
        showModal: true,
        modalType: "success",
      });
    } else {
      Analytics.track("artwork_price_request_failed", {
        ids: {
          art_id: artwork.art_id,
          user_id: id,
        },
        title: artwork.title,
        artist: artwork.artist,
        error_message: results.message,
        payload: artwork_data,
        response: results,
      });

      updateModal({
        message:
          "Something went wrong, please try again or contact us for assistance.",
        showModal: true,
        modalType: "error",
      });
    }
    setLoadingPriceQuote(false);
  }, [artwork, updateModal, userType]);

  const renderPrimaryButton = () => {
    if (!artwork) return null;

    if (["gallery", "artist"].includes(userType)) {
      return null;
    }

    if (!artwork.availability) {
      return <LongBlackButton value="Sold" isDisabled onClick={() => {}} />;
    }

    if (artwork.pricing?.shouldShowPrice === "Yes") {
      return (
        <LongBlackButton
          value="Purchase artwork"
          isDisabled={false}
          onClick={() =>
            navigation.navigate(screenName.purchaseArtwork, {
              art_id: artwork.art_id,
            })
          }
          testID="purchase-artwork-button"
        />
      );
    }

    return (
      <LongBlackButton
        value={loadingPriceQuote ? "Requesting ..." : "Request price"}
        isDisabled={false}
        onClick={handleRequestPriceQuote}
        isLoading={loadingPriceQuote}
        testID="request-price-button"
      />
    );
  };

  const loadingMain = isLoadingArtwork && !artwork;
  const showEmpty = !loadingMain && !artwork && !isArtworkError;

  return (
    <>
      <View style={tw`flex-1 bg-white`}>
        <BackHeaderTitle title="" />

        {loadingMain && <ArtworkSkeleton />}

        {artwork && (
          <ScrollWrapper
            style={tw`flex-1 bg-white`}
            showsVerticalScrollIndicator={false}
            onScroll={onScroll}
            contentContainerStyle={{
              paddingBottom: Math.max(insets.bottom, 20) + 40,
            }}
          >
            <View style={tw`pb-5`}>
              {isTabletLandscape ? (
                <View style={tw`flex-row px-[20px] gap-[30px]`}>
                  <ArtworkImageSection
                    imageUri={imageUri}
                    imageDimensions={imageDimensions}
                    setModalVisible={setModalVisible}
                    isTabletLandscape={isTabletLandscape}
                    screenWidth={screenWidth}
                  />
                  <ArtworkContentSection
                    artwork={artwork}
                    userType={userType}
                    isTabletLandscape={isTabletLandscape}
                    isTabletSize={isTabletSize}
                    primaryButton={renderPrimaryButton()}
                  />
                </View>
              ) : (
                <View style={tw`pb-5`}>
                  <ArtworkImageSection
                    imageUri={imageUri}
                    imageDimensions={imageDimensions}
                    setModalVisible={setModalVisible}
                    isTabletLandscape={isTabletLandscape}
                    screenWidth={screenWidth}
                  />
                  <View style={tw`px-5`}>
                    <ArtworkContentSection
                      artwork={artwork}
                      userType={userType}
                      isTabletLandscape={isTabletLandscape}
                      isTabletSize={isTabletSize}
                      primaryButton={renderPrimaryButton()}
                    />
                  </View>
                </View>
              )}
            </View>

            <View
              style={[
                tw`mb-[40px] gap-[15px] mx-[20px]`,
                ["gallery", "artist"].includes(userType) && tw`pb-[40px]`,
              ]}
            >
              <DetailsCard
                title="Provenance & Details"
                details={[
                  { name: "Materials", text: artwork.materials },
                  {
                    name: "Signature",
                    text: `Signed ${artwork.signature}`,
                  },
                  {
                    name: "Authenticity",
                    text:
                      artwork.certificate_of_authenticity === "Yes"
                        ? "Certificate Included"
                        : "Certificate Not included",
                  },
                  {
                    name: "Packaging",
                    text: formatPackaging(artwork.packaging_type),
                  },
                  {
                    name: "Description",
                    text: artwork.artwork_description || "N/A",
                  },
                ]}
              />
              <ArtistInformationCard
                artistName={artwork.artist}
                birthYear={artwork.artist_birthyear}
                country={artwork.artist_country_origin}
              />
            </View>

            {!["gallery", "artist"].includes(userType) && (
              <SimilarArtworks title={artwork.title} medium={artwork.medium} />
            )}

            {!["gallery", "artist"].includes(userType) &&
              similarArtworksByArtist.length > 0 && (
                <View style={tw`mt-5`}>
                  <Text
                    style={[
                      tw`text-sm font-medium mb-5 pl-5`,
                      { color: colors.black },
                    ]}
                  >
                    Other Works by {artwork.artist}
                  </Text>

                  <FlatList
                    data={similarArtworksByArtist}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(_, i) => String(i)}
                    style={{ marginBottom: 20 }}
                    contentContainerStyle={{
                      paddingLeft: 20,
                      paddingRight: 20,
                      gap: 15,
                    }}
                    renderItem={({ item }) => (
                      <ArtworkCard
                        art_id={item.art_id}
                        title={item.title}
                        url={item.url}
                        artist={item.artist}
                        showPrice={item.pricing.shouldShowPrice === "Yes"}
                        price={item.pricing.usd_price}
                        availiablity={item.availability}
                      />
                    )}
                  />
                </View>
              )}
          </ScrollWrapper>
        )}

        {showEmpty && (
          <View style={tw`flex-1 items-center justify-center`}>
            <Text style={tw`text-[16px] text-[#1A1A1A]`}>
              No details of artwork
            </Text>
          </View>
        )}
      </View>
      <ZoomArtwork
        url={url}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </>
  );
}
