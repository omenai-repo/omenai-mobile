import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { FlashList } from "@shopify/flash-list";
import tw from "twrnc";
import ArtworkCard from "#components/artwork/ArtworkCard";
import ArtworksImmersiveModal from "#components/artworks/ArtworksImmersiveModal";
import Loader from "#components/general/Loader";
import CustomSelectPicker from "#components/inputs/CustomSelectPicker";
import { screenName } from "#constants/screenNames.constants";
import { fetchGalleryWorksPage } from "#services/partners/galleryPartnerApi";
import { EVENTS_QK } from "#utils/queryKeys";
import { utils_formatPrice } from "#utils/utils_priceFormatter";

/** Web `GalleryWorksWrapper` medium options (values must match DB / API). */
const MEDIUM_OPTIONS: { label: string; value: string }[] = [
  { label: "Medium", value: "All" },
  { label: "Photography", value: "Photography" },
  { label: "Works on paper", value: "Works on paper" },
  { label: "Acrylic on canvas/linen/panel", value: "Acrylic on canvas/linen/panel" },
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

export type GalleryWorkRow = {
  art_id: string;
  title: string;
  url: string;
  artist: string;
  image_format?: { ratio: string; orientation?: string };
  availability?: boolean;
  impressions?: number;
  like_IDs?: string[];
  pricing?: { amount?: number; currency?: string; price?: number; usd_price?: number } | number;
  price?: number;
  medium?: string;
  year?: string | number;
};

export function priceFromGalleryWork(art: GalleryWorkRow): number {
  if (typeof art.price === "number" && art.price > 0) return art.price;
  const p = art.pricing;
  if (p == null) return 0;
  if (typeof p === "number") return p;
  if (typeof p === "object") {
    const n = Number((p as { usd_price?: number; price?: number; amount?: number }).usd_price);
    if (Number.isFinite(n) && n > 0) return n;
    const m = Number((p as { price?: number; amount?: number }).price ?? (p as { amount?: number }).amount);
    return Number.isFinite(m) && m > 0 ? m : 0;
  }
  return 0;
}

const H_PAD = 20;
const COL_GAP = 16;

export type GalleryArtistFilterOption = {
  id: string;
  name: string;
};

type WorksProps = {
  galleryId: string;
  isActive: boolean;
  artistOptions?: GalleryArtistFilterOption[];
  selectedArtistId?: string;
};

export default function GalleryWorksTabContent({
  galleryId,
  isActive,
  artistOptions = [],
  selectedArtistId,
}: WorksProps) {
  const navigation = useNavigation<any>();
  const { width: screenW } = useWindowDimensions();
  const cardW = useMemo(() => (screenW - H_PAD * 2 - COL_GAP) / 2, [screenW]);

  const [artistFilter, setArtistFilter] = useState("All");
  const [mediumFilter, setMediumFilter] = useState("All");
  const [priceFilter, setPriceFilter] = useState("All");
  const [immersiveOpen, setImmersiveOpen] = useState(false);

  const filters = useMemo(
    () => ({ artist: artistFilter, medium: mediumFilter, price: priceFilter }),
    [artistFilter, mediumFilter, priceFilter],
  );

  useEffect(() => {
    if (!selectedArtistId) return;
    setArtistFilter(selectedArtistId);
  }, [selectedArtistId]);

  const artistFilterOptions = useMemo(
    () => [
      { label: "All", value: "All" },
      ...artistOptions.map((artist) => ({
        label: artist.name,
        value: artist.id,
      })),
    ],
    [artistOptions],
  );

  const selectedArtistName = useMemo(
    () => artistOptions.find((artist) => artist.id === artistFilter)?.name ?? "",
    [artistOptions, artistFilter],
  );

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: EVENTS_QK.galleryWorks(galleryId, filters),
    queryFn: async ({ pageParam = 1 }) =>
      fetchGalleryWorksPage(galleryId, pageParam as number, {
        artist: artistFilter,
        medium: mediumFilter,
        price: priceFilter,
      }),
    initialPageParam: 1,
    getNextPageParam: (last) => {
      const p = last?.pagination;
      if (p && p.page < p.totalPages) return p.page + 1;
      return undefined;
    },
    enabled: isActive && Boolean(galleryId),
    staleTime: 5 * 60_000,
  });

  const items = useMemo(
    () => (data?.pages ?? []).flatMap((p) => (Array.isArray(p.data) ? (p.data as GalleryWorkRow[]) : [])),
    [data],
  );

  const renderArtwork = useCallback(
    (art: GalleryWorkRow) => {
      const price = priceFromGalleryWork(art);
      return (
        <View style={[tw`mb-4`, { width: cardW }]}>
          <ArtworkCard
            title={art.title}
            url={art.url}
            artist={art.artist}
            art_id={art.art_id}
            price={price}
            showPrice={price > 0}
            availiablity={art.availability}
            impressions={art.impressions ?? 0}
            like_IDs={art.like_IDs ?? []}
            width={cardW}
            galleryView
            disableLikeButton
            image_format={art.image_format}
            hideBackground
            useImageLoadAspectRatio
            useFixedImageFrame={false}
          />
        </View>
      );
    },
    [cardW],
  );

  if (!isActive) return null;

  if (isLoading) {
    return (
      <View style={tw`flex-1 items-center justify-center py-20`}>
        <Loader size={90} height={110} />
        {/* <Text style={tw`mt-3 text-xs uppercase tracking-widest text-neutral-400`}>Loading works...</Text> */}
      </View>
    );
  }

  if (isError) {
    return (
      <View style={tw`py-20 px-4`}>
        <Text style={tw`text-center text-xs uppercase text-neutral-400`}>Failed to load artworks.</Text>
      </View>
    );
  }

  const filterStrip = (
    <View style={tw`px-5 pt-3 pb-4 border-b border-neutral-100`}>
      <View style={tw`flex-row flex-wrap gap-2`}>
        <View style={[tw`flex-1`, { minWidth: 148, zIndex: 500 }]}>
          <CustomSelectPicker
            label=""
            placeholder="Artist"
            value={artistFilter}
            data={artistFilterOptions}
            handleSetValue={(e) => setArtistFilter(e.value)}
            zIndex={500}
            dropdownPosition="bottom"
          />
        </View>
        <View style={[tw`flex-1`, { minWidth: 148, zIndex: 400 }]}>
          <CustomSelectPicker
            label=""
            placeholder="Medium"
            value={mediumFilter}
            data={MEDIUM_OPTIONS}
            handleSetValue={(e) => setMediumFilter(e.value)}
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
            handleSetValue={(e) => setPriceFilter(e.value)}
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
          <MaterialCommunityIcons name="view-grid" size={16} color={tw.color("neutral-700")} />
          <Text style={tw`text-xs uppercase tracking-widest font-sans-medium text-neutral-700`}>
            Immersive view
          </Text>
        </Pressable>
      )}
    </View>
  );

  if (items.length === 0) {
    return (
      <View style={tw`flex-1`}>
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
    <View style={tw`flex-1`}>
      {filterStrip}
      <FlashList
        data={items}
        numColumns={2}
        masonry
        keyExtractor={(item) => item.art_id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`px-5 pb-8 pt-2`}
        onEndReached={() => {
          if (!hasNextPage || isFetchingNextPage) return;
          void fetchNextPage();
        }}
        onEndReachedThreshold={0.45}
        ListHeaderComponent={
          <Text style={tw`text-[11px] text-neutral-500 mb-3`}>
            {artistFilter !== "All" && selectedArtistName
              ? `Works by ${selectedArtistName} (${items.length})`
              : `${items.length} work${items.length === 1 ? "" : "s"}`}
          </Text>
        }
        ListFooterComponent={isFetchingNextPage ? <Loader size={56} height={90} /> : null}
        renderItem={({ item }) => renderArtwork(item)}
      />
      <ArtworksImmersiveModal
        visible={immersiveOpen}
        onClose={() => setImmersiveOpen(false)}
        items={items}
        getHeaderText={(currentIndex, total) => `Works — ${currentIndex + 1} / ${total}`}
        onItemPress={(item) => {
          setImmersiveOpen(false);
          navigation.push(screenName.artwork, { art_id: item.art_id, url: item.url });
        }}
        renderMetaFooter={(art) => {
          const price = priceFromGalleryWork(art);
          return (
            <Text style={tw`text-xs uppercase tracking-widest text-neutral-600 mt-1 font-sans-regular`}>
              {art.availability === false ? "Sold" : price > 0 ? utils_formatPrice(price) : "Price on request"}
            </Text>
          );
        }}
      />
    </View>
  );
}
