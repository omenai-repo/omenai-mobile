import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { colors } from "config/colors.config";

type HeaderWithTitleProps = {
  pageTitle: string;
};

export default function HeaderWithTitle({ pageTitle }: HeaderWithTitleProps) {
  return (
    <SafeAreaView style={styles.header}>
      <Text style={styles.headerText}>{pageTitle}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary_black,
    alignItems: "center",
  },
  headerText: {
    color: colors.white,
    paddingBottom: 30,
    paddingVertical: 15,
    fontSize: 16,
    fontWeight: "500",
  },
});
