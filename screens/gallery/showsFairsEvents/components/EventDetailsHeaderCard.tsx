import React from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import tw from "twrnc";
import { getPromotionalFileView } from "#lib/storage/getPromotionalsFileView";
import {
  GalleryEventRecord,
  toggleEventVisibility,
} from "#services/events/events.service";
import { useModalStore } from "#store/modal/modalStore";
import { useAppStore } from "#store/app/appStore";

type EventDetailsHeaderCardProps = {
  event: GalleryEventRecord;
  source: "show" | "event";
  isSavingDetails: boolean;
  isUploadingCover: boolean;
  onCoverImageChange: () => void;
  onEditClick: () => void;
};

export default function EventDetailsHeaderCard({
  event,
  source,
  isSavingDetails,
  isUploadingCover,
  onCoverImageChange,
  onEditClick,
}: EventDetailsHeaderCardProps) {
  const queryClient = useQueryClient();
  const { userSession } = useAppStore();
  const { updateModal } = useModalStore();

  const galleryId = event.gallery_id || userSession?.id || "";

  const publishMutation = useMutation({
    mutationFn: (targetStatus: boolean) =>
      toggleEventVisibility(event.event_id, galleryId, targetStatus),
    onSuccess: async (result, targetStatus) => {
      if (!result.isOk) {
        updateModal({
          showModal: true,
          modalType: "error",
          message: result.message || "Failed to update visibility.",
        });
        return;
      }
      queryClient.invalidateQueries({
        queryKey: ["eventDashboard", event.event_id],
      });
      updateModal({
        showModal: true,
        modalType: "success",
        message: targetStatus
          ? "Event is now published."
          : "Event is now unpublished.",
      });
    },
  });

  const handleTogglePublish = () => {
    if (!galleryId) {
      updateModal({
        showModal: true,
        modalType: "error",
        message: "Unable to identify your gallery account.",
      });
      return;
    }
    publishMutation.mutate(!event.is_published);
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

  let status = "Upcoming";
  let statusColor = "bg-amber-50 text-amber-700 border-amber-200";

  const now = new Date().getTime();
  const startDate = event.start_date ? new Date(event.start_date).getTime() : 0;
  const endDate = event.end_date ? new Date(event.end_date).getTime() : 0;

  if (event.is_archived) {
    status = "Archived";
    statusColor = "bg-neutral-100 text-neutral-500 border-neutral-200";
  } else if (now > endDate) {
    status = "Past";
    statusColor = "bg-neutral-100 text-neutral-600 border-neutral-300";
  } else if (now >= startDate && now <= endDate) {
    status = "Active";
    statusColor = "bg-green-50 text-green-700 border-green-200";
  }

  const hasLogisticsDetails =
    !!(event as any).vip_preview_date ||
    !!event.booth_number ||
    !!event.location?.city ||
    !!event.location?.venue ||
    !!event.external_url;

  const externalHostname = (() => {
    if (!event.external_url) return "";
    try {
      return new URL(event.external_url).hostname.replace("www.", "");
    } catch {
      return event.external_url;
    }
  })();

  return (
    <View style={tw`gap-4 mb-4`}>
      {/* Event Details Header */}
      <View style={tw`bg-white rounded-md border border-neutral-200 p-3`}>
        <View style={tw`gap-3`}>
          <View
            style={tw`w-full h-36 shrink-0 bg-neutral-50 overflow-hidden rounded-sm border border-neutral-100 relative`}
          >
            {event.cover_image ? (
              <Image
                source={{
                  uri: /^https?:\/\//i.test(event.cover_image)
                    ? event.cover_image
                    : getPromotionalFileView(event.cover_image, 1200),
                }}
                style={tw`w-full h-full`}
                resizeMode="cover"
              />
            ) : (
              <View style={tw`w-full h-full items-center justify-center`}>
                <Ionicons name="image-outline" size={24} color="#A3A3A3" />
              </View>
            )}

            <View
              style={tw`absolute inset-0 bg-black/35 items-center justify-center`}
            >
              {isUploadingCover ? (
                <View style={tw`items-center`}>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text
                    style={tw`text-[9px] uppercase tracking-widest font-medium text-white mt-1`}
                  >
                    Saving...
                  </Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={tw`px-3 py-2 bg-black/60 rounded-sm border border-white/20 flex-row items-center`}
                  activeOpacity={0.85}
                  onPress={onCoverImageChange}
                >
                  <Ionicons
                    name="cloud-upload-outline"
                    size={14}
                    color="#fff"
                  />
                  <Text
                    style={tw`text-[9px] uppercase tracking-widest font-medium text-white ml-1.5`}
                  >
                    Replace
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Event Details */}
          <View style={tw`flex-1`}>
            {/* Event Type & Status */}
            <View style={tw`flex-row items-center flex-wrap gap-2 mb-1`}>
              <View
                style={[tw`px-2 py-1 rounded-full border`, tw`${statusColor}`]}
              >
                <Text
                  style={[
                    tw`text-[9px] uppercase tracking-widest`,
                    tw`${statusColor}`,
                  ]}
                >
                  {status}
                </Text>
              </View>

              <View
                style={[
                  tw`px-2.5 py-0.5 rounded-full border`,
                  event.is_published
                    ? tw`bg-green-50 border-green-200`
                    : tw`bg-amber-50 border-amber-200`,
                ]}
              >
                <Text
                  style={[
                    tw`text-[9px] uppercase tracking-widest font-medium`,
                    event.is_published ? tw`text-green-700` : tw`text-amber-700`,
                  ]}
                >
                  {event.is_published ? "Event Published" : "Draft"}
                </Text>
              </View>

              <Text
                style={tw`text-[9px] uppercase tracking-widest text-neutral-400`}
              >
                {event.event_type.replace("_", " ")}
              </Text>
            </View>

            {/* Title & Date */}
            <Text style={tw`text-lg text-neutral-900`} numberOfLines={2}>
              {event.title}
            </Text>
            <Text style={tw`text-xs text-neutral-500 mt-1`}>
              {formatDateRange(event.start_date, event.end_date)}
            </Text>
          </View>

          {/* Quick Actions */}
          <View style={tw`flex-row gap-2`}>
            <TouchableOpacity
              style={tw`px-3 py-2 border border-neutral-300 rounded-sm`}
              activeOpacity={0.8}
              onPress={onEditClick}
              disabled={isSavingDetails}
            >
              <Text
                style={tw`text-[10px] uppercase tracking-widest text-neutral-700`}
              >
                Edit Details
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`px-3 py-2 border border-neutral-300 rounded-sm`}
              activeOpacity={0.8}
              onPress={handleTogglePublish}
              disabled={publishMutation.isPending}
            >
              <Text
                style={tw`text-[10px] uppercase tracking-widest text-neutral-700`}
              >
                {publishMutation.isPending
                  ? "Saving..."
                  : event.is_published
                    ? "Unpublish"
                    : "Publish"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`px-3 py-2 border border-neutral-300 rounded-sm flex-row items-center justify-center`}
              activeOpacity={0.8}
              onPress={() => {
                const { updateModal } = useModalStore.getState();
                if (!event.external_url) {
                  updateModal({
                    showModal: true,
                    modalType: "error",
                    message: "No public link available for this event yet.",
                  });
                  return;
                }
                Linking.openURL(event.external_url);
              }}
            >
              <Ionicons name="eye-outline" size={14} color="#525252" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 2. Dynamic Logistics & Metadata Strip */}
      <View
        style={tw`bg-white rounded-md border border-neutral-200 flex-row flex-wrap items-center`}
      >
        {/* Universal: VIP Preview Date */}
        {(event as any).vip_preview_date && (
          <View
            style={tw`flex-col px-4 py-3 border-r border-neutral-100 min-w-[42%]`}
          >
            <Text
              style={tw`text-[9px] text-neutral-400 uppercase tracking-widest mb-1 font-medium`}
            >
              VIP Access
            </Text>
            <Text style={tw`text-xs text-neutral-900`}>
              {new Date((event as any).vip_preview_date).toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                },
              )}
            </Text>
          </View>
        )}

        {event.event_type === "art_fair" && (
          <>
            {!!event.booth_number && (
              <View
                style={tw`flex-col px-4 py-3 border-r border-neutral-100 min-w-[42%]`}
              >
                <Text
                  style={tw`text-[9px] text-neutral-400 uppercase tracking-widest mb-1 font-medium`}
                >
                  Booth
                </Text>
                <Text style={tw`text-sm text-neutral-900`}>
                  {event.booth_number}
                </Text>
              </View>
            )}
            {!!event.location?.city && (
              <View
                style={tw`flex-col px-4 py-3 border-r border-neutral-100 min-w-[42%]`}
              >
                <Text
                  style={tw`text-[9px] text-neutral-400 uppercase tracking-widest mb-1 font-medium`}
                >
                  Location
                </Text>
                <Text style={tw`text-sm text-neutral-900`}>
                  {event.location.city}
                  {event.location.country ? `, ${event.location.country}` : ""}
                </Text>
              </View>
            )}
          </>
        )}

        {event.event_type === "exhibition" && (
          <>
            {!!event.location?.venue && (
              <View
                style={tw`flex-col px-4 py-3 border-r border-neutral-100 min-w-[42%]`}
              >
                <Text
                  style={tw`text-[9px] text-neutral-400 uppercase tracking-widest mb-1 font-medium`}
                >
                  Venue
                </Text>
                <Text style={tw`text-sm text-neutral-900`}>
                  {event.location.venue}
                </Text>
              </View>
            )}
            {!!event.location?.city && (
              <View
                style={tw`flex-col px-4 py-3 border-r border-neutral-100 min-w-[42%]`}
              >
                <Text
                  style={tw`text-[9px] text-neutral-400 uppercase tracking-widest mb-1 font-medium`}
                >
                  City
                </Text>
                <Text style={tw`text-sm text-neutral-900`}>
                  {event.location.city}
                  {event.location.country ? `, ${event.location.country}` : ""}
                </Text>
              </View>
            )}
          </>
        )}

        {event.event_type === "viewing_room" && !!event.external_url && (
          <View
            style={tw`flex-col px-4 py-3 border-r border-neutral-100 min-w-[42%]`}
          >
            <Text
              style={tw`text-[9px] text-neutral-400 uppercase tracking-widest mb-1 font-medium`}
            >
              External Link
            </Text>
            <TouchableOpacity
              onPress={() => Linking.openURL(event.external_url as string)}
              activeOpacity={0.8}
            >
              <Text
                numberOfLines={1}
                style={tw`text-sm text-neutral-900 underline`}
              >
                {externalHostname}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {!hasLogisticsDetails && (
          <View style={tw`p-3`}>
            <Text style={tw`text-[10px] italic text-neutral-400`}>
              No additional logistics details provided. Click Edit Details to
              add.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
