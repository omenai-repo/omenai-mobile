import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import ARRoomPreviewUnavailable from "#components/ar/ARRoomPreviewUnavailable";
import { isArEnvironmentSupported } from "#components/ar/isArEnvironmentSupported";
import type { ARRoomPreviewProps } from "#components/ar/types";

export type { ArtworkDimensions, ARRoomPreviewProps } from "#components/ar/types";

export default function ARRoomPreview(props: ARRoomPreviewProps) {
  const canRunAr = isArEnvironmentSupported();
  const [DevicePreview, setDevicePreview] =
    useState<React.ComponentType<ARRoomPreviewProps> | null>(null);

  useEffect(() => {
    if (!canRunAr) return;

    void import("#components/ar/ARPreviewWithViro").then((module) => {
      setDevicePreview(() => module.default);
    });
  }, [canRunAr]);

  if (!canRunAr) {
    return <ARRoomPreviewUnavailable onClose={props.onClose} />;
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
