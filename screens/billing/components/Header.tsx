import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { billingTabs } from "../Billing";
import { colors } from "#config/colors.config";

type BillingHeaderProps = {
  selectedTab: billingTabs;
  handleUpdate: (tab: billingTabs) => void;
};

export default function Header({ selectedTab, handleUpdate }: BillingHeaderProps) {
  const tabs: billingTabs[] = ["monthly", "yearly"];

  return (
    <View style={styles.mainContainer}>
      {tabs.map((tab: billingTabs, index: number) => (
        <TouchableOpacity
          onPress={() => handleUpdate(tab)}
          key={index}
          style={{ height: 38, flex: 1 }}
          activeOpacity={0.9}
        >
          <View
            style={[
              styles.item,
              selectedTab === tab && { backgroundColor: colors.black },
            ]}
          >
            <Text
              style={{
                textTransform: "uppercase",
                letterSpacing: 1.4,
                fontSize: 11,
                color: selectedTab === tab ? colors.white : "#8A8580",
              }}
            >
              {tab === "monthly" ? "Monthly" : "Annual"}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 4,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#DDD8D0",
    borderRadius: 999,
  },
  item: {
    height: "100%",
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
});