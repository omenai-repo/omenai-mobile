import { StyleSheet, Text, View } from "react-native";
import React, { SetStateAction, useEffect, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { colors } from "config/colors.config";

type CustomSelectPickerProps = {
  data: { label: string; value: string }[];
  placeholder?: string;
  label: string;
  value: string;
  handleSetValue: (e: string) => void;
  handleBlur?: () => void;
  errorMessage?: string;
  zIndex?: number;
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
}: CustomSelectPickerProps) {
  const [open, setOpen] = useState(false);

  const [localValue, setLocalValue] = useState(null);

  useEffect(() => {
    if (localValue) {
      handleSetValue(localValue);
    }
  }, [localValue]);

  return (
    <View style={{ zIndex: zIndex }}>
      <Text style={styles.label}>{label}</Text>
      <Dropdown
        value={value}
        data={data}
        labelField="label"
        valueField="value"
        onChange={(item: any) => {
          setLocalValue(item);
        }}
        showsVerticalScrollIndicator={false}
        placeholder={placeholder}
        maxHeight={150}
        style={styles.container}
        dropdownPosition="auto"
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
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 20,
    borderRadius: 5,
    height: 60,
  },
  errorMessage: {
    color: "#ff0000",
    marginTop: 2,
  },
});
