import React, { useCallback, useMemo, useState } from "react";
import { Pressable, Text, useWindowDimensions, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { UseInfiniteQueryResult } from "@tanstack/react-query";
import { FlashList } from "@shopify/flash-list";
import tw from "twrnc";
import ArtworkCard from "#components/artwork/ArtworkCard";
import ArtworksImmersiveModal from "#components/artwork/ArtworksImmersiveModal";
import Loader from "#components/general/Loader";
import CustomSelectPicker from "#components/inputs/CustomSelectPicker";
import { screenName } from "#constants/screenNames.constants";
import type { ArtistWorkRow } from "#services/marketplace/partners/artistPartnerApi";
import { utils_formatPrice } from "#utils/commerce/utils_priceFormatter";
import { priceFromGalleryWork } from "#screens/marketplace/discovery/galleries/galleryDetails/GalleryWorksTabContent";
const MEDIUM_OPTIONS: { label: string; value: string }[] = [
  { label: "Medium", value: "All" },
  { label: "Photography", value: "Photography" },
  { label: "Works on paper", value: "Works on paper" },
  {
    label: "Acrylic on canvas/linen/panel",
    value: "Acrylic on canvas/linen/panel",
  },
  { label: "Mixed media on canvas", value: "Mixed media on canvas" },
  { label: "Oil on canvas/panel", value: "Oil on canvas/panel" },
];

const PRICE_OPTIONS: { label: string; value: string }[] = [
  { label: "All prices", value: "All" },
  { label: "Under $1,000", value: "Under 1000" },
  { label: "$1,000 - $5,000", value: "1000-5000" },
  { label: "$5,000 - $10,000", value: "5000-10000" },
  { label: "Over $10,000", value: "Over 10000" },
];

const H_PAD = 20;
const COL_GAP = 16;

type ArtistWorksPage = Awaited<
  ReturnType<
    typeof import("#services/marketplace/partners/artistPartnerApi").fetchArtistWorksPage
  >
>;

type Props = {
  readonly worksQuery: UseInfiniteQueryResult<
    {
      readonly pages: readonly ArtistWorksPage[];
      readonly pageParams: readonly unknown[];
    },
    Error
  >;
  readonly mediumFilter: string;
  readonly priceFilter: string;
  readonly onMediumChange: (value: string) => void;
  readonly onPriceChange: (value: string) => void;
};

export default function ArtistWorksContent({
  worksQuery,
  mediumFilter,
  priceFilter,
  onMediumChange,
  onPriceChange,
}: Readonly<Props>) {
  const navigation = useNavigation<any>();
  const { width: screenW } = useWindowDimensions();
  const cardW = useMemo(() => (screenW - H_PAD * 2 - COL_GAP) / 2, [screenW]);
  const [immersiveOpen, setImmersiveOpen] = useState(false);

  const {
    data,
    isLoading,
    isError,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = worksQuery;

  const items = useMemo(
    () =>
      (data?.pages ?? []).flatMap((p) =>
        Array.isArray(p.data) ? (p.data as ArtistWorkRow[]) : [],
      ),
    [data],
  );

  const totalCount = data?.pages?.[0]?.total ?? items.length;
  const isInitialWorksLoad = isLoading && items.length === 0;
  const isFilteringWorks = isFetching && !isInitialWorksLoad && !isFetchingNextPage;

  const renderArtwork = useCallback(
    (art: ArtistWorkRow) => {
      const price = priceFromGalleryWork(art);
      return (
        <View style={[tw`mb-4`, { width: cardW }]}>
          <ArtworkCard
            artwork={{
              ...art,
              pricing: {
                ...((typeof art.pricing === "object"
                  ? art.pricing
                  : {}) as object),
                usd_price: price,
                shouldShowPrice: price > 0 ? "Yes" : "No",
              },
            }}
            width={cardW}
            galleryView
            disableLikeButton
            hideBackground
            useImageLoadAspectRatio
            useFixedImageFrame={false}
          />
        </View>
      );
    },
    [cardW],
  );

  const filterStrip = (
    <View style={tw`px-5 pt-3 pb-4 border-b border-neutral-100 bg-white`}>
      <View style={tw`flex-row flex-wrap gap-2`}>
        <View style={[tw`flex-1`, { minWidth: 148, zIndex: 400 }]}>
          <CustomSelectPicker
            label=""
            placeholder="Medium"
            value={mediumFilter}
            data={MEDIUM_OPTIONS}
            handleSetValue={(e) => onMediumChange(e.value)}
            zIndex={400}
            dropdownPosition="bottom"
          />
        </View>
        <View style={[tw`flex-1`, { minWidth: 148, zIndex: 300 }]}>
          <CustomSelectPicker
            label=""
            placeholder="Price"
            value={priceFilter}
            data={PRICE_OPTIONS}
            handleSetValue={(e) => onPriceChange(e.value)}
            zIndex={300}
            dropdownPosition="bottom"
          />
        </View>
      </View>
      {items.length > 0 && (
        <Pressable
          onPress={() => setImmersiveOpen(true)}
          style={({ pressed }) => [
            tw`mt-4 self-start flex-row items-center gap-1.5 py-1`,
            pressed && tw`opacity-70`,
          ]}
        >
          <MaterialCommunityIcons
            name="view-grid"
            size={16}
            color={tw.color("neutral-700")}
          />
          <Text
            style={tw`text-xs uppercase tracking-widest font-sans-medium text-neutral-700`}
          >
            Immersive view
          </Text>
        </Pressable>
      )}
    </View>
  );

  if (isError && items.length === 0) {
    return (
      <View style={tw`flex-1 bg-white`}>
        {filterStrip}
        <View style={tw`py-20 px-4`}>
          <Text style={tw`text-center text-xs uppercase text-neutral-400`}>
            Failed to load artworks.
          </Text>
        </View>
      </View>
    );
  }

  if (isInitialWorksLoad) {
    return (
      <View style={tw`flex-1 bg-white`}>
        {filterStrip}
        <View style={tw`flex-1 items-center justify-center py-20`}>
          <Loader size={90} height={110} />
        </View>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={tw`flex-1 bg-white`}>
        {filterStrip}
        <View style={tw`py-20 px-4`}>
          <Text style={tw`text-center text-xs uppercase text-neutral-400`}>
            No artworks found matching your criteria.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-white`}>
      {filterStrip}
      <FlashList
        data={items}
        numColumns={2}
        masonry
        keyExtractor={(item) => item.art_id}
        showsVerticalScrollIndicator={false}
        style={isFilteringWorks ? tw`opacity-50` : undefined}
        contentContainerStyle={tw`px-5 pb-8 pt-2`}
        onEndReached={() => {
          if (!hasNextPage || isFetchingNextPage) return;
          fetchNextPage();
        }}
        onEndReachedThreshold={0.45}
        ListHeaderComponent={
          <View style={isFilteringWorks ? tw`opacity-50` : undefined}>
            <Text
              style={tw`text-[11px] text-neutral-500 mb-3 uppercase tracking-widest`}
            >
              {totalCount} work{totalCount === 1 ? "" : "s"}
            </Text>
          </View>
        }
        ListFooterComponent={
          isFetchingNextPage ? <Loader size={56} height={90} /> : null
        }
        renderItem={({ item }) => renderArtwork(item)}
      />
      <ArtworksImmersiveModal
        visible={immersiveOpen}
        onClose={() => setImmersiveOpen(false)}
        items={items}
        getHeaderText={(currentIndex, total) =>
          `Works — ${currentIndex + 1} / ${total}`
        }
        onItemPress={(item) => {
          setImmersiveOpen(false);
          navigation.push(screenName.artwork, {
            art_id: item.art_id,
            url: item.url,
          });
        }}
        renderMetaFooter={(art) => {
          const price = priceFromGalleryWork(art);
          let priceText = "";
          if (art.availability === false) {
            priceText = "Sold";
          } else if (price > 0) {
            priceText = utils_formatPrice(price);
          } else {
            priceText = "Price on request";
          }
          return (
            <Text
              style={tw`text-xs uppercase tracking-widest text-neutral-600 mt-1 font-sans-regular`}
            >
              {priceText}
            </Text>
          );
        }}
      />
    </View>
  );
}
