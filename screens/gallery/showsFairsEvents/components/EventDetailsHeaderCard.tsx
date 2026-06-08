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
  readonly event: GalleryEventRecord;
  readonly source: "show" | "event";
  readonly isSavingDetails: boolean;
  readonly isUploadingCover: boolean;
  readonly isRefreshingData?: boolean;
  readonly onCoverImageChange: () => void;
  readonly onEditClick: () => void;
};

// ─── Pure helpers ────────────────────────────────────────────────────────────
function normaliseEventType(raw: string): string {
  const slug = raw
    .toLowerCase()
    .trim()
    .replaceAll(/[-\s]+/g, "_");
  if (slug === "artfair") return "art_fair";
  if (slug === "viewingroom") return "viewing_room";
  return slug;
}

function deriveStatus(
  event: GalleryEventRecord,
): "Upcoming" | "Active" | "Past" | "Archived" {
  const now = Date.now();
  const start = event.start_date ? new Date(event.start_date).getTime() : 0;
  const end = event.end_date ? new Date(event.end_date).getTime() : 0;

  if (event.is_archived) return "Archived";
  if (end && now > end) return "Past";
  if (start && now >= start && (!end || now <= end)) return "Active";
  return "Upcoming";
}

function formatDateRange(startDate?: string, endDate?: string): string {
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
}

function parseHostname(url: string): string {
  try {
    return new URL(url).hostname.replaceAll("www.", "");
  } catch {
    return url;
  }
}

// ─── Logistics row sub-component ─────────────────────────────────────────────

type LogisticsRowProps = { label: string; children: React.ReactNode };

function LogisticsRow({ label, children }: Readonly<LogisticsRowProps>) {
  return (
    <View
      style={tw`flex-col px-4 py-3 border-r border-neutral-100 min-w-[42%]`}
    >
      <Text
        style={tw`text-[9px] text-neutral-400 uppercase tracking-widest mb-1 font-medium`}
      >
        {label}
      </Text>
      {children}
    </View>
  );
}

// ─── Logistics strip ─────────────────────────────────────────────────────────
type LogisticsStripProps = {
  event: GalleryEventRecord;
  eventType: string;
  hasLogisticsDetails: boolean;
  externalHostname: string;
};

function LogisticsStrip({
  event,
  eventType,
  hasLogisticsDetails,
  externalHostname,
}: Readonly<LogisticsStripProps>) {
  const vipDate = (event as any).vip_preview_date;

  return (
    <View
      style={tw`bg-white rounded-sm border border-neutral-200 flex-row flex-wrap items-center`}
    >
      {vipDate && (
        <LogisticsRow label="VIP Access">
          <Text style={tw`text-xs text-neutral-900`}>
            {new Date(vipDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </Text>
        </LogisticsRow>
      )}

      {eventType === "art_fair" && (
        <>
          {!!event.booth_number && (
            <LogisticsRow label="Booth">
              <Text style={tw`text-sm text-neutral-900`}>
                {event.booth_number}
              </Text>
            </LogisticsRow>
          )}
          {!!event.location?.city && (
            <LogisticsRow label="Location">
              <Text style={tw`text-sm text-neutral-900`}>
                {event.location.city}
                {event.location.country ? `, ${event.location.country}` : ""}
              </Text>
            </LogisticsRow>
          )}
        </>
      )}

      {eventType === "exhibition" && (
        <>
          {!!event.location?.venue && (
            <LogisticsRow label="Venue">
              <Text style={tw`text-sm text-neutral-900`}>
                {event.location.venue}
              </Text>
            </LogisticsRow>
          )}
          {!!event.location?.city && (
            <LogisticsRow label="City">
              <Text style={tw`text-sm text-neutral-900`}>
                {event.location.city}
                {event.location.country ? `, ${event.location.country}` : ""}
              </Text>
            </LogisticsRow>
          )}
        </>
      )}

      {eventType === "viewing_room" && !!event.external_url && (
        <LogisticsRow label="External Link">
          <TouchableOpacity
            onPress={() => {
              if (event.external_url) Linking.openURL(event.external_url);
            }}
            activeOpacity={0.8}
          >
            <Text
              numberOfLines={1}
              style={tw`text-sm text-neutral-900 underline`}
            >
              {externalHostname}
            </Text>
          </TouchableOpacity>
        </LogisticsRow>
      )}

      {!hasLogisticsDetails && (
        <View style={tw`p-3`}>
          <Text style={tw`text-[10px] italic text-neutral-400`}>
            No additional logistics details provided. Click Edit Details to add.
          </Text>
        </View>
      )}
    </View>
  );
}

// ─── Cover image area ─────────────────────────────────────────────────────────
type CoverImageProps = {
  coverImage?: string;
  isUploadingCover: boolean;
  onCoverImageChange: () => void;
};

function CoverImage({
  coverImage,
  isUploadingCover,
  onCoverImageChange,
}: Readonly<CoverImageProps>) {
  const uri = coverImage
    ? /^https?:\/\//i.test(coverImage)
      ? coverImage
      : getPromotionalFileView(coverImage, 1200)
    : null;

  return (
    <View
      style={tw`w-full h-36 shrink-0 bg-neutral-50 overflow-hidden rounded-sm border border-neutral-100 relative`}
    >
      {uri ? (
        <Image source={{ uri }} style={tw`w-full h-full`} resizeMode="cover" />
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
            <Ionicons name="cloud-upload-outline" size={14} color="#fff" />
            <Text
              style={tw`text-[9px] uppercase tracking-widest font-medium text-white ml-1.5`}
            >
              Replace
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// ─── Status palettes ──────────────────────────────────────────────────────────

const STATUS_PALETTE: Record<
  "Upcoming" | "Active" | "Past" | "Archived",
  { bg: string; border: string; text: string }
> = {
  Upcoming: { bg: "#FFFBEB", border: "#FDE68A", text: "#B45309" },
  Active: { bg: "#F0FDF4", border: "#BBF7D0", text: "#15803D" },
  Past: { bg: "#F5F5F5", border: "#D4D4D4", text: "#525252" },
  Archived: { bg: "#F5F5F5", border: "#E5E5E5", text: "#737373" },
};

// ─── Main component ───────────────────────────────────────────────────────────

function EventDetailsHeaderCardImpl({
  event,
  source,
  isSavingDetails,
  isUploadingCover,
  isRefreshingData = false,
  onCoverImageChange,
  onEditClick,
}: Readonly<EventDetailsHeaderCardProps>) {
  const queryClient = useQueryClient();
  const { userSession } = useAppStore();
  const { updateModal } = useModalStore();

  const galleryId = event.gallery_id || userSession?.id || "";
  const eventType = normaliseEventType(
    String((event as any)?.event_type || ""),
  );
  const eventTypeLabel = eventType
    ? eventType.replaceAll("_", " ")
    : "presentation";
  const eventTitle =
    String(event?.title || "").trim() || "Untitled Presentation";
  const publishedLabel = event?.is_published ? "Event Published" : "Draft";

  const showHeaderPlaceholder =
    isRefreshingData &&
    !event?.title &&
    !event?.event_type &&
    !event?.start_date &&
    !event?.end_date;

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

  const handleViewExternal = () => {
    if (!event.external_url) {
      updateModal({
        showModal: true,
        modalType: "error",
        message: "No public link available for this event yet.",
      });
      return;
    }
    Linking.openURL(event.external_url);
  };

  const status = deriveStatus(event);
  const statusStyle = STATUS_PALETTE[status];
  const publishedPalette = event?.is_published
    ? { bg: "#F0FDF4", border: "#BBF7D0", text: "#15803D" }
    : { bg: "#FFFBEB", border: "#FDE68A", text: "#B45309" };

  const hasLogisticsDetails =
    !!(event as any).vip_preview_date ||
    !!event.booth_number ||
    !!event.location?.city ||
    !!event.location?.venue ||
    !!event.external_url;

  const externalHostname = event.external_url
    ? parseHostname(event.external_url)
    : "";

  if (showHeaderPlaceholder) {
    return (
      <View style={tw`gap-4 mb-4`}>
         <View style={tw`bg-white rounded-sm border border-neutral-200 p-3`}>
          <View style={tw`h-36 bg-neutral-100 rounded-sm mb-3`} />
          <View style={tw`items-center py-3`}>
            <ActivityIndicator size="small" color="#737373" />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={tw`gap-4 mb-4`}>
      {/* Event Details Header */}
      <View style={tw`bg-white rounded-sm border border-neutral-200 p-3`}>
        <View style={tw`gap-3`}>
          <CoverImage
            coverImage={event.cover_image}
            isUploadingCover={isUploadingCover}
            onCoverImageChange={onCoverImageChange}
          />

          {/* Event Details */}
          <View>
            {/* Event Type & Status */}
            <View style={tw`flex-row items-center flex-wrap gap-2 mb-1`}>
              <View
                style={[
                  tw`px-2 py-1 rounded-full border`,
                  {
                    backgroundColor: statusStyle.bg,
                    borderColor: statusStyle.border,
                  },
                ]}
              >
                <Text
                  style={[
                    tw`text-[9px] uppercase tracking-widest`,
                    { color: statusStyle.text },
                  ]}
                >
                  {status}
                </Text>
              </View>

              <View
                style={[
                  tw`px-2.5 py-0.5 rounded-full border`,
                  {
                    backgroundColor: publishedPalette.bg,
                    borderColor: publishedPalette.border,
                  },
                ]}
              >
                <Text
                  style={[
                    tw`text-[9px] uppercase tracking-widest font-medium`,
                    { color: publishedPalette.text },
                  ]}
                >
                  {publishedLabel}
                </Text>
              </View>

              <Text
                style={tw`text-[9px] uppercase tracking-widest text-neutral-400`}
              >
                {eventTypeLabel}
              </Text>
            </View>

            {/* Title & Date */}
            <Text style={tw`text-lg text-neutral-900`} numberOfLines={2}>
              {eventTitle}
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
              onPress={handleViewExternal}
            >
              <Ionicons name="eye-outline" size={14} color="#525252" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Dynamic Logistics & Metadata Strip */}
      <LogisticsStrip
        event={event}
        eventType={eventType}
        hasLogisticsDetails={hasLogisticsDetails}
        externalHostname={externalHostname}
      />
    </View>
  );
}

export default function EventDetailsHeaderCard(
  props: Readonly<EventDetailsHeaderCardProps>,
) {
  return <EventDetailsHeaderCardImpl {...props} />;
}
