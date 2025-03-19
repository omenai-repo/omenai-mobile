import { StyleSheet, Text, View } from "react-native";
import React, { SetStateAction, useEffect, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { colors } from "config/colors.config";

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
};

type SetStateValue<S> = (prevState: S) => S;

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
}: CustomSelectPickerProps) {
  return (
    <View style={{ zIndex: zIndex }}>
      <Text style={styles.label}>{label}</Text>
      <Dropdown
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
        }}
        disable={disable}
        maxHeight={250}
        containerStyle={{
          borderRadius: 5,
        }}
        style={styles.container}
        dropdownPosition={dropdownPosition}
        keyboardAvoiding={true}
      />
      {errorMessage && errorMessage?.length > 0 && (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    color: colors.inputLabel,
    marginBottom: 10,
  },
  container: {
    borderColor: colors.inputBorder,
    paddingHorizontal: 20,
    height: 60,
    width: "100%",
    borderWidth: 1,
    backgroundColor: "#FAFAFA",
    borderRadius: 95,
  },
  errorMessage: {
    color: "#ff0000",
    marginTop: 2,
  },
});
