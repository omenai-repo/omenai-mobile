import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import tw from "twrnc";
import { colors } from "#config/colors.config";
import type { TrackingEvent } from "./TrackingResult";

interface TrackingTimelineProps {
  events: TrackingEvent[];
}

export default function TrackingTimeline({
  events,
}: Readonly<TrackingTimelineProps>) {
  const [showAllEvents, setShowAllEvents] = useState(false);

  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return "TBD";

    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) return "N/A";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} at ${hours}:${minutes}`;
  };

  const newestEventsFirst = [...events].reverse();
  const eventsToShow = showAllEvents
    ? newestEventsFirst
    : newestEventsFirst.slice(0, 5);

  return (
    <View style={tw`py-4`}>
      <Text
        style={tw`text-[${colors.black}] font-sans-semibold text-base mb-4`}
      >
        Tracking History
      </Text>

      <View style={{ paddingBottom: 8 }}>
        {eventsToShow.length === 0 && (
          <Text style={tw`text-gray-500 text-sm`}>
            No tracking events available.
          </Text>
        )}

        {eventsToShow.map((event, index) => {
          const isMostRecent = index === 0;

          return (
            <View
              key={`${index}-${event.timestamp}`}
              style={tw`flex-row gap-4`}
            >
              <View style={tw`items-center`}>
                <View
                  style={tw`h-6 w-6 ${
                    isMostRecent ? `bg-[${colors.black}]` : "bg-gray-100"
                  } rounded-sm justify-center items-center`}
                >
                  {isMostRecent ? (
                    <MaterialCommunityIcons
                      name="truck-delivery-outline"
                      size={12}
                      color="#fff"
                    />
                  ) : (
                    <FontAwesome6 name="location-dot" size={12} color="#999" />
                  )}
                </View>
                {index < eventsToShow.length - 1 && (
                  <View style={tw`w-0.5 flex-1 bg-gray-200 my-1`} />
                )}
              </View>

              <View
                style={tw`flex-1 pb-${
                  index === eventsToShow.length - 1 ? "0" : "8"
                }`}
              >
                <Text
                  style={tw`text-[${colors.black}] text-base font-sans-medium capitalize`}
                >
                  {event.description}
                </Text>
                <View style={tw`flex-row items-center gap-2 mt-1`}>
                  <Text style={tw`text-gray-500 text-sm font-sans-medium`}>
                    {formatTimestamp(event.timestamp)}
                  </Text>
                  {!!event.location && (
                    <Text
                      style={tw`text-gray-400 text-sm flex-shrink capitalize`}
                      numberOfLines={1}
                    >
                      • {event.location}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {newestEventsFirst.length > 5 && (
        <View style={tw`mt-2`}>
          <Pressable
            onPress={() => setShowAllEvents((currentValue) => !currentValue)}
            style={tw`items-center justify-center py-3`}
          >
            <Text style={tw`text-[${colors.black}] font-sans-semibold`}>
              {showAllEvents
                ? "Show less"
                : `Show more (${newestEventsFirst.length - 5} more)`}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
