import { Platform, Pressable, View, Text } from "react-native";
import React, { useState } from "react";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";
import PickupAddressSection from "./PickupAddressSection";

type ExhibitionOptionsProps = {
  userType: string;
  orderId: string;
  isOnExhibition: boolean;
  setIsOnExhibition: (val: boolean) => void;
  expoEndDate: Date | null;
  setExpoEndDate: (val: Date | null) => void;
  pickupAddress: AddressTypes | null;
  onAddressUpdated: (newAddress: AddressTypes) => void;
};

export default function ExhibitionOptions({
  userType,
  orderId,
  isOnExhibition,
  setIsOnExhibition,
  expoEndDate,
  setExpoEndDate,
  pickupAddress,
  onAddressUpdated,
}: Readonly<ExhibitionOptionsProps>) {
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const showDatePicker = () => setIsDatePickerVisible(true);
  const hideDatePicker = () => setIsDatePickerVisible(false);

  const handleConfirm = (date: Date) => {
    setExpoEndDate(date);
    hideDatePicker();
  };

  const actorLabel = userType === "gallery" ? "gallery" : "artist";

  return (
    <View style={tw`mx-[20px]`}>
      <PickupAddressSection
        orderId={orderId}
        pickupAddress={pickupAddress}
        onAddressUpdated={onAddressUpdated}
      />

      <Text style={tw`text-sm text-gray-600 mb-3 mt-7`}>
        Is artwork on exhibition?
      </Text>
      <View
        style={tw`border border-neutral-200 rounded-md bg-white overflow-hidden`}
      >
        <Pressable
          onPress={() => setIsOnExhibition(true)}
          style={({ pressed }) =>
            tw`flex-row items-center p-4 border-b gap-3 border-neutral-200 ${
              pressed ? "bg-neutral-50" : ""
            }`
          }
        >
          <View
            style={tw`w-5 h-5 rounded-full border ${
              isOnExhibition ? "border-black bg-black" : "border-gray-300"
            } items-center justify-center`}
          >
            {isOnExhibition && (
              <View style={tw`w-2 h-2 rounded-full bg-white`} />
            )}
          </View>
          <Text style={tw`text-[15px] text-gray-800`}>Yes</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            setIsOnExhibition(false);
            setExpoEndDate(null);
          }}
          style={({ pressed }) =>
            tw`flex-row items-center gap-3 p-4 ${
              pressed ? "bg-neutral-50" : ""
            }`
          }
        >
          <View
            style={tw`w-5 h-5 rounded-full border ${
              !isOnExhibition ? "border-black bg-black" : "border-gray-300"
            } items-center justify-center`}
          >
            {!isOnExhibition && (
              <View style={tw`w-2 h-2 rounded-full bg-white`} />
            )}
          </View>
          <Text style={tw`text-[15px] text-gray-800`}>No</Text>
        </Pressable>
      </View>

      {isOnExhibition && (
        <View style={tw`mt-4`}>
          <View
            style={tw`mb-3 flex-row bg-blue-50 border border-blue-100 rounded-md p-3`}
          >
            <Ionicons
              name="information-circle"
              size={18}
              color="#2563EB"
              style={tw`mt-0.5 mr-2`}
            />
            <View style={tw`flex-1`}>
              <Text style={tw`text-sm font-semibold text-blue-700`}>
                Automated Logistics
              </Text>
              <Text style={tw`text-xs text-blue-700 mt-1 leading-5`}>
                Select when the exhibition ends. A shipment request will be
                automatically triggered on this specific date and time for the{" "}
                {actorLabel}.
              </Text>
            </View>
          </View>

          <Text style={tw`text-sm text-gray-600 mb-3`}>
            when does the exhibition end?
          </Text>
          <Pressable
            onPress={showDatePicker}
            style={tw`bg-white border border-gray-200 rounded-md px-4 py-3`}
          >
            <Text style={tw`text-gray-900`}>
              {expoEndDate
                ? format(expoEndDate, "MMM dd, yyyy - hh:mm a")
                : "Select date and time"}
            </Text>
          </Pressable>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="datetime"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            minimumDate={new Date()}
            display={Platform.OS === "ios" ? "inline" : "default"}
          />
        </View>
      )}
    </View>
  );
}
