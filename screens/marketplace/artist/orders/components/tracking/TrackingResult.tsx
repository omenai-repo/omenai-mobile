import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import tw from "twrnc";
import { colors } from "#config/colors.config";
import { getImageFileView } from "#lib/storage/getImageFileView";
import ShipmentDetails from "./ShipmentDetails";
import TrackingTimeline from "./TrackingTimeline";
import LongBlackButton from "#components/buttons/LongBlackButton";

export interface TrackingEvent {
  timestamp: string;
  location: string;
  description: string;
  status_label: string;
}

export interface TrackingData {
  tracking_number: string;
  carrier: string;
  current_status: string;
  estimated_delivery: string;
  events: TrackingEvent[];
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
  const image = trackingData.artwork_data?.url
    ? getImageFileView(trackingData.artwork_data.url, 300)
    : "";

  return (
    <View style={tw`pb-6 gap-4`}>
      <View>
        <View
          style={tw`bg-white rounded-sm pt-4 pb-2 ${
            trackingData.artwork_data ? "flex-row items-center" : ""
          }`}
        >
          {trackingData.artwork_data &&
            (image ? (
              <Image source={{ uri: image }} style={tw`w-16 h-16 rounded-sm`} />
            ) : (
              <View style={tw`w-16 h-16 rounded-sm bg-gray-200`} />
            ))}

          <View style={tw`${trackingData.artwork_data ? "ml-4 flex-1" : ""}`}>
            {trackingData.artwork_data && (
              <Text style={tw`text-black font-sans-medium text-base`}>
                {trackingData.artwork_data.title}
              </Text>
            )}

            <Text
              style={tw`text-gray-500 text-base font-sans-regular ${
                trackingData.artwork_data ? "mt-1" : ""
              }`}
            >
              Tracking Number
            </Text>
            <Text
              style={tw`text-[${colors.black}] font-sans-semibold ${
                trackingData.artwork_data ? "text-base" : "text-xl"
              }`}
            >
              #{trackingData.tracking_number}
            </Text>
          </View>
        </View>

        <ShipmentDetails
          shippingDetails={trackingData.shipping_details}
          carrier={trackingData.carrier}
          currentStatus={trackingData.current_status}
          estimatedDelivery={trackingData.estimated_delivery}
        />
      </View>

      <TrackingTimeline events={trackingData.events ?? []} />

      <LongBlackButton
        outline
        value="Search Another Shipment"
        onClick={handleSearchAgain}
      />
    </View>
  );
}
