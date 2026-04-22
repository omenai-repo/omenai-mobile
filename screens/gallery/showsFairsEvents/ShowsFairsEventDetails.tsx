import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import BackHeaderTitle from "#components/header/BackHeaderTitle";
import { colors } from "#config/colors.config";
import { getPromotionalFileView } from "#lib/storage/getPromotionalsFileView";
import { screenName } from "#constants/screenNames.constants";
import {
  EVENTS_QK,
} from "#utils/queryKeys";
import {
  archiveGalleryEvent,
  EventArtwork,
  EventDashboardAnalytics,
  fetchEventDashboardAnalytics,
  fetchGalleryInventory,
  GalleryEventRecord,
  GalleryInventoryArtwork,
  getIndividualShow,
  getSingleEvent,
  toggleEventVisibility,
  updateEventArtworks,
  updateEventDetails,
  updateEventInstallationViews,
} from "#services/events/events.service";
import { getImageFileView } from "#lib/storage/getImageFileView";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { appwriteConfig } from "#config/appwrite.config";
import { uploadToAppwrite } from "#utils/uploadToAppwrite";
import { useAppStore } from "#store/app/appStore";
import VipEarlyAccessSection from "./components/VipEarlyAccessSection";
import EventDetailsHeaderCard from "./components/EventDetailsHeaderCard";

type RouteParams = {
  eventId: string;
  source: "show" | "event";
};

type ArtworkFilter = "All" | "Available" | "Sold";
type EditFormState = {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  externalUrl: string;
  venue: string;
  city: string;
  country: string;
  boothNumber: string;
};

const formatDateRange = (startDate?: string, endDate?: string) => {
  if (!startDate || !endDate) return "Date unavailable";
  const start = new Date(startDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
  const end = new Date(endDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return `${start} - ${end}`;
};

const resolvePromotionalImage = (image?: string, width = 1200) => {
  if (!image) return "";
  if (/^https?:\/\//i.test(image)) return image;
  return getPromotionalFileView(image, width);
};

const resolveArtworkImage = (image?: string, width = 900) => {
  if (!image) return "";
  if (/^https?:\/\//i.test(image)) return image;
  return getImageFileView(image, width);
};

export default function ShowsFairsEventDetails() {
  const windowWidth = Dimensions.get("window").width;
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute();
  const { eventId, source } = route.params as RouteParams;
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { userSession } = useAppStore();

  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [artworkFilter, setArtworkFilter] = useState<ArtworkFilter>("All");
  const [immersiveOpen, setImmersiveOpen] = useState(false);
  const [immersiveIndex, setImmersiveIndex] = useState(0);
  const [isPublished, setIsPublished] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [isCoverUploadInProgress, setIsCoverUploadInProgress] = useState(false);
  const [inventorySearch, setInventorySearch] = useState("");
  const [inventoryResults, setInventoryResults] = useState<GalleryInventoryArtwork[]>([]);
  const [selectedArtworkIds, setSelectedArtworkIds] = useState<string[]>([]);
  const [editForm, setEditForm] = useState<EditFormState>({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    externalUrl: "",
    venue: "",
    city: "",
    country: "",
    boothNumber: "",
  });

  const { data, isLoading, isRefetching, isError, refetch } = useQuery({
    queryKey: EVENTS_QK.details(eventId, source),
    queryFn: async () => {
      const result =
        source === "show"
          ? await getIndividualShow(eventId)
          : await getSingleEvent(eventId);
      if (!result.isOk || !result.data) {
        throw new Error(result.message || "Failed to fetch event details");
      }
      return result.data as GalleryEventRecord;
    },
    enabled: !!eventId,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
  });

  const galleryId = data?.gallery_id || userSession?.id || "";

  const { data: dashboardAnalytics } = useQuery({
    queryKey: ["events", "dashboard-analytics", eventId, galleryId],
    queryFn: async () => {
      const result = await fetchEventDashboardAnalytics(eventId, galleryId);
      if (!result.isOk) {
        throw new Error(result.message || "Failed to load analytics");
      }
      return result.analytics as EventDashboardAnalytics;
    },
    enabled: !!eventId && !!galleryId,
    staleTime: 2 * 60 * 1000,
  });

  useEffect(() => {
    if (!data) return;
    setIsPublished(data.is_published ?? true);
    setEditForm({
      title: data.title || "",
      description: data.description || "",
      startDate: data.start_date ? data.start_date.slice(0, 10) : "",
      endDate: data.end_date ? data.end_date.slice(0, 10) : "",
      externalUrl: data.external_url || "",
      venue: data.location?.venue || "",
      city: data.location?.city || "",
      country: data.location?.country || "",
      boothNumber: data.booth_number || "",
    });
  }, [data]);

  const publishMutation = useMutation({
    mutationFn: (targetStatus: boolean) =>
      toggleEventVisibility(eventId, galleryId, targetStatus),
    onSuccess: async (result, targetStatus) => {
      if (!result.isOk) {
        Alert.alert("Update Failed", result.message || "Failed to update visibility.");
        return;
      }
      setIsPublished(targetStatus);
      await queryClient.invalidateQueries({ queryKey: EVENTS_QK.details(eventId, source) });
      await queryClient.invalidateQueries({ queryKey: EVENTS_QK.allShows });
      await queryClient.invalidateQueries({ queryKey: EVENTS_QK.allFairsEvents("all") });
      Alert.alert("Success", targetStatus ? "Event is now published." : "Event is now unpublished.");
    },
  });

  const archiveMutation = useMutation({
    mutationFn: () => archiveGalleryEvent(eventId, galleryId),
    onSuccess: async (result) => {
      if (!result.isOk) {
        Alert.alert("Archive Failed", result.message || "Failed to archive event.");
        return;
      }
      await queryClient.invalidateQueries({ queryKey: EVENTS_QK.allShows });
      await queryClient.invalidateQueries({ queryKey: EVENTS_QK.allFairsEvents("all") });
      navigation.goBack();
    },
  });

  const saveEditMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) => updateEventDetails(eventId, galleryId, payload),
    onSuccess: async (result) => {
      if (!result.isOk) {
        Alert.alert("Save Failed", result.message || "Unable to update event details.");
        return;
      }
      setEditOpen(false);
      await refetch();
      Alert.alert("Saved", "Event details have been updated.");
    },
  });

  const addInstallationViewMutation = useMutation({
    mutationFn: (imageId: string) => updateEventInstallationViews(eventId, galleryId, imageId, "add"),
    onSuccess: async (result) => {
      if (!result.isOk) {
        Alert.alert("Upload Failed", result.message || "Unable to update installation views.");
        return;
      }
      await refetch();
      Alert.alert("Done", "Installation image added.");
    },
  });

  const updateCoverMutation = useMutation({
    mutationFn: (coverImageId: string) =>
      updateEventDetails(eventId, galleryId, { cover_image: coverImageId }),
    onSuccess: async (result) => {
      if (!result.isOk) {
        Alert.alert("Cover Update Failed", result.message || "Unable to update cover image.");
        return;
      }
      await refetch();
      Alert.alert("Saved", "Cover image has been updated.");
    },
    onError: () => {
      Alert.alert("Cover Update Failed", "Unable to update cover image.");
    },
    onSettled: () => {
      setIsCoverUploadInProgress(false);
    },
  });

  const addArtworksMutation = useMutation({
    mutationFn: (artworkIds: string[]) => updateEventArtworks(eventId, galleryId, artworkIds, "add"),
    onSuccess: async (result) => {
      if (!result.isOk) {
        Alert.alert("Update Failed", result.message || "Unable to add works to this event.");
        return;
      }
      setInventoryOpen(false);
      setSelectedArtworkIds([]);
      await refetch();
      Alert.alert("Works Added", "Selected works have been added to this presentation.");
    },
  });

  const media = useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data.installation_views) && data.installation_views.length > 0) {
      return data.installation_views;
    }
    return data.cover_image ? [data.cover_image] : [];
  }, [data]);

  const artworks = useMemo(
    () => (data?.artworks ?? []) as EventArtwork[],
    [data?.artworks],
  );
  const filteredArtworks = useMemo(() => {
    if (artworkFilter === "All") return artworks;
    if (artworkFilter === "Available") return artworks.filter((item) => item.availability);
    return artworks.filter((item) => !item.availability);
  }, [artworks, artworkFilter]);

  const descriptionWords = (data?.description || "").split(" ").filter(Boolean);
  const longDescription = descriptionWords.length > 70;
  const visibleDescription =
    longDescription && !descriptionExpanded
      ? `${descriptionWords.slice(0, 70).join(" ")}...`
      : data?.description || "No description available.";

  const openImmersive = (index: number) => {
    setImmersiveIndex(index);
    setImmersiveOpen(true);
  };

  const handleOpenEditModal = () => {
    setEditOpen(true);
  };

  const handleSaveEdits = () => {
    if (!galleryId) {
      Alert.alert("Missing Gallery", "Unable to identify your gallery account.");
      return;
    }
    if (!editForm.title.trim()) {
      Alert.alert("Missing Title", "Please provide a title for this event.");
      return;
    }

    const updatePayload: Record<string, unknown> = {
      title: editForm.title.trim(),
      description: editForm.description.trim(),
      start_date: editForm.startDate.trim(),
      end_date: editForm.endDate.trim(),
      external_url: editForm.externalUrl.trim() || null,
      location: {
        venue: editForm.venue.trim(),
        city: editForm.city.trim(),
        country: editForm.country.trim(),
      },
    };

    if (data?.event_type === "art_fair") {
      updatePayload.booth_number = editForm.boothNumber.trim() || null;
    }

    saveEditMutation.mutate(updatePayload);
  };

  const handleTogglePublish = () => {
    if (!galleryId) {
      Alert.alert("Missing Gallery", "Unable to identify your gallery account.");
      return;
    }
    publishMutation.mutate(!isPublished);
  };

  const handleAddInstallationImage = async () => {
    if (!galleryId) {
      Alert.alert("Missing Gallery", "Unable to identify your gallery account.");
      return;
    }
    if (!appwriteConfig.promotionalBucketId) {
      Alert.alert("Configuration Error", "Promotional storage bucket is not configured.");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.9,
    });

    if (pickerResult.canceled || !pickerResult.assets?.length) return;
    const asset = pickerResult.assets[0];

    try {
      const upload = await uploadToAppwrite({
        bucketId: appwriteConfig.promotionalBucketId,
        file: {
          uri: asset.uri,
          name: asset.fileName || `installation-${Date.now()}.jpg`,
          type: asset.mimeType || "image/jpeg",
        },
        fallbackName: `installation-${Date.now()}.jpg`,
        fallbackType: "image/jpeg",
        errorMessage: "Failed to upload installation image",
      });
      addInstallationViewMutation.mutate(upload.$id);
    } catch (error: any) {
      Alert.alert("Upload Failed", error?.message || "Unable to upload selected image.");
    }
  };

  const handleReplaceCoverImage = async () => {
    if (!galleryId) {
      Alert.alert("Missing Gallery", "Unable to identify your gallery account.");
      return;
    }
    if (!appwriteConfig.promotionalBucketId) {
      Alert.alert(
        "Action Needed",
        "Setup issue. Please contact support."
      );

      return;
    }

    setIsCoverUploadInProgress(true);
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.9,
    });

    if (pickerResult.canceled || !pickerResult.assets?.length) {
      setIsCoverUploadInProgress(false);
      return;
    }
    const asset = pickerResult.assets[0];

    try {
      const upload = await uploadToAppwrite({
        bucketId: appwriteConfig.promotionalBucketId,
        file: {
          uri: asset.uri,
          name: asset.fileName || `event-cover-${Date.now()}.jpg`,
          type: asset.mimeType || "image/jpeg",
        },
        fallbackName: `event-cover-${Date.now()}.jpg`,
        fallbackType: "image/jpeg",
        errorMessage: "Failed to upload cover image",
      });

      updateCoverMutation.mutate(upload.$id);
    } catch (error: any) {
      Alert.alert("Upload Failed", error?.message || "Unable to upload selected image.");
      setIsCoverUploadInProgress(false);
    }
  };

  const fetchInventoryForModal = async (searchTerm = "") => {
    if (!galleryId) {
      Alert.alert("Missing Gallery", "Unable to identify your gallery account.");
      return;
    }
    setInventoryLoading(true);
    const response = await fetchGalleryInventory(galleryId, 1, 50, searchTerm);
    setInventoryLoading(false);

    if (!response.isOk) {
      Alert.alert("Inventory", response.message || "Unable to load available works.");
      return;
    }

    const existingIds = new Set(artworks.map((item) => item.art_id));
    const available = response.data.filter((item) => !existingIds.has(item.art_id));
    setInventoryResults(available);
  };

  const toggleArtworkSelection = (artId: string) => {
    setSelectedArtworkIds((prev) =>
      prev.includes(artId) ? prev.filter((id) => id !== artId) : [...prev, artId],
    );
  };

  const handleOpenAddWorks = async () => {
    setInventoryOpen(true);
    setSelectedArtworkIds([]);
    await fetchInventoryForModal("");
  };

  const handleAttachSelectedWorks = () => {
    if (!galleryId) {
      Alert.alert("Missing Gallery", "Unable to identify your gallery account.");
      return;
    }
    if (!selectedArtworkIds.length) {
      Alert.alert("No Selection", "Select at least one artwork.");
      return;
    }
    addArtworksMutation.mutate(selectedArtworkIds);
  };

  const handleArchive = () => {
    if (!galleryId) {
      Alert.alert("Missing Gallery", "Unable to identify your gallery account.");
      return;
    }
    Alert.alert(
      "Archive Presentation",
      "This will remove the event from active programming. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Archive",
          style: "destructive",
          onPress: () => archiveMutation.mutate(),
        },
      ],
    );
  };

  const analytics = useMemo(
    () => ({
      pageViews: dashboardAnalytics?.views ?? 0,
      viewInRoom: dashboardAnalytics?.view_in_room ?? 0,
      publicShares: dashboardAnalytics?.shares ?? 0,
    }),
    [dashboardAnalytics?.shares, dashboardAnalytics?.view_in_room, dashboardAnalytics?.views],
  );
  if (isLoading) {
    return (
      <View style={tw`flex-1 bg-[#F7F7F7]`}>
        <BackHeaderTitle title="Event details" />
        <View style={tw`flex-1 items-center justify-center`}>
          <ActivityIndicator size="large" color={colors.black} />
        </View>
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={tw`flex-1 bg-[#F7F7F7]`}>
        <BackHeaderTitle title="Event details" />
        <View style={tw`flex-1 items-center justify-center px-8`}>
          <Ionicons name="alert-circle-outline" size={36} color="#A3A3A3" />
          <Text style={tw`text-base text-neutral-700 mt-3 text-center`}>
            Failed to load event details.
          </Text>
          <TouchableOpacity
            onPress={() => refetch()}
            style={tw`mt-5 px-5 py-3 rounded-md bg-black`}
            activeOpacity={0.8}
          >
            <Text style={tw`text-white text-xs uppercase tracking-widest`}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-[#F7F7F7]`}>
      <BackHeaderTitle title={data.title || "Event"} />
      <FlatList
        data={filteredArtworks}
        keyExtractor={(item, index) => `${item.art_id || "art"}-${index}`}
        numColumns={2}
        columnWrapperStyle={tw`gap-3`}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + 24,
        }}
        refreshing={isRefetching}
        onRefresh={refetch}
        ListHeaderComponent={
          <View>
            <EventDetailsHeaderCard
              event={data}
              isPublished={isPublished}
              isSavingDetails={saveEditMutation.isPending}
              isTogglingPublish={publishMutation.isPending}
              isUploadingCover={isCoverUploadInProgress || updateCoverMutation.isPending}
              onCoverImageChange={handleReplaceCoverImage}
              onEditClick={handleOpenEditModal}
              onTogglePublish={handleTogglePublish}
            />

            <VipEarlyAccessSection event={data} />
            <View style={tw`flex-row gap-3 mb-4`}>
              <View style={tw`flex-1 bg-white border border-neutral-200 rounded-md p-3`}>
                <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500`}>
                  Page Views
                </Text>
                <Text style={tw`text-2xl text-neutral-900 mt-2`}>{analytics.pageViews}</Text>
              </View>
              <View style={tw`flex-1 bg-white border border-neutral-200 rounded-md p-3`}>
                <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500`}>
                  View In Room Activations
                </Text>
                <Text style={tw`text-2xl text-neutral-900 mt-2`}>{analytics.viewInRoom}</Text>
              </View>
              <View style={tw`flex-1 bg-white border border-neutral-200 rounded-md p-3`}>
                <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500`}>
                  Public Shares
                </Text>
                <Text style={tw`text-2xl text-neutral-900 mt-2`}>{analytics.publicShares}</Text>
              </View>
            </View>

            <View style={tw`bg-white rounded-md border border-neutral-200 p-3 mb-4`}>
              <View style={tw`flex-row items-center justify-between mb-2`}>
                <View>
                  <Text style={tw`text-sm text-neutral-900`}>Installation Views</Text>
                  <Text style={tw`text-xs text-neutral-500`}>
                    Manage visuals shown in this room presentation.
                  </Text>
                </View>
                <TouchableOpacity
                  style={tw`px-3 py-2 border border-neutral-300 rounded-sm`}
                  activeOpacity={0.8}
                  onPress={handleAddInstallationImage}
                  disabled={addInstallationViewMutation.isPending}
                >
                  <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-700`}>
                    {addInstallationViewMutation.isPending ? "Uploading..." : "Add Images"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <FlatList
              data={media}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => `${item}-${index}`}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: resolvePromotionalImage(item, 1400) }}
                  style={[
                    tw`h-56 rounded-md bg-neutral-200 mr-3`,
                    { width: windowWidth - 32 },
                  ]}
                  resizeMode="cover"
                />
              )}
              ListEmptyComponent={
                <View style={tw`h-56 rounded-md bg-neutral-200 items-center justify-center`}>
                  <Ionicons name="image-outline" size={28} color="#A3A3A3" />
                </View>
              }
              style={tw`mb-5`}
            />

            <View style={tw`bg-white rounded-md border border-neutral-200 p-4 mb-4`}>
              <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500 mb-2`}>
                {data.gallery?.name || "Gallery"}
              </Text>
              <Text style={tw`text-xl text-neutral-900 mb-3`}>{data.title}</Text>

              <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500 mb-1`}>
                Dates
              </Text>
              <Text style={tw`text-sm text-neutral-800 mb-3`}>
                {formatDateRange(data.start_date, data.end_date)}
              </Text>

              {!!data.location && (
                <>
                  <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500 mb-1`}>
                    Location
                  </Text>
                  <Text style={tw`text-sm text-neutral-800 mb-3`}>
                    {[data.location.venue, data.location.city, data.location.country]
                      .filter(Boolean)
                      .join(", ")}
                  </Text>
                </>
              )}

              {!!data.booth_number && (
                <>
                  <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500 mb-1`}>
                    Booth Number
                  </Text>
                  <Text style={tw`text-sm text-neutral-800 mb-3`}>{data.booth_number}</Text>
                </>
              )}

              <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500 mb-1`}>
                Curatorial Statement
              </Text>
              <Text style={tw`text-sm text-neutral-800 leading-6`}>{visibleDescription}</Text>
              {longDescription && (
                <TouchableOpacity
                  onPress={() => setDescriptionExpanded((prev) => !prev)}
                  style={tw`pt-3`}
                  activeOpacity={0.8}
                >
                  <Text style={tw`text-xs uppercase tracking-widest text-neutral-500`}>
                    {descriptionExpanded ? "Show Less" : "Continue Reading"}
                  </Text>
                </TouchableOpacity>
              )}

              {!!data.external_url && (
                <TouchableOpacity
                  onPress={() => Linking.openURL(data.external_url!)}
                  style={tw`mt-4 bg-black px-4 py-3 rounded-md`}
                  activeOpacity={0.8}
                >
                  <Text style={tw`text-white text-xs uppercase tracking-widest text-center`}>
                    Enter Viewing Room
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={tw`flex-row items-center justify-between mb-3`}>
              <View>
                <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500`}>
                  Active Inventory
                </Text>
                <Text style={tw`text-sm text-neutral-800 mt-1`}>
                  {filteredArtworks.length}
                  {artworkFilter !== "All" ? ` / ${artworks.length}` : ""} works
                </Text>
                <View style={tw`mt-2 bg-neutral-50 border border-neutral-200 rounded-sm p-2.5`}>
                  <Text style={tw`text-[10px] text-neutral-700 leading-4`}>
                    <Text style={tw`font-medium`}>Curatorial Sequence:</Text> use long-press
                    immersive view to check ordering impact on the public presentation.
                  </Text>
                </View>
              </View>
              {filteredArtworks.length > 0 && (
                <View style={tw`flex-row gap-2`}>
                  <TouchableOpacity
                    style={tw`px-3 py-2 border border-neutral-300 rounded-sm`}
                    onPress={handleOpenAddWorks}
                    activeOpacity={0.8}
                  >
                    <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-700`}>
                      Add Works
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => openImmersive(0)} activeOpacity={0.8}>
                    <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-600 pt-2`}>
                      Immersive View
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={tw`flex-row gap-2 mb-4`}>
              {(["All", "Available", "Sold"] as ArtworkFilter[]).map((filter) => (
                <TouchableOpacity
                  key={filter}
                  onPress={() => setArtworkFilter(filter)}
                  style={[
                    tw`px-3 py-2 rounded-sm border`,
                    artworkFilter === filter
                      ? tw`bg-black border-black`
                      : tw`bg-white border-neutral-300`,
                  ]}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      tw`text-[10px] uppercase tracking-widest`,
                      artworkFilter === filter ? tw`text-white` : tw`text-neutral-700`,
                    ]}
                  >
                    {filter}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        }
        renderItem={({ item, index }) => {
          const imageUrl = resolveArtworkImage(item.url, 700);
          return (
            <TouchableOpacity
              style={tw`flex-1 mb-4`}
              activeOpacity={0.85}
              onPress={() =>
                navigation.push(screenName.artwork, {
                  art_id: item.art_id,
                  url: item.url,
                })
              }
              onLongPress={() => openImmersive(index)}
            >
              <Image
                source={{ uri: imageUrl }}
                style={tw`h-44 rounded-md bg-neutral-200`}
                resizeMode="cover"
              />
              <Text numberOfLines={1} style={tw`text-sm text-neutral-900 mt-2`}>
                {item.title}
              </Text>
              <Text numberOfLines={1} style={tw`text-xs text-neutral-500`}>
                {item.artist}
              </Text>
              <Text style={tw`text-[10px] uppercase tracking-widest mt-1 text-neutral-500`}>
                {item.availability ? "Available" : "Sold"}
              </Text>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={tw`py-12 items-center`}>
            <Text style={tw`text-xs uppercase tracking-widest text-neutral-500`}>
              No {artworkFilter.toLowerCase()} artworks found.
            </Text>
          </View>
        }
        ListFooterComponent={
          <View style={tw`mt-6 pt-5 border-t border-red-100`}>
            <View style={tw`bg-red-50 border border-red-100 rounded-md p-4`}>
              <Text style={tw`text-sm text-red-900`}>Archive Event</Text>
              <Text style={tw`text-xs text-red-700 mt-1 leading-5`}>
                Archiving this event removes it from active programming and releases attached
                artworks back into your available vault.
              </Text>
              <TouchableOpacity
                style={tw`mt-3 self-start px-4 py-2 rounded-sm bg-red-600`}
                activeOpacity={0.85}
                onPress={handleArchive}
                disabled={archiveMutation.isPending}
              >
                <Text style={tw`text-[10px] uppercase tracking-widest text-white`}>
                  {archiveMutation.isPending ? "Archiving..." : "Archive Presentation"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        }
      />

      <Modal visible={editOpen} animationType="slide" transparent>
        <View style={tw`flex-1 bg-black/40 justify-end`}>
          <View
            style={[
              tw`bg-white rounded-t-2xl px-4 pt-4 pb-5`,
              { maxHeight: "85%", paddingBottom: insets.bottom + 16 },
            ]}
          >
            <View style={tw`flex-row items-center justify-between mb-3`}>
              <Text style={tw`text-sm text-neutral-900`}>Edit Event Details</Text>
              <Pressable onPress={() => setEditOpen(false)}>
                <Ionicons name="close" size={22} color="#171717" />
              </Pressable>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={tw`gap-2 mb-3`}>
                <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500`}>Title</Text>
                <TextInput
                  value={editForm.title}
                  onChangeText={(value) => setEditForm((prev) => ({ ...prev, title: value }))}
                  style={tw`border border-neutral-300 rounded-sm px-3 py-2 text-sm`}
                />
              </View>
              <View style={tw`gap-2 mb-3`}>
                <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500`}>
                  Description
                </Text>
                <TextInput
                  value={editForm.description}
                  onChangeText={(value) =>
                    setEditForm((prev) => ({ ...prev, description: value }))
                  }
                  multiline
                  textAlignVertical="top"
                  style={tw`border border-neutral-300 rounded-sm px-3 py-2 text-sm min-h-[90px]`}
                />
              </View>
              <View style={tw`flex-row gap-2 mb-3`}>
                <View style={tw`flex-1 gap-2`}>
                  <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500`}>
                    Start Date (YYYY-MM-DD)
                  </Text>
                  <TextInput
                    value={editForm.startDate}
                    onChangeText={(value) =>
                      setEditForm((prev) => ({ ...prev, startDate: value }))
                    }
                    style={tw`border border-neutral-300 rounded-sm px-3 py-2 text-sm`}
                  />
                </View>
                <View style={tw`flex-1 gap-2`}>
                  <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500`}>
                    End Date (YYYY-MM-DD)
                  </Text>
                  <TextInput
                    value={editForm.endDate}
                    onChangeText={(value) => setEditForm((prev) => ({ ...prev, endDate: value }))}
                    style={tw`border border-neutral-300 rounded-sm px-3 py-2 text-sm`}
                  />
                </View>
              </View>
              <View style={tw`gap-2 mb-3`}>
                <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500`}>
                  External URL
                </Text>
                <TextInput
                  value={editForm.externalUrl}
                  onChangeText={(value) => setEditForm((prev) => ({ ...prev, externalUrl: value }))}
                  autoCapitalize="none"
                  keyboardType="url"
                  style={tw`border border-neutral-300 rounded-sm px-3 py-2 text-sm`}
                />
              </View>
              <View style={tw`flex-row gap-2 mb-3`}>
                <View style={tw`flex-1 gap-2`}>
                  <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500`}>
                    Venue
                  </Text>
                  <TextInput
                    value={editForm.venue}
                    onChangeText={(value) => setEditForm((prev) => ({ ...prev, venue: value }))}
                    style={tw`border border-neutral-300 rounded-sm px-3 py-2 text-sm`}
                  />
                </View>
                <View style={tw`flex-1 gap-2`}>
                  <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500`}>
                    City
                  </Text>
                  <TextInput
                    value={editForm.city}
                    onChangeText={(value) => setEditForm((prev) => ({ ...prev, city: value }))}
                    style={tw`border border-neutral-300 rounded-sm px-3 py-2 text-sm`}
                  />
                </View>
              </View>
              <View style={tw`flex-row gap-2 mb-4`}>
                <View style={tw`flex-1 gap-2`}>
                  <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500`}>
                    Country
                  </Text>
                  <TextInput
                    value={editForm.country}
                    onChangeText={(value) => setEditForm((prev) => ({ ...prev, country: value }))}
                    style={tw`border border-neutral-300 rounded-sm px-3 py-2 text-sm`}
                  />
                </View>
                {data.event_type === "art_fair" && (
                  <View style={tw`flex-1 gap-2`}>
                    <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500`}>
                      Booth Number
                    </Text>
                    <TextInput
                      value={editForm.boothNumber}
                      onChangeText={(value) =>
                        setEditForm((prev) => ({ ...prev, boothNumber: value }))
                      }
                      style={tw`border border-neutral-300 rounded-sm px-3 py-2 text-sm`}
                    />
                  </View>
                )}
              </View>
            </ScrollView>
            <TouchableOpacity
              style={tw`bg-black rounded-sm py-3 mt-2`}
              activeOpacity={0.85}
              onPress={handleSaveEdits}
              disabled={saveEditMutation.isPending}
            >
              <Text style={tw`text-white text-[10px] uppercase tracking-widest text-center`}>
                {saveEditMutation.isPending ? "Saving..." : "Save Changes"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={inventoryOpen} animationType="slide" transparent>
        <View style={tw`flex-1 bg-black/40 justify-end`}>
          <View
            style={[
              tw`bg-white rounded-t-2xl px-4 pt-4`,
              { maxHeight: "80%", paddingBottom: insets.bottom + 14 },
            ]}
          >
            <View style={tw`flex-row items-center justify-between mb-3`}>
              <Text style={tw`text-sm text-neutral-900`}>Add Works to Event</Text>
              <Pressable onPress={() => setInventoryOpen(false)}>
                <Ionicons name="close" size={22} color="#171717" />
              </Pressable>
            </View>
            <TextInput
              placeholder="Search your inventory"
              value={inventorySearch}
              onChangeText={setInventorySearch}
              onSubmitEditing={() => fetchInventoryForModal(inventorySearch)}
              style={tw`border border-neutral-300 rounded-sm px-3 py-2 text-sm mb-3`}
            />
            {inventoryLoading ? (
              <View style={tw`py-6 items-center`}>
                <ActivityIndicator size="small" color={colors.black} />
              </View>
            ) : (
              <FlatList
                data={inventoryResults}
                keyExtractor={(item) => item.art_id}
                renderItem={({ item }) => {
                  const selected = selectedArtworkIds.includes(item.art_id);
                  const imageUri = item.url || item.image_url || "";
                  return (
                    <Pressable
                      onPress={() => toggleArtworkSelection(item.art_id)}
                      style={tw`flex-row items-center gap-3 py-2 border-b border-neutral-100`}
                    >
                      <Image
                        source={{ uri: resolveArtworkImage(imageUri, 300) }}
                        style={tw`h-11 w-11 rounded-sm bg-neutral-200`}
                      />
                      <View style={tw`flex-1`}>
                        <Text numberOfLines={1} style={tw`text-xs text-neutral-900`}>
                          {item.title || "Untitled"}
                        </Text>
                        <Text numberOfLines={1} style={tw`text-[10px] text-neutral-500 mt-1`}>
                          {item.artist || "Unknown Artist"}
                        </Text>
                      </View>
                      <Ionicons
                        name={selected ? "checkbox" : "square-outline"}
                        size={20}
                        color={selected ? "#111827" : "#A3A3A3"}
                      />
                    </Pressable>
                  );
                }}
                ListEmptyComponent={
                  <View style={tw`py-8 items-center`}>
                    <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500`}>
                      No available artworks found
                    </Text>
                  </View>
                }
                showsVerticalScrollIndicator={false}
              />
            )}
            <TouchableOpacity
              style={tw`bg-black rounded-sm py-3 mt-3`}
              activeOpacity={0.85}
              onPress={handleAttachSelectedWorks}
              disabled={addArtworksMutation.isPending}
            >
              <Text style={tw`text-white text-[10px] uppercase tracking-widest text-center`}>
                {addArtworksMutation.isPending
                  ? "Adding..."
                  : `Add Selected Works (${selectedArtworkIds.length})`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={immersiveOpen} animationType="fade" transparent={false}>
        <View style={tw`flex-1 bg-black`}>
          <View
            style={[
              tw`flex-row items-center justify-between px-4`,
              { paddingTop: insets.top + 12, paddingBottom: 12 },
            ]}
          >
            <Text style={tw`text-white text-[10px] uppercase tracking-widest`}>
              {data.title} - {filteredArtworks.length} works
            </Text>
            <Pressable onPress={() => setImmersiveOpen(false)}>
              <Ionicons name="close" size={28} color="#fff" />
            </Pressable>
          </View>

          <FlatList
            data={filteredArtworks}
            horizontal
            pagingEnabled
            initialScrollIndex={immersiveIndex}
            getItemLayout={(_, index) => ({
              length: windowWidth,
              offset: windowWidth * index,
              index,
            })}
            keyExtractor={(item, index) => `${item.art_id}-${index}`}
            renderItem={({ item }) => (
              <View style={[tw`px-4 justify-center`, { width: windowWidth }]}>
                <Image
                  source={{ uri: resolveArtworkImage(item.url, 1200) }}
                  style={tw`w-full h-[360px] bg-neutral-900 rounded-md`}
                  resizeMode="contain"
                />
                <Text style={tw`text-white text-base mt-4`}>{item.title}</Text>
                <Text style={tw`text-neutral-300 text-xs mt-1`}>{item.artist}</Text>
              </View>
            )}
            contentContainerStyle={{ alignItems: "center" }}
            style={{ flex: 1 }}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </Modal>
    </View>
  );
}
