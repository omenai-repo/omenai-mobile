import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, Pressable, Image, Dimensions, Platform } from 'react-native';
import MapView, { Marker, Polyline, UrlTile } from 'react-native-maps';
import { SvgXml } from 'react-native-svg';
import tw from 'twrnc';
import { locationCrossShair, locationIcon } from 'utils/SvgImages';

const { width, height } = Dimensions.get('window');

export default function ShipmentTrackingScreen({ navigation }: any) {
  const origin = { latitude: -20.9176, longitude: 142.7028 }; // Wyoming, AU
  const destination = { latitude: -6.2308, longitude: 106.8314 }; // Bangpak, ID
  const routeCoordinates = [origin, { latitude: -12, longitude: 130 }, destination];

  const hasValidCoords =
    origin?.latitude && origin?.longitude && destination?.latitude && destination?.longitude;

  return (
    <View style={tw`flex-1 bg-black`}>
      <MapView
        style={{ width, height }}
        initialRegion={{
          ...origin,
          latitudeDelta: 30,
          longitudeDelta: 30,
        }}
      >
        {/* Use OpenStreetMap tile layer */}
        <UrlTile
          urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          flipY={false}
          zIndex={-1} // Ensures markers and routes are visible above tiles
        />

        {hasValidCoords && (
          <>
            <Marker coordinate={origin} title="Current Location" />
            <Marker coordinate={destination} title="Destination" />
            <Polyline coordinates={routeCoordinates} strokeWidth={5} strokeColor="#000" />
          </>
        )}
      </MapView>

      {/* Back nav */}
      <Pressable
        onPress={() => navigation.goBack()}
        style={tw`bg-white w-10 h-10 absolute ios:top-[80px] top-[40px] left-5 rounded-full items-center justify-center`}
      >
        <Ionicons name="arrow-back" size={25} color="#000" />
      </Pressable>

      <View style={tw`absolute bottom-0 left-[25px] right-[25px] gap-[20px]`}>
        {/* Package Info */}
        <View style={tw`flex-row items-center bg-white rounded-[20px] px-[20px] py-[15px]`}>
          <Image
            source={require('../../../assets/images/acrylic_art.jpg')}
            style={tw`w-[62px] h-[57px] rounded-[10px]`}
          />
          <View style={tw`gap-[3px] ml-[15px]`}>
            <Text style={tw`text-black font-medium text-[15px]`}>The Bleeding Monarch</Text>
            <Text style={tw`text-[#000000B2] text-[12px] font-medium`}>Package Number</Text>
            <Text style={tw`text-[#00000080] text-[12px] font-medium`}>#2234545334</Text>
          </View>
        </View>

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
                <Text style={tw`text-[#00000099] text-[14px] font-medium`}>Current location</Text>
                <Text style={tw`text-[#000000] text-[16px] font-semibold pr-[100px]`}>
                  Wyoming, Australia
                </Text>
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
                  style={tw`h-[24px] w-[24px] bg-[#FFFFFF] rounded-full justify-center items-center`}
                >
                  <SvgXml xml={locationCrossShair} />
                </View>
              </View>
              <View>
                <Text style={tw`text-gray-500 text-sm`}>Shipping Destination</Text>
                <Text style={tw`text-black text-base font-semibold`}>Bangpak, Indonesia.</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
