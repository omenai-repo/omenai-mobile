import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Dimensions,
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

const { width } = Dimensions.get('window');

interface TrackingEvent {
  description: string;
  date: string;
  time: string;
}

interface TrackingData {
  artwork_data: {
    title: string;
    url: string;
  };
  tracking_number: string;
  events: TrackingEvent[];
  order_date: string;
  shipping_details: {
    shipment_information: {
      carrier: string;
    };
  };
}

export default function ShipmentTrackingScreen({ navigation }: any) {
  const { tracking_id } = useRoute<any>().params;
  const [trackingInput, setTrackingInput] = useState(tracking_id || '');
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [error, setError] = useState('');
  const handleSearch = async () => {
    if (!trackingInput.trim()) return;

    setIsLoading(true);
    setError('');
    setSearchAttempted(true);

    const response = await getTrackingData(trackingInput.trim());

    if (response.isOk && response.data) {
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
  };

  const image = trackingData?.artwork_data?.url
    ? getImageFileView(trackingData.artwork_data.url, 300)
    : '';

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <BackHeaderTitle title="Track Shipment" />

      <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}>
        {/* Search Section */}
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
                  <Text style={tw`text-gray-500 text-xs font-medium mt-1`}>Tracking Number</Text>
                  <Text style={tw`text-black text-xs font-bold`}>
                    #{trackingData.tracking_number}
                  </Text>
                </View>
              </View>
            )}

            {/* Shipment Details */}
            <View style={tw`bg-white rounded-2xl p-4 space-y-3`}>
              <View style={tw`flex-row justify-between items-start`}>
                <View>
                  <Text style={tw`text-gray-500 text-xs font-medium`}>Carrier</Text>
                  <Text style={tw`text-black text-sm font-semibold mt-1`}>
                    {trackingData.shipping_details?.shipment_information?.carrier || 'DHL Express'}
                  </Text>
                </View>
                <View>
                  <Text style={tw`text-gray-500 text-xs font-medium`}>Status</Text>
                  <Text style={tw`text-blue-600 text-sm font-semibold mt-1`}>In Transit</Text>
                </View>
              </View>
            </View>

            {/* Timeline */}
            <View style={tw`bg-white rounded-2xl p-4`}>
              <Text style={tw`text-black font-semibold text-base mb-4`}>Tracking History</Text>

              {/* Order Created */}
              {/* <View style={tw`mb-6`}>
                <View style={tw`flex-row items-center gap-4`}>
                  <View style={tw`h-10 w-10 bg-gray-100 rounded-full justify-center items-center`}>
                    <SvgXml xml={locationIcon} width={20} height={20} />
                  </View>
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-black text-sm font-semibold`}>Order Created</Text>
                    <Text style={tw`text-gray-500 text-xs font-medium mt-1`}>
                      New order placed. Awaiting pickup
                    </Text>
                    <Text style={tw`text-black text-xs mt-1`}>{trackingData.order_date}</Text>
                  </View>
                </View>
                <View style={tw`ml-5 my-2 gap-1`}>
                  <View style={tw`h-2 bg-gray-300 w-0.5`} />
                  <View style={tw`h-2 bg-gray-300 w-0.5`} />
                  <View style={tw`h-2 bg-gray-300 w-0.5`} />
                </View>
              </View> */}

              {/* Events */}
              {trackingData.events.map((event, index) => (
                <View
                  key={index}
                  style={tw`mb-${index === trackingData.events.length - 1 ? '0' : '6'}`}
                >
                  <View style={tw`flex-row items-center gap-4`}>
                    <View
                      style={tw`h-10 w-10 ${
                        index === trackingData.events.length - 1 ? 'bg-blue-100' : 'bg-gray-100'
                      } rounded-full justify-center items-center`}
                    >
                      <SvgXml xml={locationIcon} width={20} height={20} />
                    </View>
                    <View style={tw`flex-1`}>
                      <Text style={tw`text-black text-sm font-semibold`}>{event.description}</Text>
                      <Text style={tw`text-gray-500 text-xs font-medium mt-1`}>
                        {formatEventDate(`${event.date} ${event.time}`)}
                      </Text>
                    </View>
                  </View>
                  {index < trackingData.events.length - 1 && (
                    <View style={tw`ml-5 my-2 gap-1`}>
                      <View style={tw`h-2 bg-gray-300 w-0.5`} />
                      <View style={tw`h-2 bg-gray-300 w-0.5`} />
                      <View style={tw`h-2 bg-gray-300 w-0.5`} />
                    </View>
                  )}
                </View>
              ))}
            </View>

            {/* Search Again Button */}
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
        {!searchAttempted && !trackingData && (
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
