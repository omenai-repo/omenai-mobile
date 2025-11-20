import { Pressable, Text, View } from "react-native";
import React, { useCallback, useRef } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { colors } from "config/colors.config";
import tw from "twrnc";

type CustomSelectPickerProps = {
  data: { label: string; value: string }[];
  placeholder?: string;
  label: string;
  value: string;
  handleSetValue: (e: { label: string; value: string }) => void;
  handleBlur?: () => void;
  errorMessage?: string;
  zIndex?: number;
  search?: boolean;
  searchPlaceholder?: string;
  dropdownPosition?: "auto" | "top" | "bottom";
  disable?: false | true;
  renderInputSearch?: any;
};

export default function CustomSelectPicker({
  value,
  data,
  label,
  placeholder,
  handleSetValue,
  handleBlur,
  errorMessage,
  zIndex = 200,
  search,
  searchPlaceholder,
  dropdownPosition,
  disable,
  renderInputSearch,
}: CustomSelectPickerProps) {
  const dropdownRef = useRef<any>(null);

  const handleOptionSelect = useCallback(
    (item: { label: string; value: string }) => {
      handleSetValue(item);
      dropdownRef.current?.close?.();
    },
    [handleSetValue]
  );

  const renderDropdownItem = useCallback(
    (item: { label: string; value: string }) => (
      <Pressable
        key={item.value}
        onPress={() => handleOptionSelect(item)}
        style={tw`px-4 py-2.5`}
      >
        <Text style={[tw`text-sm`, { color: colors.inputLabel }]}>{item.label}</Text>
      </Pressable>
    ),
    [handleOptionSelect]
  );

  return (
    <View style={{ zIndex: zIndex }}>
      <Text style={[tw`text-sm mb-2.5`, { color: colors.inputLabel }]}>{label}</Text>
      <Dropdown
        ref={dropdownRef}
        value={value}
        data={data}
        labelField="label"
        valueField="value"
        onChange={(item: { label: string; value: string }) => {
          handleSetValue(item);
        }}
        search={search}
        searchPlaceholder={searchPlaceholder}
        showsVerticalScrollIndicator={false}
        placeholder={placeholder}
        placeholderStyle={{
          color: "#858585",
          fontSize: 14,
        }}
        disable={disable}
        maxHeight={250}
        containerStyle={{
          borderRadius: 5,
        }}
        style={[
          tw`px-4 h-11 w-full bg-[#FAFAFA] rounded-lg border`,
          { borderColor: colors.inputBorder },
        ]}
        selectedTextStyle={{
          color: disable ? "#c0c0c0" : colors.black,
          fontSize: 14,
        }}
        renderInputSearch={renderInputSearch}
        dropdownPosition={dropdownPosition}
        keyboardAvoiding={true}
        renderItem={renderDropdownItem}
        flatListProps={{
          initialNumToRender: 15,
          maxToRenderPerBatch: 20,
          windowSize: 10,
          keyboardShouldPersistTaps: "handled",
        }}
      />
      {errorMessage && errorMessage?.length > 0 && (
        <Text style={[tw`mt-0.5`, { color: "#ff0000" }]}>{errorMessage}</Text>
      )}
    </View>
  );
}
