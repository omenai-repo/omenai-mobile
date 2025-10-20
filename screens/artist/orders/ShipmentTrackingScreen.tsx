import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import { SvgXml } from 'react-native-svg';
import { locationIcon } from 'utils/SvgImages';
import { getImageFileView } from 'lib/storage/getImageFileView';
import { formatEventDate } from 'utils/utils_formatEventDate';
import { getTrackingData } from 'services/orders/getTrackingData';
import BackHeaderTitle from 'components/header/BackHeaderTitle';
import { useRoute } from '@react-navigation/native';

interface TrackingData {
  artwork_data: {
    title: string;
    url: string;
  };
  tracking_number: string;
  events: TrackingEvent[];
  order_date: string;
  shipping_details: OrderShippingDetailsTypes &
    OrderShippingDetailsTypes & {
      shipment_information: {
        planned_shipping_date: string;
      };
    };
}

function SkeletonRow({ widthPct = '100%', height = 14, borderRadius = 8 }: any) {
  const anim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.3, duration: 600, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [anim]);

  return (
    <Animated.View
      style={[
        {
          opacity: anim,
          backgroundColor: '#E6E7E8',
          width: widthPct,
          height,
          borderRadius,
        },
      ]}
    />
  );
}

export default function ShipmentTrackingScreen({ navigation }: any) {
  const { tracking_id } = useRoute<any>().params;
  const [trackingInput, setTrackingInput] = useState(tracking_id || '');
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [error, setError] = useState('');
  const [showAllEvents, setShowAllEvents] = useState(false);

  const handleSearch = async () => {
    if (!trackingInput.trim()) return;

    setIsLoading(true);
    setError('');
    setSearchAttempted(true);
    setShowAllEvents(false);

    const response = await getTrackingData(trackingInput.trim());

    if (response.isOk && response.data) {
      console.log(response.data.shipping_details);
      setTrackingData(response.data);
    } else {
      setError(response.message || 'Unable to find tracking information');
      setTrackingData(null);
    }

    setIsLoading(false);
  };

  const handleSearchAgain = () => {
    setTrackingInput('');
    setTrackingData(null);
    setSearchAttempted(false);
    setError('');
    setShowAllEvents(false);
  };

  const formatTimestamp = (isoString: string): string => {
    const cleanedString = isoString.replace(' GMT', '');

    const date = new Date(cleanedString);

    if (isNaN(date.getTime())) {
      return 'Error: Invalid Date could not be parsed.';
    }

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    };
    return date.toLocaleDateString('en-US', options);
  };

  const image = trackingData?.artwork_data?.url
    ? getImageFileView(trackingData.artwork_data.url, 300)
    : '';

  // events: assume chronological (oldest -> newest); the most recent is last element
  const events = [...(trackingData?.events ?? [])].reverse();
  const eventsCount = events.length;
  const lastNEvents = events.slice(0, 5);

  const primaryEventsToShow = showAllEvents ? events : lastNEvents;

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <BackHeaderTitle title="Track Shipment" />

      {/* Top Search bar fixed under header */}
      <View style={tw`px-4 py-4 bg-gray-50`}>
        <Text style={tw`text-base font-semibold text-gray-900 mb-2`}>Track Your Order</Text>

        <View style={tw`px-4 py-6`}>
          <Text style={tw`text-base font-semibold text-gray-900 mb-2`}>Enter Tracking Number</Text>
          <View
            style={tw`flex-row items-center bg-white rounded-xl border border-gray-200 overflow-hidden`}
          >
            <Ionicons name="search" size={20} color="#999" style={tw`pl-4`} />
            <TextInput
              style={tw`flex-1 px-4 py-3 text-base text-black`}
              placeholder="Order ID or tracking number"
              placeholderTextColor="#999"
              value={trackingInput}
              onChangeText={setTrackingInput}
              editable={!isLoading}
            />
          </View>
          <Pressable
            onPress={handleSearch}
            disabled={isLoading || !trackingInput.trim()}
            style={tw`bg-slate-900 rounded-xl py-3 mt-4 items-center justify-center ${
              isLoading || !trackingInput.trim() ? 'opacity-50' : ''
            }`}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={tw`text-white font-semibold text-base`}>Track</Text>
            )}
          </Pressable>
        </View>

        {/* Loading skeletons (below input, not replacing it) */}
        {isLoading && (
          <View style={tw`mt-4`}>
            <SkeletonRow widthPct={'60%'} height={16} />
            <View style={tw`h-3`} />
            <SkeletonRow widthPct={'100%'} height={90} borderRadius={12} />
            <View style={tw`h-3`} />
            <SkeletonRow widthPct={'100%'} height={120} borderRadius={12} />
          </View>
        )}
      </View>

      <ScrollView
        style={tw`flex-1`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Tracking Results */}
        {trackingData && !isLoading && (
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

            {/* Shipment Details: origin & destination, carrier, estimated delivery date, order date, order id */}
            <View style={tw`bg-white rounded-2xl p-4 space-y-3`}>
              <View style={tw`flex-row justify-between items-start mb-[10px]`}>
                <View style={tw`flex-1 pr-2`}>
                  <Text style={tw`text-gray-500 text-[16px] font-medium`}>Origin Address</Text>
                  <Text style={tw`text-black text-sm font-semibold mt-1`}>
                    {trackingData.shipping_details?.addresses.origin.address_line || 'N/A'}
                  </Text>
                </View>
                <View style={tw`flex-1 pl-2 items-end`}>
                  <Text style={tw`text-gray-500 text-[16px] font-medium`}>Destination Address</Text>
                  <Text style={tw`text-black text-sm font-semibold mt-1`}>
                    {trackingData.shipping_details?.addresses.destination.address_line || 'N/A'}
                  </Text>
                </View>
              </View>

              <View style={tw`flex-row justify-between items-center mb-[10px]`}>
                <View>
                  <Text style={tw`text-gray-500 text-[16px] font-medium`}>Carrier</Text>
                  <Text style={tw`text-black text-sm font-semibold mt-1`}>
                    {trackingData.shipping_details?.shipment_information?.carrier || 'DHL Express'}
                  </Text>
                </View>

                <View style={tw`items-end`}>
                  <Text style={tw`text-gray-500 text-[16px] font-medium`}>Status</Text>
                  <Text style={tw`text-blue-600 text-sm font-semibold mt-1`}>In Transit</Text>
                </View>
              </View>

              <View style={tw`gap-[10px]`}>
                <View>
                  <Text style={tw`text-gray-500 text-[16px] font-medium`}>
                    Estimated delivery date
                  </Text>
                  <Text style={tw`text-black text-sm font-semibold mt-1`}>
                    {formatTimestamp(
                      trackingData?.shipping_details?.shipment_information?.planned_shipping_date,
                    ) || 'TBD'}
                  </Text>
                </View>

                <View style={tw``}>
                  <Text style={tw`text-gray-500 text-[16px] font-medium`}>Order date</Text>
                  <Text style={tw`text-black text-sm font-semibold mt-1`}>
                    {trackingData.order_date || 'N/A'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Timeline */}
            <View style={tw`bg-white rounded-2xl p-4`}>
              <Text style={tw`text-black font-semibold text-base mb-4`}>Tracking History</Text>

              <ScrollView
                style={{ maxHeight: 300 }}
                contentContainerStyle={{ paddingBottom: 8 }}
                nestedScrollEnabled
              >
                {primaryEventsToShow.length === 0 && (
                  <Text style={tw`text-gray-500 text-sm`}>No tracking events available.</Text>
                )}

                {primaryEventsToShow.map((event, idx) => {
                  const originalIndex = events.indexOf(event);
                  const isMostRecent = originalIndex === 0;

                  return (
                    <View
                      key={`${originalIndex}-${idx}`}
                      style={tw`mb-${originalIndex === eventsCount - 1 ? '0' : '6'}`}
                    >
                      <View style={tw`flex-row items-center gap-4`}>
                        <View
                          style={tw`h-10 w-10 ${
                            isMostRecent ? 'bg-blue-100' : 'bg-gray-100'
                          } rounded-full justify-center items-center`}
                        >
                          <SvgXml xml={locationIcon} width={20} height={20} />
                        </View>
                        <View style={tw`flex-1`}>
                          <Text style={tw`text-black text-sm font-semibold`}>
                            {event.description}
                          </Text>
                          <Text style={tw`text-gray-500 text-[16px] font-medium mt-1`}>
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
                      {showAllEvents ? 'Show less' : `Show more (${eventsCount - 5} more)`}
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
        )}

        {/* Error State */}
        {searchAttempted && !trackingData && !isLoading && (
          <View style={tw`px-4 py-8 items-center`}>
            <View style={tw`h-16 w-16 bg-red-100 rounded-full items-center justify-center mb-4`}>
              <Ionicons name="alert-circle" size={32} color="#dc2626" />
            </View>
            <Text style={tw`text-black text-lg font-semibold text-center mb-2`}>
              Shipment Not Found
            </Text>
            <Text style={tw`text-gray-500 text-sm text-center mb-6`}>
              {error ||
                'We could not find tracking information for this number. Please check and try again.'}
            </Text>
            <Pressable onPress={handleSearchAgain} style={tw`bg-slate-900 rounded-xl px-6 py-3`}>
              <Text style={tw`text-white font-semibold text-base`}>Try Again</Text>
            </Pressable>
          </View>
        )}

        {/* Initial State */}
        {!searchAttempted && !trackingData && !isLoading && (
          <View style={tw`px-4 py-12 items-center`}>
            <View style={tw`h-20 w-20 bg-slate-900 rounded-full items-center justify-center mb-4`}>
              <Ionicons name="cube" size={40} color="#fff" />
            </View>
            <Text style={tw`text-black text-lg font-semibold text-center`}>Track Your Artwork</Text>
            <Text style={tw`text-gray-500 text-sm text-center mt-2`}>
              Enter your tracking number above to view real-time shipment updates
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
