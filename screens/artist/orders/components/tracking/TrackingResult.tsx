import React, { useState } from "react";
import { View, Text, ScrollView, Image, Pressable } from "react-native";
import tw from "twrnc";
import { SvgXml } from "react-native-svg";
import { OrderShippingDetailsTypes, TrackingEvent } from "#types/types";
import { locationIcon } from "#utils/SvgImages";
import { getImageFileView } from "#lib/storage/getImageFileView";
import { formatEventDate } from "#utils/utils_formatEventDate";

interface TrackingData {
  artwork_data: {
    title: string;
    url: string;
  };
  tracking_number: string;
  events: TrackingEvent[];
  order_date: string;
  shipping_details: OrderShippingDetailsTypes & {
    shipment_information: OrderShippingDetailsTypes["shipment_information"] & {
      planned_shipping_date: string;
    };
  };
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

  const formatTimestamp = (isoString: string): string => {
    const cleanedString = isoString.replace(" GMT", "");
    const date = new Date(cleanedString);

    if (Number.isNaN(date.getTime())) {
      return "Error: Invalid Date could not be parsed.";
    }

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const image = trackingData?.artwork_data?.url
    ? getImageFileView(trackingData.artwork_data.url, 300)
    : "";

  // events: assume chronological (oldest -> newest); the most recent is last element
  const events = [...(trackingData?.events ?? [])].reverse();
  const eventsCount = events.length;
  const lastNEvents = events.slice(0, 5);

  const primaryEventsToShow = showAllEvents ? events : lastNEvents;

  return (
    <View style={tw`px-4 pb-8 space-y-4`}>
      {/* Artwork Card */}
      {trackingData.artwork_data && (
        <View style={tw`bg-white rounded-2xl px-4 py-3 flex-row items-center`}>
          {image ? (
            <Image source={{ uri: image }} style={tw`w-16 h-16 rounded-lg`} />
          ) : (
            <View style={tw`w-16 h-16 rounded-lg bg-gray-200`} />
          )}
          <View style={tw`ml-4 flex-1`}>
            <Text style={tw`text-black font-semibold text-base`}>
              {trackingData.artwork_data.title}
            </Text>
            <Text style={tw`text-gray-500 text-[16px] font-medium mt-1`}>
              Tracking Number
            </Text>
            <Text style={tw`text-black text-[16px] font-bold`}>
              #{trackingData.tracking_number}
            </Text>
          </View>
        </View>
      )}

      {/* Shipment Details */}
      <View style={tw`bg-white rounded-2xl p-4 space-y-3`}>
        <View style={tw`flex-row justify-between items-start mb-[10px]`}>
          <View style={tw`flex-1 pr-2`}>
            <Text style={tw`text-gray-500 text-[16px] font-medium`}>
              Origin Address
            </Text>
            <Text style={tw`text-black text-sm font-semibold mt-1`}>
              {trackingData.shipping_details?.addresses.origin.address_line ||
                "N/A"}
            </Text>
          </View>
          <View style={tw`flex-1 pl-2 items-end`}>
            <Text style={tw`text-gray-500 text-[16px] font-medium`}>
              Destination Address
            </Text>
            <Text style={tw`text-black text-sm font-semibold mt-1`}>
              {trackingData.shipping_details?.addresses.destination
                .address_line || "N/A"}
            </Text>
          </View>
        </View>

        <View style={tw`flex-row justify-between items-center mb-[10px]`}>
          <View>
            <Text style={tw`text-gray-500 text-[16px] font-medium`}>
              Carrier
            </Text>
            <Text style={tw`text-black text-sm font-semibold mt-1`}>
              {trackingData.shipping_details?.shipment_information?.carrier ||
                "DHL Express"}
            </Text>
          </View>

          <View style={tw`items-end`}>
            <Text style={tw`text-gray-500 text-[16px] font-medium`}>
              Status
            </Text>
            <Text style={tw`text-blue-600 text-sm font-semibold mt-1`}>
              In Transit
            </Text>
          </View>
        </View>

        <View style={tw`gap-[10px]`}>
          <View>
            <Text style={tw`text-gray-500 text-[16px] font-medium`}>
              Estimated delivery date
            </Text>
            <Text style={tw`text-black text-sm font-semibold mt-1`}>
              {formatTimestamp(
                trackingData?.shipping_details?.shipment_information
                  ?.planned_shipping_date,
              ) || "TBD"}
            </Text>
          </View>

          <View style={tw``}>
            <Text style={tw`text-gray-500 text-[16px] font-medium`}>
              Order date
            </Text>
            <Text style={tw`text-black text-sm font-semibold mt-1`}>
              {trackingData.order_date || "N/A"}
            </Text>
          </View>
        </View>
      </View>

      {/* Timeline */}
      <View style={tw`bg-white rounded-2xl p-4`}>
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
            const originalIndex = events.indexOf(event);
            const isMostRecent = originalIndex === 0;

            return (
              <View
                key={`${originalIndex}-${idx}`}
                style={tw`mb-${originalIndex === eventsCount - 1 ? "0" : "6"}`}
              >
                <View style={tw`flex-row items-center gap-4`}>
                  <View
                    style={tw`h-10 w-10 ${
                      isMostRecent ? "bg-blue-100" : "bg-gray-100"
                    } rounded-full justify-center items-center`}
                  >
                    <SvgXml xml={locationIcon} width={20} height={20} />
                  </View>
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-black text-sm font-semibold`}>
                      {event.description}
                    </Text>
                    <Text
                      style={tw`text-gray-500 text-[16px] font-medium mt-1`}
                    >
                      {formatEventDate(`${event.date} ${event.time}`)}
                    </Text>
                  </View>
                </View>
                {originalIndex < eventsCount - 1 && (
                  <View style={tw`ml-5 my-2 gap-1`}>
                    <View style={tw`h-2 bg-gray-300 w-0.5`} />
                    <View style={tw`h-2 bg-gray-300 w-0.5`} />
                    <View style={tw`h-2 bg-gray-300 w-0.5`} />
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
        style={tw`bg-white rounded-xl py-3 items-center justify-center border border-gray-200 mb-4`}
      >
        <Text style={tw`text-slate-900 font-semibold text-base`}>
          Search Another Shipment
        </Text>
      </Pressable>
    </View>
  );
}
