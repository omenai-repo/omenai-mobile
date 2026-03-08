import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { Image, Text, View, Dimensions } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import LongBlackButton from "#components/buttons/LongBlackButton";
import DetailsCard from "./components/detailsCard/DetailsCard";
import ArtistInformationCard from "./components/detailsCard/ArtistInformationCard";
import ArtworkImageSection from "./components/ArtworkImageSection";
import ArtworkContentSection from "./components/ArtworkContentSection";
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
import { useGuestLoginModalStore } from "#store/guest/guestLoginModalStore";
import { createViewHistory } from "#services/artworks/viewHistory/createViewHistory";
import SimilarArtworksByArtist from "./components/similarArtworks/SimilarArtworksByArtist";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import ScrollWrapper from "#components/general/ScrollWrapper";
import { resizeImageDimensions } from "#utils/utils_resizeImageDimensions.utils";
import ZoomArtwork from "./ZoomArtwork";
import { useScrollY } from "#hooks/useScrollY";
import { Analytics } from "#utils/analytics";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type RouteParams = { art_id: string; url: string };

const useTabletLandscape = () => {
  const [win, setWin] = useState(Dimensions.get("window"));
  useEffect(() => {
    const sub = Dimensions.addEventListener("change", ({ window }) =>
      setWin(window)
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
  const { userType, userSession, isLoggedIn } = useAppStore();
  const { openGuestLoginModal } = useGuestLoginModalStore();
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
      artwork.url
    ).catch(() => {
      // silent fail
    });
  }, [artwork, userSession?.id, userType]);

  const displayWidth = Math.max(200, screenWidth - 40);

  const imageUri = useMemo(
    () => (artwork ? getImageFileView(artwork.url, 500) : ""),
    [artwork]
  );

  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const handleImageLoad = useCallback(
    (w: number, h: number) => {
      const maxWidth = screenWidth - 40;
      const maxHeight = isTabletLandscape ? 500 : 400;
      const next = resizeImageDimensions(
        { width: w, height: h },
        maxWidth,
        maxHeight
      );
      setImageDimensions(next);
    },
    [screenWidth, isTabletLandscape]
  );

  const handleRequestPriceQuote = useCallback(async () => {
    if (!artwork) return;
    setLoadingPriceQuote(true);

    const us = await utils_getAsyncData("userSession");
    if (!us.value) {
      setLoadingPriceQuote(false);
      openGuestLoginModal({
        screen: screenName.artwork,
        params: { art_id: artwork.art_id, url: artwork.url },
      });
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

    // Guest users: show the button but open the login modal on press
    if (!isLoggedIn) {
      if (!artwork.availability) {
        return <LongBlackButton value="Sold" isDisabled onClick={() => {}} />;
      }
      const guestLabel =
        artwork.pricing?.shouldShowPrice === "Yes"
          ? "Purchase artwork"
          : "Request price";
      return (
        <LongBlackButton
          textStyle={tw`uppercase text-center text-sm tracking-widest`}
          value={guestLabel}
          isDisabled={false}
          onClick={() => ({
            screen: screenName.artwork,
            params: { art_id: artwork.art_id, url: artwork.url },
          })}
        />
      );
    }

    if (!artwork.availability) {
      return <LongBlackButton value="Sold" isDisabled onClick={() => {}} />;
    }

    if (artwork.pricing?.shouldShowPrice === "Yes") {
      return (
        <LongBlackButton
          textStyle={tw`uppercase text-center text-sm tracking-widest`}
          value="Purchase artwork"
          isDisabled={false}
          onClick={() => {
            navigation.navigate(screenName.purchaseArtwork, {
              art_id: artwork.art_id,
            });
          }}
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
            <View style={tw`pb-8`}>
              {isTabletLandscape ? (
                <View style={tw`flex-row px-4 gap-8`}>
                  <ArtworkImageSection
                    imageUri={imageUri}
                    imageDimensions={imageDimensions}
                    setModalVisible={setModalVisible}
                    isTabletLandscape={isTabletLandscape}
                    screenWidth={screenWidth}
                    onImageLoad={handleImageLoad}
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
                <View>
                  <ArtworkImageSection
                    imageUri={imageUri}
                    imageDimensions={imageDimensions}
                    setModalVisible={setModalVisible}
                    isTabletLandscape={isTabletLandscape}
                    screenWidth={screenWidth}
                    onImageLoad={handleImageLoad}
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
                tw`mb-8 gap-10 px-5`,
                ["gallery", "artist"].includes(userType) && tw`pb-10`,
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
                    text: formatPackaging(artwork.carrier),
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
              <SimilarArtworks
                title={artwork.title}
                medium={artwork.medium}
                hideAction={!userSession}
              />
            )}

            {!["gallery", "artist"].includes(userType) && artwork && (
              <SimilarArtworksByArtist
                artist={artwork.artist}
                currentArtworkTitle={artwork.title}
              />
            )}
          </ScrollWrapper>
        )}

        {(isArtworkError || (!loadingMain && !artwork)) && (
          <View style={tw`flex-1 items-center justify-center px-8`}>
            <View
              style={tw`w-20 h-20 rounded-full bg-neutral-100 items-center justify-center mb-5`}
            >
              <Ionicons name="image-outline" size={36} color="#a3a3a3" />
            </View>
            <Text style={tw`text-lg font-semibold text-neutral-800 mb-2`}>
              Artwork not found
            </Text>
            <Text
              style={tw`text-sm text-neutral-500 text-center leading-relaxed`}
            >
              This artwork may have been removed or is no longer available.
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
