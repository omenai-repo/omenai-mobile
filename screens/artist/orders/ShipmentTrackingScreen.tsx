import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import tw from "twrnc";
import { getTrackingData } from "#services/orders/getTrackingData";
import BackHeaderTitle from "#components/header/BackHeaderTitle";
import { useRoute } from "@react-navigation/native";
import { useLowRiskFeatureFlag } from "#hooks/useFeatureFlag";
import TrackingDowntimeBlocker from "#components/blockers/tracking/TrackingDowntimeBlocker";
import WithModal from "#components/modal/WithModal";
import { OrderShippingDetailsTypes, TrackingEvent } from "#types/types";
import { SkeletonRow } from "./components/tracking/SkeletonRow";
import TrackingSearchBar from "./components/tracking/TrackingSearchBar";
import TrackingResult from "./components/tracking/TrackingResult";
import TrackingNoResult from "./components/tracking/TrackingNoResult";
import TrackingInitialState from "./components/tracking/TrackingInitialState";

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

export default function ShipmentTrackingScreen({ navigation }: any) {
  const { tracking_id } = useRoute<any>().params || {};
  const [trackingInput, setTrackingInput] = useState(tracking_id || "");
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!trackingInput.trim()) return;

    setIsLoading(true);
    setError("");
    setSearchAttempted(true);

    const response = await getTrackingData(trackingInput.trim());

    if (response.isOk && response.data) {
      setTrackingData(response.data);
    } else {
      setError(response.message || "Unable to find tracking information");
      setTrackingData(null);
    }

    setIsLoading(false);
  };

  const handleSearchAgain = () => {
    setTrackingInput("");
    setTrackingData(null);
    setSearchAttempted(false);
    setError("");
  };

  const { value: isTrackingEnabled, loading: isFlagLoading } =
    useLowRiskFeatureFlag("shipment_tracking_enabled");

  if (isFlagLoading) {
    return (
      <WithModal>
        <View style={tw`flex-1 bg-gray-50`}>
          <BackHeaderTitle title="Track Shipment" />
          <View style={tw`px-4 py-8`}>
            {/* Mimic search bar */}
            <SkeletonRow widthPct="100%" height={120} borderRadius={12} />
            <View style={tw`h-6`} />
            {/* Mimic content */}
            <SkeletonRow widthPct="100%" height={200} borderRadius={12} />
          </View>
        </View>
      </WithModal>
    );
  }

  if (isTrackingEnabled) {
    return (
      <WithModal>
        <View style={tw`flex-1 bg-gray-50`}>
          <BackHeaderTitle title="Track Shipment" />

          <View style={tw`flex-1`}>
            <TrackingSearchBar
              trackingInput={trackingInput}
              setTrackingInput={setTrackingInput}
              handleSearch={handleSearch}
              isLoading={isLoading}
            />

            <ScrollView
              style={tw`flex-1`}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 40 }}
            >
              {/* Tracking Results */}
              {trackingData && !isLoading && (
                <TrackingResult
                  trackingData={trackingData}
                  handleSearchAgain={handleSearchAgain}
                />
              )}

              {/* Error State */}
              {searchAttempted && !trackingData && !isLoading && (
                <TrackingNoResult
                  error={error}
                  handleSearchAgain={handleSearchAgain}
                />
              )}

              {/* Initial State */}
              {!searchAttempted && !trackingData && !isLoading && (
                <TrackingInitialState />
              )}
            </ScrollView>
          </View>
        </View>
      </WithModal>
    );
  }

  return (
    <WithModal>
      <View style={tw`flex-1 bg-gray-50`}>
        <BackHeaderTitle title="Track Shipment" />
        <TrackingDowntimeBlocker
          trackingNumber={tracking_id || trackingInput}
          externalLink="https://www.dhl.com/global-en/home/tracking.html"
          externalLinkText="Track on DHL Global Website"
        />
      </View>
    </WithModal>
  );
}
