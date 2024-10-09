import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation, useRoute } from "@react-navigation/native";
import { colors } from "config/colors.config";
import LongBlackButton from "components/buttons/LongBlackButton";
import DetailsCard from "./components/detailsCard/DetailsCard";
import ArtworkCard from "components/artwork/ArtworkCard";
import { fetchsingleArtwork } from "services/artworks/fetchSingleArtwork";
import { getImageFileView } from "lib/storage/getImageFileView";
import { Feather, Ionicons, SimpleLineIcons } from "@expo/vector-icons";
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
import DeleteArtworkButton from "./components/DeleteArtworkButton";
import Header from "./components/Header";
import ShippingAndTaxes from "./components/extraDetails/ShippingAndTaxes";
import Coverage from "./components/extraDetails/Coverage";
import { createViewHistory } from "services/artworks/viewHistory/createViewHistory";
import { fetchArtworkByArtist } from "services/artworks/fetchArtworkByArtist";
import tw from "twrnc";
import ScrollWrapper from "components/general/ScrollWrapper";

export default function Artwork() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute();

  const { updateModal } = useModalStore();
  const { userType, userSession } = useAppStore();

  const [isLoading, setIsLoading] = useState(false);
  const [loadingPriceQuote, setLoadingPriceQuote] = useState(false);
  const [data, setData] = useState<ArtworkDataType | null>(null);
  const [similarArtworksByArtist, setSimilarArtworksByArtist] =
    useState<ArtworkDataType | null>(null);

  let image_href;
  if (data) {
    image_href = getImageFileView(data.url, 300);
  }

  useEffect(() => {
    handleFecthSingleArtwork();
  }, []);

  useEffect(() => {
    if (data?.artist) {
      handleArtistArtwork();
    }
  }, [data?.artist]);

  const handleFecthSingleArtwork = async () => {
    setIsLoading(true);

    const { title } = route.params as RouteParamsType;

    const results = await fetchsingleArtwork(title);

    if (results.isOk) {
      const data = results.body.data;
      setData(data);

      //add this to recently viewed artworks
      createViewHistory(
        title,
        data.artist,
        data.art_id,
        userSession.id,
        data.url
      );
    } else {
      setData(null);
    }

    setIsLoading(false);
  };

  const handleArtistArtwork = async () => {
    setIsLoading(true);

    const results = await fetchArtworkByArtist(data?.artist);

    if (results.isOk) {
      const data = results.body.data;
      setSimilarArtworksByArtist(data);
    } else {
      setData(null);
    }
    setIsLoading(false);
  };

  const handleRequestPriceQuote = async () => {
    setLoadingPriceQuote(true);

    let userEmail = "";
    let userName = "";

    const userSession = await utils_getAsyncData("userSession");
    if (userSession.value) {
      userEmail = JSON.parse(userSession.value).email;
      userName = JSON.parse(userSession.value).name;
    } else return;

    const artwork_data = {
      title: data!.title,
      artist: data!.artist,
      art_id: data!.art_id,
      url: data!.url,
      medium: data!.medium,
      pricing: data!.pricing,
    };

    const results = await requestArtworkPrice(
      artwork_data,
      userEmail,
      userName
    );
    if (results.isOk) {
      updateModal({
        message: `Price quote for ${artwork_data.title} has been sent to ${userEmail}`,
        showModal: true,
        modalType: "success",
      });
    } else {
      updateModal({
        message:
          "Something went wrong, please try again or contact us for assistance.",
        showModal: true,
        modalType: "error",
      });
    }

    setLoadingPriceQuote(false);
  };

  return (
    <WithModal>
      <View style={{ flex: 1 }}>
        <Header art_id={data?.art_id} isGallery={userType === "gallery"} />
        {isLoading && !data && <Loader />}
        {data && (
          <ScrollWrapper
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ paddingBottom: 20 }}>
              <View style={{ paddingHorizontal: 20 }}>
                <Image source={{ uri: image_href }} style={styles.image} />
                {userType !== "gallery" && (
                  <SaveArtworkButton
                    likeIds={data.like_IDs || []}
                    art_id={data.art_id}
                    impressions={data.impressions || 0}
                  />
                )}
                <View style={styles.artworkDetails}>
                  <Text style={styles.artworkTitle}>{data?.title}</Text>
                  <Text style={styles.artworkCreator}>{data?.artist}</Text>
                  <Text style={styles.artworkTags}>
                    {data?.medium} | {data?.rarity}
                  </Text>
                  <ScrollWrapper
                    horizontal
                    showsHorizontalScrollIndicator={false}
                  >
                    <View style={styles.tagsContainer}>
                      {data?.certificate_of_authenticity === "Yes" && (
                        <View style={styles.tagItem}>
                          <Ionicons name="ribbon-outline" size={15} />
                          <Text style={styles.tagItemText}>
                            Certificate of authencity availiable
                          </Text>
                        </View>
                      )}
                      <View
                        style={[styles.tagItem, { backgroundColor: "#e5f4ff" }]}
                      >
                        <SimpleLineIcons name="frame" size={15} />
                        <Text
                          style={[styles.tagItemText, { color: "#30589f" }]}
                        >
                          {data?.framing === "Framed"
                            ? "Frame Included"
                            : "Artwork is not framed"}
                        </Text>
                      </View>
                    </View>
                  </ScrollWrapper>
                </View>
                <View style={styles.detailsContainer}>
                  <DetailsCard
                    title="Additional details about this artwork"
                    details={[
                      {
                        name: "Description",
                        text: data?.artwork_description || "N/A",
                      },
                      { name: "Materials", text: data.materials },
                      {
                        name: "Certificate of authenticity",
                        text:
                          data?.certificate_of_authenticity === "Yes"
                            ? "Included"
                            : "Not included",
                      },
                      { name: "Artwork packaging", text: data?.framing },
                      { name: "Signature", text: `Signed ${data?.signature}` },
                      { name: "Year", text: data?.year },
                    ]}
                  />
                  <DetailsCard
                    title="Artist Information"
                    details={[
                      { name: "Artist name", text: data?.artist },
                      { name: "Birth Year", text: data?.artist_birthyear },
                      { name: "Country", text: data?.artist_country_origin },
                    ]}
                  />
                  <ShippingAndTaxes />
                  <Coverage />
                </View>
              </View>

              {userType !== "gallery" && (
                <>
                  <Text
                    style={tw.style(
                      `text-[20px] font-medium text-[#000] mb-[20px] pl-[20px]`
                    )}
                  >
                    Other Works by {data?.artist}
                  </Text>

                  <FlatList
                    data={similarArtworksByArtist}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(_, index) => JSON.stringify(index)}
                    style={{
                      marginBottom: 25,
                    }}
                    renderItem={({
                      item,
                      index,
                    }: {
                      item: ArtworkFlatlistItem;
                      index: number;
                    }) => (
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

              {userType !== "gallery" && (
                <SimilarArtworks title={data.title} medium={data?.medium} />
              )}
            </View>
          </ScrollWrapper>
        )}
        {!isLoading && !data && (
          <View style={styles.loaderContainer}>
            <Text style={styles.loaderText}>No details of artwork</Text>
          </View>
        )}
      </View>
      {isLoading ? null : (
        <View
          style={{
            paddingHorizontal: 10,
            paddingBottom: 30,
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
          }}
        >
          <View
            style={{
              backgroundColor: colors.white,
              paddingHorizontal: 15,
              paddingBottom: 15,
              borderWidth: 1,
              borderColor: colors.grey50,
              borderRadius: 15,
            }}
          >
            <View style={styles.priceContainer}>
              <Text style={styles.priceTitle}>Price</Text>
              <Text
                style={[
                  styles.price,
                  data?.pricing.shouldShowPrice === "No" &&
                    userType !== "gallery" && {
                      fontSize: 16,
                      color: colors.grey,
                    },
                ]}
              >
                {data?.pricing.shouldShowPrice === "Yes" ||
                userType === "gallery"
                  ? utils_formatPrice(Number(data?.pricing.usd_price))
                  : "Price on request"}
              </Text>
            </View>
            {
              userType !== "gallery" &&
                (data?.availability ? (
                  <View style={styles.buttonContainer}>
                    {data?.pricing.shouldShowPrice === "Yes" ? (
                      <LongBlackButton
                        radius={10}
                        value="Purchase artwork"
                        isDisabled={false}
                        onClick={() =>
                          navigation.navigate(screenName.purchaseArtwork, {
                            title: data?.title,
                          })
                        }
                      />
                    ) : (
                      <LongBlackButton
                        radius={10}
                        value={
                          loadingPriceQuote ? "Requesting ..." : "Request price"
                        }
                        isDisabled={false}
                        onClick={handleRequestPriceQuote}
                        isLoading={loadingPriceQuote}
                      />
                    )}
                  </View>
                ) : (
                  <LongBlackButton
                    value="Sold"
                    isDisabled={true}
                    onClick={() => {}}
                  />
                ))
              // :
              // <LongWhiteButton value='Edit pricing' onClick={()=>{
              //     const edit_pricing = {
              //         art_id: data?.art_id,
              //         price: data?.pricing.price,
              //         usd_price: data?.pricing.usd_price,
              //         shouldShowPrice: data?.pricing.shouldShowPrice
              //     };

              //     navigation.navigate(screenName.gallery.editArtwork, {data: edit_pricing})
              // }} />
            }
          </View>
        </View>
      )}
    </WithModal>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    // paddingHorizontal: 20,
    backgroundColor: colors.white,
    marginTop: 10,
  },
  image: {
    height: 340,
    width: "100%",
    objectFit: "contain",
  },
  artworkDetails: {
    marginTop: 20,
  },
  artworkTitle: {
    color: colors.primary_black,
    fontSize: 20,
    fontWeight: "500",
  },
  artworkCreator: {
    fontSize: 16,
    color: colors.secondary_text_color,
    marginTop: 10,
  },
  artworkTags: {
    color: colors.secondary_text_color,
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
  priceContainer: {
    paddingVertical: 20,
  },
  priceTitle: {
    color: colors.secondary_text_color,
    fontSize: 14,
  },
  price: {
    fontSize: 22,
    fontWeight: "500",
    color: colors.primary_black,
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
  },
});
