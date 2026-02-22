import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import { colors } from "#config/colors.config";

type TransactionCardProps = {
  id: string;
  net: string;
  gross: string;
  date: string;
};

export default function TransactionCard({
  id,
  gross,
  net,
  date,
}: TransactionCardProps) {
  const PillContainer = ({ label }: { label: string }) => {
    return (
      <View style={{ flexWrap: "wrap" }}>
        <View
          style={{
            paddingVertical: 4,
            paddingHorizontal: 8,
            backgroundColor: "#17963915",
            borderRadius: 6,
          }}
        >
          <Text style={{ fontSize: 10, color: "#179639", fontWeight: "500" }}>
            {label}
          </Text>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.transactionType}>
        <Feather
          name="arrow-down-left"
          size={16}
          color={colors.primary_black}
          style={{ opacity: 0.8 }}
        />
      </View>
      <View style={styles.mainContainer}>
        <View style={{ gap: 4, flex: 1 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "500",
              color: colors.primary_black,
            }}
          >
            #{id}
          </Text>
          <Text style={{ fontSize: 12, color: colors.grey }}>{date}</Text>
        </View>

        <View
          style={{
            alignItems: "flex-end",
            gap: 4,
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: colors.primary_black,
            }}
          >
            {gross}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Text style={{ fontSize: 12, color: colors.grey }}>Net: {net}</Text>
            <PillContainer label="Paid" />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
  },
  transactionType: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  mainContainer: {
    flex: 1,
    flexDirection: "row",
    borderBottomColor: colors.grey50,
    borderBottomWidth: 1,
    paddingBottom: 20,
  },
});
