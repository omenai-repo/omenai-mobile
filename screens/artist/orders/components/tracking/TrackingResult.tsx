import React, { useState } from "react";
import { View, Text, ScrollView, Image, Pressable } from "react-native";
import tw from "twrnc";
import { SvgXml } from "react-native-svg";
import { locationIcon } from "#utils/SvgImages";
import { getImageFileView } from "#lib/storage/getImageFileView";

export interface TrackingData {
  tracking_number: string;
  carrier: string;
  current_status: string;
  estimated_delivery: string;
  events: {
    timestamp: string;
    location: string;
    description: string;
    status_label: string;
  }[];
  shipping_details: OrderShippingDetailsTypes;
  artwork_data?: {
    title: string;
    url: string;
  };
  order_date?: string;
}

interface TrackingResultProps {
  trackingData: TrackingData;
  handleSearchAgain: () => void;
}

export default function TrackingResult({
  trackingData,
  handleSearchAgain,
}: Readonly<TrackingResultProps>) {
  const [showAllEvents, setShowAllEvents] = useState(false);

  const formatTimestamp = (isoString?: string): string => {
    if (!isoString) return "TBD";
    const date = new Date(isoString);

    if (Number.isNaN(date.getTime())) {
      return "N/A";
    }

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const image = trackingData?.artwork_data?.url
    ? getImageFileView(trackingData.artwork_data.url, 300)
    : "";

  // events: raw data is usually chronological, we reverse it to show newest first
  const events = [...(trackingData?.events ?? [])].reverse();
  const eventsCount = events.length;
  const lastNEvents = events.slice(0, 5);

  const primaryEventsToShow = showAllEvents ? events : lastNEvents;

  return (
    <View style={tw`px-4 pb-8 space-y-4`}>
      {/* Artwork Card */}
      {trackingData.artwork_data ? (
        <View style={tw`bg-white rounded-md px-4 py-3 flex-row items-center`}>
          {image ? (
            <Image source={{ uri: image }} style={tw`w-16 h-16 rounded-md`} />
          ) : (
            <View style={tw`w-16 h-16 rounded-md bg-gray-200`} />
          )}
          <View style={tw`ml-4 flex-1`}>
            <Text style={tw`text-black font-semibold text-base`}>
              {trackingData.artwork_data.title}
            </Text>
            <Text style={tw`text-gray-500 text-[14px] font-medium mt-1`}>
              Tracking Number
            </Text>
            <Text style={tw`text-black text-[14px] font-bold`}>
              #{trackingData.tracking_number}
            </Text>
          </View>
        </View>
      ) : (
        <View style={tw`bg-white rounded-md px-4 py-3`}>
          <Text style={tw`text-gray-500 text-[14px] font-medium`}>
            Tracking Number
          </Text>
          <Text style={tw`text-black text-lg font-bold`}>
            #{trackingData.tracking_number}
          </Text>
        </View>
      )}

      {/* Shipment Details */}
      <View style={tw`bg-white rounded-md p-4 space-y-3`}>
        <View style={tw`flex-row justify-between items-start mb-[10px]`}>
          <View style={tw`flex-1 pr-2`}>
            <Text style={tw`text-gray-500 text-[14px] font-medium`}>
              Origin
            </Text>
            <Text style={tw`text-black text-sm font-semibold mt-1`}>
              {trackingData.shipping_details?.addresses.origin.city},{" "}
              {trackingData.shipping_details?.addresses.origin.country}
            </Text>
          </View>
          <View style={tw`flex-1 pl-2 items-end`}>
            <Text style={tw`text-gray-500 text-[14px] font-medium`}>
              Destination
            </Text>
            <Text style={tw`text-black text-sm font-semibold mt-1`}>
              {trackingData.shipping_details?.addresses.destination.city},{" "}
              {trackingData.shipping_details?.addresses.destination.country}
            </Text>
          </View>
        </View>

        <View style={tw`flex-row justify-between items-center mb-[10px]`}>
          <View>
            <Text style={tw`text-gray-500 text-[14px] font-medium`}>
              Carrier
            </Text>
            <Text style={tw`text-black text-sm font-semibold mt-1`}>
              {trackingData.carrier || "N/A"}
            </Text>
          </View>

          <View style={tw`items-end`}>
            <Text style={tw`text-gray-500 text-[14px] font-medium`}>
              Status
            </Text>
            <Text style={tw`text-blue-600 text-sm font-bold mt-1 uppercase`}>
              {(trackingData.current_status || "Processing").replaceAll(
                "_",
                " ",
              )}
            </Text>
          </View>
        </View>

        <View style={tw`gap-[10px]`}>
          <View>
            <Text style={tw`text-gray-500 text-[14px] font-medium`}>
              Estimated Delivery
            </Text>
            <Text style={tw`text-black text-sm font-semibold mt-1`}>
              {formatTimestamp(trackingData.estimated_delivery)}
            </Text>
          </View>
        </View>
      </View>

      {/* Timeline */}
      <View style={tw`bg-white rounded-md p-4`}>
        <Text style={tw`text-black font-semibold text-base mb-4`}>
          Tracking History
        </Text>

        <ScrollView
          style={{ maxHeight: 300 }}
          contentContainerStyle={{ paddingBottom: 8 }}
          nestedScrollEnabled
        >
          {primaryEventsToShow.length === 0 && (
            <Text style={tw`text-gray-500 text-sm`}>
              No tracking events available.
            </Text>
          )}

          {primaryEventsToShow.map((event, idx) => {
            const isMostRecent = idx === 0;

            return (
              <View
                key={`${idx}-${event.timestamp}`}
                style={tw`mb-${idx === eventsCount - 1 ? "0" : "6"}`}
              >
                <View style={tw`flex-row items-center gap-4`}>
                  <View
                    style={tw`h-10 w-10 ${
                      isMostRecent ? "bg-blue-600" : "bg-gray-100"
                    } rounded-full justify-center items-center`}
                  >
                    <SvgXml
                      xml={locationIcon}
                      width={20}
                      height={20}
                      fill={isMostRecent ? "#fff" : "#999"}
                    />
                  </View>
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-black text-sm font-semibold`}>
                      {event.description}
                    </Text>
                    <View style={tw`flex-row items-center gap-2 mt-1`}>
                      <Text style={tw`text-gray-500 text-[13px] font-medium`}>
                        {formatTimestamp(event.timestamp)}
                      </Text>
                      {!!event.location && (
                        <Text style={tw`text-gray-400 text-[13px]`}>
                          • {event.location}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
                {idx < primaryEventsToShow.length - 1 && (
                  <View style={tw`ml-5 my-2 gap-1`}>
                    <View style={tw`h-2 bg-gray-200 w-0.5`} />
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>

        {/* Show more / show less button */}
        {eventsCount > 5 && (
          <View style={tw`mt-2`}>
            <Pressable
              onPress={() => setShowAllEvents((s) => !s)}
              style={tw`items-center justify-center py-3`}
            >
              <Text style={tw`text-slate-800 font-semibold`}>
                {showAllEvents
                  ? "Show less"
                  : `Show more (${eventsCount - 5} more)`}
              </Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* Search Another Shipment */}
      <Pressable
        onPress={handleSearchAgain}
        style={tw`bg-white rounded-md py-3 items-center justify-center border border-gray-200 mb-4`}
      >
        <Text style={tw`text-slate-900 font-semibold text-base`}>
          Search Another Shipment
        </Text>
      </Pressable>
    </View>
  );
}
