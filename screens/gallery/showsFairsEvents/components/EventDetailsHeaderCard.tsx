import React from "react";
import { ActivityIndicator, Alert, Image, Linking, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import { getPromotionalFileView } from "#lib/storage/getPromotionalsFileView";
import { GalleryEventRecord, getEventStatus } from "#services/events/events.service";

type EventDetailsHeaderCardProps = {
  event: GalleryEventRecord;
  isPublished: boolean;
  isSavingDetails: boolean;
  isTogglingPublish: boolean;
  isUploadingCover: boolean;
  onCoverImageChange: () => void;
  onEditClick: () => void;
  onTogglePublish: () => void;
};

export default function EventDetailsHeaderCard({
  event,
  isPublished,
  isSavingDetails,
  isTogglingPublish,
  isUploadingCover,
  onCoverImageChange,
  onEditClick,
  onTogglePublish,
}: EventDetailsHeaderCardProps) {
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

  const resolvedStatus = event.is_archived
    ? "Archived"
    : getEventStatus(event.start_date, event.end_date);
  const externalUrl = event.external_url;
  const vipPreviewDate = (event as any)?.vip_preview_date as string | undefined;
  const boothNumber = event.booth_number;
  const location = event.location;
  const coverImage = event.cover_image;

  const statusContainerStyles = (() => {
    switch (resolvedStatus) {
      case "Archived":
        return tw`bg-neutral-100 border-neutral-200`;
      case "Past":
        return tw`bg-neutral-100 border-neutral-300`;
      case "Active":
        return tw`bg-green-50 border-green-200`;
      default:
        return tw`bg-amber-50 border-amber-200`;
    }
  })();

  const statusTextStyles = (() => {
    switch (resolvedStatus) {
      case "Archived":
        return tw`text-neutral-500`;
      case "Past":
        return tw`text-neutral-600`;
      case "Active":
        return tw`text-green-700`;
      default:
        return tw`text-amber-700`;
    }
  })();

  const publishContainerStyles = isPublished
    ? tw`bg-green-50 border-green-200`
    : tw`bg-amber-50 border-amber-200`;
  const publishTextStyles = isPublished ? tw`text-green-700` : tw`text-amber-700`;

  const hasLogisticsDetails =
    !!vipPreviewDate ||
    !!boothNumber ||
    !!location?.city ||
    !!location?.venue ||
    !!externalUrl;

  const externalHostname = (() => {
    if (!externalUrl) return "";
    try {
      return new URL(externalUrl).hostname.replace("www.", "");
    } catch {
      return externalUrl;
    }
  })();

  return (
    <View style={tw`gap-4 mb-4`}>
      {/* Event Details Header */}
      <View style={tw`bg-white rounded-md border border-neutral-200 p-3`}>
        <View style={tw`gap-3`}>
          <View style={tw`w-full h-36 shrink-0 bg-neutral-50 overflow-hidden rounded-sm border border-neutral-100 relative`}>
            {coverImage ? (
              <Image
                source={{
                  uri: /^https?:\/\//i.test(coverImage)
                    ? coverImage
                    : getPromotionalFileView(coverImage, 1200),
                }}
                style={tw`w-full h-full`}
                resizeMode="cover"
              />
            ) : (
              <View style={tw`w-full h-full items-center justify-center`}>
                <Ionicons name="image-outline" size={24} color="#A3A3A3" />
              </View>
            )}

            <View style={tw`absolute inset-0 bg-black/35 items-center justify-center`}>
              {isUploadingCover ? (
                <View style={tw`items-center`}>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={tw`text-[9px] uppercase tracking-widest font-medium text-white mt-1`}>
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
                  <Text style={tw`text-[9px] uppercase tracking-widest font-medium text-white ml-1.5`}>
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
              <View style={[tw`px-2 py-1 rounded-full border`, statusContainerStyles]}>
                <Text style={[tw`text-[9px] uppercase tracking-widest`, statusTextStyles]}>
                  {resolvedStatus}
                </Text>
              </View>

              <View style={[tw`px-2.5 py-0.5 rounded-full border`, publishContainerStyles]}>
                <Text style={[tw`text-[9px] uppercase tracking-widest font-medium`, publishTextStyles]}>
                  {isPublished ? "Event Published" : "Draft"}
                </Text>
              </View>

              <Text style={tw`text-[9px] uppercase tracking-widest text-neutral-400`}>
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
              <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-700`}>Edit Details</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`px-3 py-2 border border-neutral-300 rounded-sm`}
              activeOpacity={0.8}
              onPress={onTogglePublish}
              disabled={isTogglingPublish}
            >
              <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-700`}>
                {isTogglingPublish ? "Saving..." : isPublished ? "Unpublish" : "Publish"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`px-3 py-2 border border-neutral-300 rounded-sm flex-row items-center justify-center`}
              activeOpacity={0.8}
              onPress={() => {
                if (!externalUrl) {
                  Alert.alert("Preview", "No public link available for this event yet.");
                  return;
                }
                Linking.openURL(externalUrl);
              }}
            >
              <Ionicons name="eye-outline" size={14} color="#525252" />
            </TouchableOpacity>
          </View>

        </View>
      </View>

      {/* 2. Dynamic Logistics & Metadata Strip */}
      <View style={tw`bg-white rounded-md border border-neutral-200 flex-row flex-wrap items-center`}>
        {/* Universal: VIP Preview Date */}
        {vipPreviewDate && (
          <View style={tw`flex-col px-4 py-3 border-r border-neutral-100 min-w-[42%]`}>
            <Text style={tw`text-[9px] text-neutral-400 uppercase tracking-widest mb-1 font-medium`}>
              VIP Access
            </Text>
            <Text style={tw`text-xs text-neutral-900`}>
              {new Date(vipPreviewDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </Text>
          </View>
        )}

        {event.event_type === "art_fair" && (
          <>
            {!!boothNumber && (
              <View style={tw`flex-col px-4 py-3 border-r border-neutral-100 min-w-[42%]`}>
                <Text style={tw`text-[9px] text-neutral-400 uppercase tracking-widest mb-1 font-medium`}>
                  Booth
                </Text>
                <Text style={tw`text-sm text-neutral-900`}>{boothNumber}</Text>
              </View>
            )}
            {!!location?.city && (
              <View style={tw`flex-col px-4 py-3 border-r border-neutral-100 min-w-[42%]`}>
                <Text style={tw`text-[9px] text-neutral-400 uppercase tracking-widest mb-1 font-medium`}>
                  Location
                </Text>
                <Text style={tw`text-sm text-neutral-900`}>
                  {location.city}
                  {location.country ? `, ${location.country}` : ""}
                </Text>
              </View>
            )}
          </>
        )}

        {event.event_type === "exhibition" && (
          <>
            {!!location?.venue && (
              <View style={tw`flex-col px-4 py-3 border-r border-neutral-100 min-w-[42%]`}>
                <Text style={tw`text-[9px] text-neutral-400 uppercase tracking-widest mb-1 font-medium`}>
                  Venue
                </Text>
                <Text style={tw`text-sm text-neutral-900`}>{location.venue}</Text>
              </View>
            )}
            {!!location?.city && (
              <View style={tw`flex-col px-4 py-3 border-r border-neutral-100 min-w-[42%]`}>
                <Text style={tw`text-[9px] text-neutral-400 uppercase tracking-widest mb-1 font-medium`}>
                  City
                </Text>
                <Text style={tw`text-sm text-neutral-900`}>
                  {location.city}
                  {location.country ? `, ${location.country}` : ""}
                </Text>
              </View>
            )}
          </>
        )}

        {event.event_type === "viewing_room" && !!externalUrl && (
          <View style={tw`flex-col px-4 py-3 border-r border-neutral-100 min-w-[42%]`}>
            <Text style={tw`text-[9px] text-neutral-400 uppercase tracking-widest mb-1 font-medium`}>
              External Link
            </Text>
            <TouchableOpacity onPress={() => Linking.openURL(externalUrl)} activeOpacity={0.8}>
              <Text numberOfLines={1} style={tw`text-sm text-neutral-900 underline`}>
                {externalHostname}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {!hasLogisticsDetails && (
          <View style={tw`p-3`}>
            <Text style={tw`text-[10px] italic text-neutral-400`}>
              No additional logistics details provided. Click Edit Details to add.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
