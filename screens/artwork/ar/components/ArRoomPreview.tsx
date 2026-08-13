import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import ArRoomPreviewUnavailable from "./ArRoomPreviewUnavailable";
import { isArEnvironmentSupported } from "#utils/hooks/isArEnvironmentSupported";
import type { ARRoomPreviewProps } from "#types/ar";

export default function ArRoomPreview(props: ARRoomPreviewProps) {
  const canRunAr = isArEnvironmentSupported();
  const [DevicePreview, setDevicePreview] =
    useState<React.ComponentType<ARRoomPreviewProps> | null>(null);

  useEffect(() => {
    if (!canRunAr) return;
    try {
      const module = require("./ARPreviewWithViro");
      setDevicePreview(() => module.default);
    } catch (e) {
      console.warn("Failed to load AR module", e);
    }
  }, [canRunAr]);

  if (!canRunAr) {
    return <ArRoomPreviewUnavailable onClose={props.onClose} />;
  }

  if (!DevicePreview) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return <DevicePreview {...props} />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
  },
});
