import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Image, Dimensions } from 'react-native';
import MapView, { Marker, Polyline, UrlTile } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import { SvgXml } from 'react-native-svg';
import { locationIcon } from 'utils/SvgImages';
import { getShipmentTracking } from 'services/orders/getShipmentTracking';
import { getImageFileView } from 'lib/storage/getImageFileView';
import { utils_formatPrice } from 'utils/utils_priceFormatter';
import { formatEventDate } from 'utils/utils_formatEventDate';

const { width, height } = Dimensions.get('window');

export default function ShipmentTrackingScreen({ navigation, route }: any) {
  const { orderId } = route.params;
  const [origin, setOrigin] = useState({
    latitude: -20.9176,
    longitude: 142.7028,
  });
  const [destination, setDestination] = useState({
    latitude: -6.2308,
    longitude: 106.8314,
  });
  const [trackingNumber, setTrackingNumber] = useState('');
  const [artworkData, setArtworkData] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [orderDate, setOrderDate] = useState<string>('');

  useEffect(() => {
    const fetchTracking = async () => {
      const response = await getShipmentTracking(orderId);

      if (response.isOk) {
        setArtworkData(response.data.artwork_data);
        setTrackingNumber(response.data.tracking_number);
        setEvents(response.data.events);
        setOrderDate(response.data.order_date);
        setOrigin({
          latitude: response.data.coordinates.origin.lat,
          longitude: response.data.coordinates.origin.lng,
        });
        setDestination({
          latitude: response.data.coordinates.destination.lat,
          longitude: response.data.coordinates.destination.lng,
        });
      }
    };

    fetchTracking();
  }, [orderId]);

  const hasValidCoords = origin && destination;
  const image = getImageFileView(artworkData?.url || '', 300);
  return (
    <View style={tw`flex-1 bg-black`}>
      <MapView
        style={{ width, height }}
        initialRegion={{
          latitude: origin?.latitude || 6.55,
          longitude: origin?.longitude || 3.57,
          latitudeDelta: 30,
          longitudeDelta: 30,
        }}
      >
        <UrlTile urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png" maximumZ={19} />

        {hasValidCoords && (
          <>
            <Marker coordinate={origin} title="Current Location" />
            <Marker coordinate={destination} title="Destination" />
            <Polyline coordinates={[origin, destination]} strokeWidth={5} strokeColor="#000" />
          </>
        )}
      </MapView>

      <Pressable
        onPress={() => navigation.goBack()}
        style={tw`bg-white w-10 h-10 absolute ios:top-[80px] top-[40px] left-5 rounded-full items-center justify-center`}
      >
        <Ionicons name="arrow-back" size={25} color="#050505" />
      </Pressable>

      <View style={tw`absolute bottom-0 left-[25px] right-[25px] gap-[20px]`}>
        {artworkData && (
          <View style={tw`flex-row items-center bg-white rounded-[20px] px-[20px] py-[15px]`}>
            <Image
              source={{
                uri: image,
              }}
              style={tw`w-[62px] h-[57px] rounded-[10px]`}
            />
            <View style={tw`gap-[3px] ml-[15px]`}>
              <Text style={tw`text-black font-medium text-[15px]`}>{artworkData.title}</Text>
              <Text style={tw`text-[#000000B2] text-[12px] font-medium`}>Tracking Number</Text>
              <Text style={tw`text-[#000000] text-[12px] font-bold`}>#{trackingNumber}</Text>
            </View>
          </View>
        )}

        {/* Bottom Card */}
        <View style={tw`bg-white rounded-t-[24px] pt-4 px-5 pb-8`}>
          {/* Handle Line */}
          <View style={tw`w-[50px] h-[5px] bg-[#000000] self-center rounded-full mb-[30px]`} />

          {/* Location Info */}
          <View style={tw`mb-5`}>
            <View style={tw`flex-row items-center gap-[20px]`}>
              <View
                style={tw`h-[40px] w-[40px] bg-[#F8F8F8] rounded-full justify-center items-center`}
              >
                <SvgXml xml={locationIcon} />
              </View>
              <View>
                <Text style={tw`text-[#000000] text-[16px] font-semibold`}>Order created</Text>
                <Text style={tw`text-[#00000099] text-[14px] font-medium pr-[100px]`}>
                  New Order placed. Awaiting pickup
                </Text>
                <Text style={tw`text-[#000000] text-[14px]`}>{orderDate}</Text>
              </View>
            </View>
            <View style={tw`gap-[5px] ml-[20px] my-[10px]`}>
              <View style={tw`h-[10px] bg-[#000] w-[2px]`} />
              <View style={tw`h-[10px] bg-[#000] w-[2px]`} />
              <View style={tw`h-[10px] bg-[#000] w-[2px]`} />
            </View>
            <View style={tw`flex-row items-center gap-[20px]`}>
              <View
                style={tw`h-[40px] w-[40px] bg-[#F8F8F8] rounded-full justify-center items-center`}
              >
                <View
                  style={tw`h-[40px] w-[40px] bg-[#F8F8F8] rounded-full justify-center items-center`}
                >
                  <SvgXml xml={locationIcon} />
                </View>
              </View>
              <View>
                <Text style={tw`text-[#000000] text-[16px] font-semibold`}>
                  {events[0]?.description}
                </Text>
                <Text style={tw`text-[#00000099] text-[14px] font-medium pr-[100px]`}>
                  {formatEventDate(`${events[0]?.date} ${events[0]?.time}`)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
