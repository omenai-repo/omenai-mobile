import React from "react";
import { StyleSheet, Text, View } from "react-native";

type ComingSoonScreenProps = {
  title: string;
  subtitle?: string;
};

export default function ComingSoonScreen({
  title,
  subtitle = "This screen is coming soon.",
}: ComingSoonScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7F7F7",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#101828",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#667085",
    textAlign: "center",
  },
});
