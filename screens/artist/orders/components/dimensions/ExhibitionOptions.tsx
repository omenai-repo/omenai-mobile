import { Platform, Pressable, View, Text } from "react-native";
import React, { useState } from "react";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ToggleButton from "#components/forms/ToggleButton";
import { format } from "date-fns";

type ExhibitionOptionsProps = {
  userType: string;
  isOnExhibition: boolean;
  setIsOnExhibition: (val: boolean) => void;
  expoEndDate: Date | null;
  setExpoEndDate: (val: Date | null) => void;
};

export default function ExhibitionOptions({
  userType,
  isOnExhibition,
  setIsOnExhibition,
  expoEndDate,
  setExpoEndDate,
}: Readonly<ExhibitionOptionsProps>) {
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  if (userType !== "gallery") return null;

  const showDatePicker = () => setIsDatePickerVisible(true);
  const hideDatePicker = () => setIsDatePickerVisible(false);

  const handleConfirm = (date: Date) => {
    setExpoEndDate(date);
    hideDatePicker();
  };

  return (
    <View style={tw`mt-5 mx-[20px]`}>
      <Text style={tw`text-sm text-gray-600 mb-3`}>
        Is artwork on exhibition?
      </Text>
      <View style={tw`flex-row gap-4`}>
        <View style={tw`flex-1`}>
          <ToggleButton
            label="Yes"
            isSelected={isOnExhibition}
            onPress={() => setIsOnExhibition(true)}
          />
        </View>
        <View style={tw`flex-1`}>
          <ToggleButton
            label="No"
            isSelected={!isOnExhibition}
            onPress={() => {
              setIsOnExhibition(false);
              setExpoEndDate(null);
            }}
          />
        </View>
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
                automatically triggered on this specific date and time.
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
