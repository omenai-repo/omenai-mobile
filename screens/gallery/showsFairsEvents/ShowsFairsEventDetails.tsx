import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import tw from "twrnc";
import * as ImagePicker from "expo-image-picker";
import BackHeaderTitle from "#components/header/BackHeaderTitle";
import { colors } from "#config/colors.config";
import { screenName } from "#constants/screenNames.constants";
import { EVENTS_QK } from "#utils/queryKeys";
import {
  archiveGalleryEvent,
  fetchEventDashboardData,
  updateArtworkSequence,
  updateEventArtworks,
  updateEventDetails,
} from "#services/events/events.service";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { appwriteConfig } from "#config/appwrite.config";
import { uploadToAppwrite } from "#utils/uploadToAppwrite";
import { useAppStore } from "#store/app/appStore";
import VipEarlyAccessSection from "./components/VipEarlyAccessSection";
import EventDetailsHeaderCard from "./components/EventDetailsHeaderCard";
import InstallationViewsManager from "./components/InstallationViewsManager";
import EventInventoryGrid from "./components/EventInventoryGrid";
import ArtworkSelectorModal from "./components/ArtworkSelectorModal";
import EditEventBottomSheet from "./components/EditEventBottomSheet";
import { useModalStore } from "#store/modal/modalStore";

type RouteParams = {
  eventId: string;
  source: "show" | "event";
};

export default function ShowsFairsEventDetails() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute();
  const { eventId, source } = route.params as RouteParams;
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { userSession } = useAppStore();
  const { updateModal, updateConfirmationModal, clear } = useModalStore();

  const [editOpen, setEditOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [isCoverUploadInProgress, setIsCoverUploadInProgress] = useState(false);

  const galleryId = userSession?.id || "";


  const archiveMutation = useMutation({
    mutationFn: () => archiveGalleryEvent(eventId, galleryId),
    onSuccess: async (result) => {
      if (!result.isOk) {
        updateModal({
          showModal: true,
          modalType: "error",
          message: result.message || "Failed to archive event.",
        });
        return;
      }
      await queryClient.invalidateQueries({ queryKey: EVENTS_QK.allShows });
      await queryClient.invalidateQueries({
        queryKey: EVENTS_QK.allFairsEvents("all"),
      });
      await queryClient.invalidateQueries({
        queryKey: EVENTS_QK.galleryProgramming(galleryId),
      });
      navigation.goBack();
    },
  });

  const saveEditMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      updateEventDetails(eventId, galleryId, payload),
    onSuccess: async (result) => {
      if (!result.isOk) {
        updateModal({
          showModal: true,
          modalType: "error",
          message: result.message || "Unable to update event details.",
        });
        return;
      }
      setEditOpen(false);
      await refetch();
      updateModal({
        showModal: true,
        modalType: "success",
        message: "Event details have been updated.",
      });
    },
  });

  const updateCoverMutation = useMutation({
    mutationFn: (coverImageId: string) =>
      updateEventDetails(eventId, galleryId, { cover_image: coverImageId }),
    onSuccess: async (result) => {
      if (!result.isOk) {
        updateModal({
          showModal: true,
          modalType: "error",
          message: result.message || "Unable to update cover image.",
        });
        return;
      }
      await refetch();
      updateModal({
        showModal: true,
        modalType: "success",
        message: "Cover image has been updated.",
      });
    },
    onError: () => {
      updateModal({
        showModal: true,
        modalType: "error",
        message: "Unable to update cover image.",
      });
    },
    onSettled: () => {
      setIsCoverUploadInProgress(false);
    },
  });

  const addArtworksMutation = useMutation({
    mutationFn: (artworkIds: string[]) =>
      updateEventArtworks(eventId, galleryId, artworkIds, "add"),
    onSuccess: async (result) => {
      if (!result.isOk) {
        updateModal({
          showModal: true,
          modalType: "error",
          message: result.message || "Unable to add works to this event.",
        });
        return;
      }
      setInventoryOpen(false);
      await refetch();
      updateModal({
        showModal: true,
        modalType: "success",
        message: "Selected works have been added to this presentation.",
      });
    },
  });

  const handleOpenEditModal = () => {
    setEditOpen(true);
  };

  const handleSaveEdits = (updatePayload: Record<string, unknown>) => {
    if (!galleryId) {
      updateModal({
        showModal: true,
        modalType: "error",
        message: "Unable to identify your gallery account.",
      });
      return;
    }
    const title = String(updatePayload.title || "").trim();
    if (!title) {
      updateModal({
        showModal: true,
        modalType: "error",
        message: "Please provide a title for this event.",
      });
      return;
    }
    saveEditMutation.mutate(updatePayload);
  };

  const handleReplaceCoverImage = async () => {
    if (!galleryId) {
      updateModal({
        showModal: true,
        modalType: "error",
        message: "Unable to identify your gallery account.",
      });
      return;
    }
    if (!appwriteConfig.promotionalBucketId) {
      updateModal({
        showModal: true,
        modalType: "error",
        message: "Setup issue. Please contact support.",
      });
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
      updateModal({
        showModal: true,
        modalType: "error",
        message: error?.message || "Unable to upload selected image.",
      });
      setIsCoverUploadInProgress(false);
    }
  };

  const handleOpenAddWorks = async () => {
    setInventoryOpen(true);
  };

  const handleAddArtworks = async (payload: {
    featured_artworks: string[];
    participating_artists: string[];
  }) => {
    if (!payload.featured_artworks?.length) return;
    await addArtworksMutation.mutateAsync(payload.featured_artworks);
  };

  const handleRemoveArtwork = async (artworkId: string) => {
    const response = await updateEventArtworks(eventId, galleryId, artworkId, "remove");
    if (!response.isOk) {
      throw new Error(response.message || "Unable to remove work from this event.");
    }

    await queryClient.invalidateQueries({
      queryKey: ["eventDashboard", eventId, galleryId],
    });
    updateModal({
      showModal: true,
      modalType: "success",
      message: "Work removed from presentation.",
    });
  };

  const handleArchive = () => {
    if (!galleryId) {
      updateModal({
        showModal: true,
        modalType: "error",
        message: "Unable to identify your gallery account.",
      });
      return;
    }
    updateConfirmationModal({
      child: (
        <View style={tw`p-5`}>
          <Text style={tw`text-base text-neutral-900 mb-2`}>
            Archive Presentation
          </Text>
          <Text style={tw`text-sm text-neutral-600 mb-5`}>
            This will remove the event from active programming. This action
            cannot be undone.
          </Text>
          <View style={tw`flex-row gap-3`}>
            <TouchableOpacity
              style={tw`flex-1 py-3 border border-neutral-300 rounded-sm items-center`}
              activeOpacity={0.85}
              onPress={() => clear()}
            >
              <Text style={tw`text-sm text-neutral-700`}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`flex-1 py-3 bg-red-600 rounded-sm items-center`}
              activeOpacity={0.85}
              onPress={() => {
                clear();
                archiveMutation.mutate();
              }}
            >
              <Text style={tw`text-sm text-white`}>Archive</Text>
            </TouchableOpacity>
          </View>
        </View>
      ),
    });
  };


  const {
    data: dashboardData,
    isLoading,
    isRefetching,
    isError,
    refetch,
    error
  } = useQuery({
    queryKey: ["eventDashboard", eventId, galleryId],
    queryFn: async () => {
      if (!galleryId) throw new Error("Unauthorized");
      const response = await fetchEventDashboardData(eventId, galleryId);
      if (!response.isOk || !response.data) {
        throw new Error(response.message || "Event not found");
      }
      return response.data;
    },
    enabled: !!galleryId && !!eventId,
    refetchOnMount: true,
  });

  // 2. Handle side-effects (Routing & Toasts) when a fetch fails
  useEffect(() => {
    if (isError) {
      updateModal({
        showModal: true,
        modalType: "error",
        message: error instanceof Error ? error.message : "Failed to load event data.",
      });
      navigation.navigate(screenName.gallery.showsFairsEvents);
    }
  }, [isError, error, updateModal, navigation]);

  if (isLoading || !dashboardData) {
    return (
      <View style={tw`flex-1 bg-[#F7F7F7]`}>
        <BackHeaderTitle title="Event details" />
        <View style={tw`flex-1 items-center justify-center`}>
          <ActivityIndicator size="large" color={colors.black} />
        </View>
      </View>
    );
  }

  const { event, artworks } = dashboardData;

  return (
    <View style={tw`flex-1 bg-[#F7F7F7]`}>
      <BackHeaderTitle title={event.title || "Event"} />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + 24,
        }}
      >
        {/* 1. Event Details Header Card */}
        <EventDetailsHeaderCard
          event={event}
          source={source}
          isSavingDetails={saveEditMutation.isPending}
          isUploadingCover={
            isCoverUploadInProgress || updateCoverMutation.isPending
          }
          isRefreshingData={isRefetching}
          onCoverImageChange={handleReplaceCoverImage}
          onEditClick={handleOpenEditModal}
        />

        <VipEarlyAccessSection event={event} />

        {/* 2. Analytics Row
        <View style={tw`flex-row gap-3 mb-4`}>
          {[
            {
              label: "Page Views",
              value: event?.analytics?.views || 0,
              trend: event?.analytics?.views_trend || "+0%",
            },
            {
              label: "View In Room Activations",
              value: event?.analytics?.view_in_room || 0,
              trend: event?.analytics?.view_in_room_trend || "+0%",
            },
            {
              label: "Public Shares",
              value: event?.analytics?.shares || 0,
              trend: event?.analytics?.shares_trend || "+0%",
            },
          ].map((metric) => (
            <View
              key={metric.label}
              style={tw`flex-1 bg-white border border-neutral-200 rounded-md px-3 pb-1 pt-3 justify-between`}
            >
              <Text
                style={tw`text-xs font-sans-normal uppercase tracking-widest text-neutral-500`}
              >
                {metric.label}
              </Text>
              <View style={tw`flex-row items-end gap-2`}>
                <Text style={tw`text-3xl font-sans-medium text-neutral-900`}>
                  {metric.value.toLocaleString()}
                </Text>
                <Text style={tw`text-xs text-green-600 mb-2`}>
                  {metric.trend}
                </Text>
              </View>
            </View>
          ))}
        </View>
        */}

        {/* 3. Installation view */}
        <InstallationViewsManager
          eventId={event.event_id}
          galleryId={galleryId}
          existingViews={event.installation_views || []}
          onUploadSuccess={() =>
            queryClient.invalidateQueries({
              queryKey: ["eventDashboard", eventId, galleryId],
            })
          }
        />

        <EventInventoryGrid
          eventId={event.event_id}
          artworks={artworks}
          onAddInventoryClick={handleOpenAddWorks}
          onRemoveArtwork={handleRemoveArtwork}
          onReorderArtworks={async (newIds) => {
            const res = await updateArtworkSequence(
              eventId,
              galleryId,
              newIds,
            );
            if (!res.isOk) {
              throw new Error(
                res.message || "Failed to save the new order.",
              );
            }
          }}
        />

        {!event.is_archived && (
          <View style={tw`mt-6 pt-5 border-t border-red-100`}>
            <View style={tw`bg-red-50 border border-red-100 rounded-md p-4`}>
              <Text style={tw`text-sm text-red-900`}>Archive Event</Text>
              <Text style={tw`text-xs text-red-700 mt-1 leading-5`}>
                Archiving this event removes it from active programming and
                releases attached artworks back into your available vault.
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
        )}
      </ScrollView>

      <ArtworkSelectorModal
        isOpen={inventoryOpen}
        onClose={() => setInventoryOpen(false)}
        galleryId={galleryId}
        validatedPayload={null}
        onFinalSubmit={handleAddArtworks}
        alreadyFeaturedIds={artworks.map((item: any) => item.art_id)}
      />

      <EditEventBottomSheet
        isOpen={editOpen}
        event={event}
        isSaving={saveEditMutation.isPending}
        onClose={() => setEditOpen(false)}
        onSave={handleSaveEdits}
      />

    </View>
  );
}
