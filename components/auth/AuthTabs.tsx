import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

type AuthTabsProps = {
  tabs: string[];
  stateIndex: number;
  handleSelect: (e: number) => void;
};

type TabItemProps = {
  name: string;
  onClick: () => void;
  isSelected: boolean;
};

export default function AuthTabs({
  tabs,
  stateIndex,
  handleSelect,
}: AuthTabsProps) {
  const TabItem = ({ name, onClick, isSelected }: TabItemProps) => {
    if (isSelected)
      return (
        <TouchableOpacity style={styles.tabContainer}>
          <Text style={styles.tabText}>{name}</Text>
        </TouchableOpacity>
      );

    return (
      <TouchableOpacity
        style={[styles.tabContainer, { backgroundColor: "transparent" }]}
        onPress={onClick}
      >
        <Text style={[styles.tabText, { color: "#858585" }]}>{name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {tabs.map((i, idx) => (
        <TabItem
          name={i}
          key={idx}
          onClick={() => handleSelect(idx)}
          isSelected={stateIndex === idx}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 95,
    padding: 15,
    display: "flex",
    flexDirection: "row",
    gap: 15,
  },
  tabContainer: {
    height: 45,
    flex: 1,
    backgroundColor: "#000",
    borderRadius: 95,
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    fontSize: 14,
    color: "#fff",
  },
});
