import React from "react";
import { Image, Linking, Pressable, ScrollView, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import SectionHeader from "#components/general/SectionHeader";
import { screenName } from "#constants/screenNames.constants";
import { HOME_QK } from "#utils/queryKeys";
import { useAppStore } from "#store/app/appStore";
import { fetchCurationData } from "#services/curation/fetchCurationData";
import { getImageFileView } from "#lib/storage/getImageFileView";
import { getGalleryLogoFileView } from "#lib/storage/getGalleryLogoFileView";
import { getPromotionalFileView } from "#lib/storage/getPromotionalsFileView";
import { getEditorialImageFilePreview } from "#lib/editorial/lib/getEditorialImageFilePreview";

type FeaturedItem = {
  type?: string;
  data?: any;
  identifier?: string;
};

const SKELETON_ITEMS = ["featured-skeleton-1", "featured-skeleton-2", "featured-skeleton-3"];

const normalizeType = (value?: string) => String(value || "").toLowerCase().trim();

const toImageUri = (value?: string) => {
  if (!value) return "";
  return /^https?:\/\//i.test(value) ? value : getImageFileView(value, 900);
};

const parsePromotionPath = (rawUrl: string) => {
  try {
    const parsed = new URL(rawUrl, "https://omenai.local");
    return parsed.pathname || "";
  } catch {
    return "";
  }
};

export default function FeaturedFeed() {
  const navigation = useNavigation<any>();
  const { userSession } = useAppStore();

  const { data: featuredItems = [], isLoading } = useQuery({
    queryKey: HOME_QK.featuredFeed(userSession?.id),
    queryFn: async () => {
      const res = await fetchCurationData("featured_feed");
      if (!res?.isOk) return [];
      const rows = Array.isArray(res.data) ? res.data : [];
      return rows.filter((item: FeaturedItem) => item?.data);
    },
    staleTime: 5 * 60_000,
    gcTime: 15 * 60_000,
  });

  const resolveImage = (item: FeaturedItem) => {
    const itemType = normalizeType(item.type);
    const data = item.data ?? {};

    if (itemType === "gallery") {
      return data.logo ? getGalleryLogoFileView(data.logo, 900) : "";
    }
    if (itemType === "article") {
      return data.cover ? getEditorialImageFilePreview(data.cover, 900) : "";
    }
    if (itemType === "events") {
      return data.cover_image ? getPromotionalFileView(data.cover_image, 900) : "";
    }
    if (itemType === "promotionals") {
      return data.image ? getPromotionalFileView(data.image, 900) : "";
    }
    return toImageUri(data.url);
  };

  const resolveLabel = (item: FeaturedItem) => {
    const itemType = normalizeType(item.type);
    const eventType = normalizeType(item.data?.event_type);
    if (itemType === "events") {
      if (eventType === "exhibition") return "Exhibition";
      if (eventType === "art_fair") return "Art Fair";
      if (eventType === "viewing_room") return "Viewing Room";
    }
    if (itemType === "promotionals") return "Special Feature";
    if (itemType === "article") return "Editorial";
    if (itemType === "gallery") return "Gallery Partner";
    if (itemType === "artwork") return "Artwork";
    return "Featured";
  };

  const resolveTitle = (item: FeaturedItem) =>
    item.data?.title || item.data?.headline || item.data?.name || "Untitled";

  const resolveSubtitle = (item: FeaturedItem) => {
    const itemType = normalizeType(item.type);
    if (itemType === "artwork") return item.data?.artist || "";
    if (itemType === "events") return item.data?.gallery_name || item.data?.gallery?.name || "";
    return "";
  };

  const openPromotion = async (cta?: string) => {
    if (!cta) return;
    const path = parsePromotionPath(cta);
    const rawEventId = path.match(/^\/events\/([^/?#]+)/)?.[1];
    const rawShowId = path.match(/^\/shows\/([^/?#]+)/)?.[1];
    const rawArtworkId = path.match(/^\/artwork\/([^/?#]+)/)?.[1];

    if (rawShowId) {
      navigation.navigate(screenName.individual.showDetails, { eventId: rawShowId });
      return;
    }
    if (rawEventId) {
      navigation.navigate(screenName.individual.fairEventDetails, { eventId: rawEventId });
      return;
    }
    if (rawArtworkId) {
      navigation.navigate(screenName.artwork, { art_id: rawArtworkId });
      return;
    }

    if (/^https?:\/\//i.test(cta)) {
      await Linking.openURL(cta);
    }
  };

  const onPressItem = async (item: FeaturedItem) => {
    const itemType = normalizeType(item.type);
    const data = item.data ?? {};

    if (itemType === "artwork" && data.art_id) {
      navigation.navigate(screenName.artwork, {
        art_id: data.art_id,
        title: data.title,
        url: data.url,
      });
      return;
    }
    if (itemType === "gallery" && data.gallery_id) {
      navigation.navigate(screenName.individual.galleryDetails, {
        galleryId: data.gallery_id,
        name: data.name,
        logo: data.logo,
      });
      return;
    }
    if (itemType === "article") {
      navigation.navigate("ArticleScreen", { article: data });
      return;
    }
    if (itemType === "events" && data.event_id) {
      if (normalizeType(data.event_type) === "exhibition") {
        navigation.navigate(screenName.individual.showDetails, { eventId: data.event_id });
        return;
      }
      navigation.navigate(screenName.individual.fairEventDetails, {
        eventId: data.event_id,
      });
      return;
    }
    if (itemType === "promotionals") {
      await openPromotion(data.cta);
    }
  };

  if (!isLoading && featuredItems.length === 0) return null;

  return (
    <View style={tw`mt-2`}>
      <SectionHeader title="Featured"/>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={tw`px-5 pt-5 gap-4`}
      >
        {isLoading
          ? SKELETON_ITEMS.map((item) => (
            <View
              key={item}
              style={tw`w-[280px] rounded-md bg-white overflow-hidden`}
            >
              <View style={tw`h-[180px] w-full bg-neutral-200`} />
              <View style={tw`p-3`}>
                <View style={tw`h-3 w-20 rounded-sm bg-neutral-200`} />
                <View style={tw`h-4 w-44 rounded-sm bg-neutral-200 mt-2`} />
                <View style={tw`h-3 w-32 rounded-sm bg-neutral-200 mt-2`} />
              </View>
            </View>
          ))
          : featuredItems.map((item: FeaturedItem, index: number) => {
            const imageUri = resolveImage(item);
            const title = resolveTitle(item);
            const subtitle = resolveSubtitle(item);
            const label = resolveLabel(item);

            return (
              <Pressable
                key={item.identifier || `${item.type || "item"}-${index}`}
                onPress={() => {
                  void onPressItem(item);
                }}
                style={tw`w-[280px] rounded-md bg-white overflow-hidden`}
              >
                {imageUri ? (
                  <Image source={{ uri: imageUri }} style={tw`w-full h-[180px] bg-neutral-100`} />
                ) : (
                  <View style={tw`w-full h-[180px] bg-[#0D2040] items-center justify-center`}>
                    <Ionicons name="image-outline" size={24} color="#E5E7EB" />
                  </View>
                )}
                <View style={tw`p-3`}>
                  <Text style={tw`text-xs font-sans-regular uppercase tracking-widest text-neutral-500`}>
                    {label}
                  </Text>
                  <Text
                    numberOfLines={2}
                    style={tw`text-base font-serif text-neutral-900 mt-1 leading-snug`}
                  >
                    {title}
                  </Text>
                  {!!subtitle && (
                    <Text numberOfLines={1} style={tw`text-xs text-neutral-600 mt-1`}>
                      {subtitle}
                    </Text>
                  )}
                </View>
              </Pressable>
            );
          })}
      </ScrollView>
    </View>
  );
}
