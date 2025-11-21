import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { colors } from "config/colors.config";
import LongBlackButton from "components/buttons/LongBlackButton";
import DetailsCard from "./components/detailsCard/DetailsCard";
import ArtworkCard from "components/artwork/ArtworkCard";
import { fetchsingleArtwork } from "services/artworks/fetchSingleArtwork";
import { getImageFileView } from "lib/storage/getImageFileView";
import { SimpleLineIcons } from "@expo/vector-icons";
import SimilarArtworks from "./components/similarArtworks/SimilarArtworks";
import { utils_formatPrice } from "utils/utils_priceFormatter";
import { screenName } from "constants/screenNames.constants";
import WithModal from "components/modal/WithModal";
import { requestArtworkPrice } from "services/artworks/requestArtworkPrice";
import { utils_getAsyncData } from "utils/utils_asyncStorage";
import { useModalStore } from "store/modal/modalStore";
import SaveArtworkButton from "./components/SaveArtworkButton";
import Loader from "components/general/Loader";
import { useAppStore } from "store/app/appStore";
import Header from "./components/Header";
import ShippingAndTaxes from "./components/extraDetails/ShippingAndTaxes";
import Coverage from "./components/extraDetails/Coverage";
import { createViewHistory } from "services/artworks/viewHistory/createViewHistory";
import { fetchArtworkByArtist } from "services/artworks/fetchArtworkByArtist";
import tw from "twrnc";
import ScrollWrapper from "components/general/ScrollWrapper";
import { SvgXml } from "react-native-svg";
import { licenseIcon } from "utils/SvgImages";
import BackScreenButton from "components/buttons/BackScreenButton";
import { resizeImageDimensions } from "utils/utils_resizeImageDimensions.utils";
import ZoomArtwork from "./ZoomArtwork";
import BlurStatusBar from "components/general/BlurStatusBar";
import { useScrollY } from "hooks/useScrollY";

type RouteParams = { art_id: string; url: string };

const useTabletLandscape = () => {
  const [win, setWin] = useState(Dimensions.get("window"));
  useEffect(() => {
    const sub = Dimensions.addEventListener("change", ({ window }) => setWin(window));
    return () => sub?.remove();
  }, []);
  const isTabletLandscape = win.width > win.height && Math.min(win.width, win.height) >= 768;
  return { isTabletLandscape, screenWidth: win.width, screenHeight: win.height };
};

export default function Artwork() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute();
  const { art_id, url } = route.params as RouteParams;

  const { updateModal } = useModalStore();
  const { userType, userSession } = useAppStore();
  const { isTabletLandscape, screenWidth } = useTabletLandscape();
  const isTabletSize = Math.min(screenWidth) >= 768;

  const [showMore, setShowMore] = useState(false);
  const [loadingPriceQuote, setLoadingPriceQuote] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { scrollY, onScroll } = useScrollY();

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
    // You already set staleTime globally in App.tsx; override here only if needed.
    // staleTime: 5 * 60 * 1000,
  });

  // 2) Fetch other works by the same artist (depends on artwork)
  const { data: similarArtworksByArtist = [], isLoading: isLoadingArtistWorks } = useQuery({
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
  }, [artwork, userSession?.id]);

  const imageWidth = Platform.OS === "ios" ? 380 : 300;
  const imageUri = useMemo(
    () => (artwork ? getImageFileView(artwork.url, imageWidth) : ""),
    [artwork, imageWidth]
  );

  const [imageDimensions, setImageDimensions] = useState({ width: 350, height: 250 });
  useEffect(() => {
    if (!imageUri) return;
    Image.getSize(imageUri, (w, h) => {
      const maxWidth = screenWidth - 40; // padding
      const maxHeight = isTabletLandscape ? 500 : 400;
      const next = resizeImageDimensions({ width: w, height: h }, maxWidth, maxHeight);
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
    const { email, name } = JSON.parse(us.value);

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
      updateModal({
        message: `Price quote for ${artwork_data.title} has been sent to ${email}`,
        showModal: true,
        modalType: "success",
      });
    } else {
      updateModal({
        message: "Something went wrong, please try again or contact us for assistance.",
        showModal: true,
        modalType: "error",
      });
    }
    setLoadingPriceQuote(false);
  }, [artwork, updateModal]);

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
            navigation.navigate(screenName.purchaseArtwork, { art_id: artwork.art_id })
          }
        />
      );
    }

    return (
      <LongBlackButton
        value={loadingPriceQuote ? "Requesting ..." : "Request price"}
        isDisabled={false}
        onClick={handleRequestPriceQuote}
        isLoading={loadingPriceQuote}
      />
    );
  };

  const renderImageSection = () =>
    artwork ? (
      <View style={isTabletLandscape ? styles.tabletImageContainer : styles.mobileImageContainer}>
        <Pressable onPress={() => setModalVisible(true)}>
          <Image
            source={{ uri: imageUri }}
            style={[
              {
                height: imageDimensions.height,
                width: imageDimensions.width,
                resizeMode: "contain",
                alignSelf: "center",
                borderRadius: 5,
                backgroundColor: "#f5f5f5",
              },
              isTabletLandscape && styles.tabletImage,
            ]}
          />
        </Pressable>
      </View>
    ) : null;

  const renderContentSection = () =>
    artwork ? (
      <View
        style={isTabletLandscape ? styles.tabletContentContainer : styles.mobileContentContainer}
      >
        <View style={styles.artworkDetails}>
          <Text style={styles.artworkTitle}>{artwork.title}</Text>
          <Text style={styles.artworkCreator}>{artwork.artist}</Text>
          <Text style={styles.artworkTags}>
            {artwork.medium} | {artwork.rarity}
          </Text>

          <Text style={styles.priceTitle}>Price</Text>
          <Text
            style={[
              styles.price,
              artwork.pricing.shouldShowPrice === "No" &&
                !["gallery", "artist"].includes(userType) && {
                  fontSize: 16,
                  color: colors.black,
                },
            ]}
          >
            {artwork.pricing.shouldShowPrice === "Yes" || ["gallery", "artist"].includes(userType)
              ? utils_formatPrice(Number(artwork.pricing.usd_price))
              : "Price on request"}
          </Text>

          <ScrollWrapper horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.tagsContainer}>
              {artwork.certificate_of_authenticity === "Yes" && (
                <View style={styles.tagItem}>
                  <SvgXml xml={licenseIcon} />
                  <Text style={styles.tagItemText}>Certificate of authencity availiable</Text>
                </View>
              )}
              <View style={[styles.tagItem, { backgroundColor: "#e5f4ff" }]}>
                <SimpleLineIcons name="frame" size={15} />
                <Text style={[styles.tagItemText, { color: "#30589f" }]}>
                  {artwork.framing === "Framed" ? "Frame Included" : "Artwork is not framed"}
                </Text>
              </View>
            </View>
          </ScrollWrapper>
        </View>

        <View
          style={[
            styles.buttonContainer,
            isTabletSize && { flexDirection: "row", alignItems: "center", gap: 30 },
          ]}
        >
          <View style={tw`flex-1`}>{renderPrimaryButton()}</View>

          <View style={tw`flex-1`}>
            {!["gallery", "artist"].includes(userType) && (
              <SaveArtworkButton
                likeIds={artwork.like_IDs || []}
                art_id={artwork.art_id || ""}
                impressions={artwork.impressions || 0}
              />
            )}
          </View>
        </View>

        <Pressable onPress={() => setShowMore(true)}>
          <Text style={tw`text-[#004617] text-[14px] text-center mt-[20px] underline`}>
            More details about this artwork
          </Text>
        </Pressable>

        <View style={tw`mt-[50px] gap-[25px]`}>
          <ShippingAndTaxes />
          <Coverage />
        </View>
      </View>
    ) : null;

  const loadingMain = isLoadingArtwork && !artwork;
  const showEmpty = !loadingMain && !artwork && !isArtworkError;

  return (
    <WithModal>
      {!showMore ? (
        <View style={{ flex: 1 }}>
          <BlurStatusBar scrollY={scrollY} intensity={80} tint="light" />
          <Header art_id={artwork?.art_id} isGallery={["gallery", "artist"].includes(userType)} />

          {loadingMain && <Loader />}

          {artwork && (
            <ScrollWrapper
              style={styles.scrollContainer}
              showsVerticalScrollIndicator={false}
              onScroll={onScroll}
            >
              <View style={{ paddingBottom: 20 }}>
                {isTabletLandscape ? (
                  <View style={styles.tabletLandscapeContainer}>
                    {renderImageSection()}
                    {renderContentSection()}
                  </View>
                ) : (
                  <View style={{ paddingHorizontal: 20 }}>
                    {renderImageSection()}
                    {renderContentSection()}
                  </View>
                )}
              </View>
            </ScrollWrapper>
          )}

          {showEmpty && (
            <View style={styles.loaderContainer}>
              <Text style={styles.loaderText}>No details of artwork</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={tw`flex-1`}>
          <BlurStatusBar scrollY={scrollY} intensity={80} tint="light" />
          <View style={tw`pt-[60px] android:pt-[40px] pl-[25px]`}>
            <BackScreenButton handleClick={() => setShowMore(false)} />
          </View>

          {artwork && (
            <ScrollWrapper
              showsVerticalScrollIndicator={false}
              style={tw`flex-1`}
              onScroll={onScroll}
            >
              <View>
                <View
                  style={[
                    styles.detailsContainer,
                    ["gallery", "artist"].includes(userType) && { paddingBottom: 70 },
                  ]}
                >
                  <DetailsCard
                    title="Additional details about this artwork"
                    details={[
                      { name: "Description", text: artwork.artwork_description || "N/A" },
                      { name: "Materials", text: artwork.materials },
                      {
                        name: "Certificate of authenticity",
                        text:
                          artwork.certificate_of_authenticity === "Yes"
                            ? "Included"
                            : "Not included",
                      },
                      { name: "Artwork packaging", text: artwork.framing },
                      { name: "Signature", text: `Signed ${artwork.signature}` },
                      { name: "Year", text: artwork.year },
                      { name: "Height", text: artwork.dimensions.height },
                      { name: "Width", text: artwork.dimensions.width },
                      ...(artwork.dimensions.depth
                        ? [{ name: "Depth", text: artwork.dimensions.depth }]
                        : []),
                      { name: "Weight", text: artwork.dimensions.weight },
                      { name: "Rarity", text: artwork.rarity },
                    ]}
                  />
                  <DetailsCard
                    title="Artist Information"
                    details={[
                      { name: "Artist name", text: artwork.artist },
                      { name: "Birth Year", text: artwork.artist_birthyear },
                      { name: "Country", text: artwork.artist_country_origin },
                    ]}
                  />
                </View>

                {!["gallery", "artist"].includes(userType) &&
                  similarArtworksByArtist.length > 0 && (
                    <>
                      <Text style={tw`text-[20px] font-medium text-[#1A1A1A] mb-[20px] pl-[20px]`}>
                        Other Works by {artwork.artist}
                      </Text>

                      <FlatList
                        data={similarArtworksByArtist}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(_, i) => String(i)}
                        style={{ marginBottom: 25 }}
                        contentContainerStyle={{ paddingRight: 20 }}
                        renderItem={({ item }: { item: ArtworkFlatlistItem }) => (
                          <ArtworkCard
                            title={item.title}
                            url={item.url}
                            artist={item.artist}
                            showPrice={item.pricing.shouldShowPrice === "Yes"}
                            price={item.pricing.usd_price}
                          />
                        )}
                      />
                    </>
                  )}

                {!["gallery", "artist"].includes(userType) && (
                  <SimilarArtworks title={artwork.title} medium={artwork.medium} />
                )}
              </View>
            </ScrollWrapper>
          )}
        </View>
      )}
      <ZoomArtwork url={url} modalVisible={modalVisible} setModalVisible={setModalVisible} />
    </WithModal>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: colors.white,
    marginTop: 25,
  },
  // Tablet Landscape Styles
  tabletLandscapeContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 30,
  },
  tabletImageContainer: {
    flex: 0.5,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  tabletContentContainer: {
    flex: 0.5,
    paddingLeft: 20,
  },
  tabletImage: {
    maxWidth: "100%",
    maxHeight: 500,
  },
  // Mobile/Portrait Styles
  mobileImageContainer: {
    alignItems: "center",
  },
  mobileContentContainer: {
    // Default mobile styles
  },
  artworkDetails: {
    marginTop: 25,
    marginBottom: 25,
  },
  artworkTitle: {
    color: colors.primary_black,
    fontSize: 24,
    fontWeight: "700",
  },
  artworkCreator: {
    fontSize: 16,
    color: "#616161",
    marginTop: 10,
  },
  artworkTags: {
    color: "#616161",
    fontSize: 14,
    marginTop: 10,
  },
  tagsContainer: {
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  tagItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#E7F6EC",
  },
  tagItemText: {
    color: colors.secondary_text_color,
    fontSize: 12,
  },
  priceTitle: {
    color: "#616161",
    fontSize: 14,
    marginTop: 20,
  },
  price: {
    fontSize: 19,
    fontWeight: "700",
    color: "#1A1A1A",
    marginTop: 10,
  },
  buttonContainer: {
    gap: 20,
  },
  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loaderText: {
    fontSize: 16,
    color: colors.black,
  },
  detailsContainer: {
    marginBottom: 30,
    gap: 30,
    marginTop: 30,
    marginHorizontal: 20,
  },
});
