import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ViroARSceneNavigator } from "@reactvision/react-viro";

import WallPreviewARScene from "#components/ar/WallPreviewARScene";
import type { ARRoomPreviewProps } from "#components/ar/types";

function formatDimensions(widthM: number, heightM: number) {
  const toCm = (value: number) => Math.round(value * 100);
  return `${toCm(widthM)} × ${toCm(heightM)} cm`;
}

export default function ARRoomPreviewDevice(props: ARRoomPreviewProps) {
  const insets = useSafeAreaInsets();
  const [statusText, setStatusText] = useState(
    "This artwork is shown in your room. Point at a wall, then pinch to resize or drag to reposition.",
  );

  return (
    <View style={styles.root}>
      <ViroARSceneNavigator
        autofocus
        style={styles.ar}
        initialScene={{
          scene: WallPreviewARScene as unknown as () => React.ReactElement,
        }}
        viroAppProps={{
          artworkUri: props.artworkUri,
          artworkDimensions: props.artworkDimensions,
          frameStyle: props.frameStyle,
          onPlaneDetected: () => {},
          onPlacement: () => {
            setStatusText(
              "Artwork recentered to view. Move camera and pinch to resize.",
            );
          },
        }}
      />

      <View
        pointerEvents="box-none"
        style={[styles.overlay, { paddingTop: insets.top + 8 }]}
      >
        <View style={styles.topRow}>
          <Pressable onPress={props.onClose} style={styles.iconButton}>
            <Ionicons name="close" size={24} color="#fff" />
          </Pressable>
          <View style={styles.titleWrap}>
            <Text numberOfLines={1} style={styles.title}>
              {props.artworkTitle}
            </Text>
            <Text style={styles.subtitle}>
              {formatDimensions(
                props.artworkDimensions.width,
                props.artworkDimensions.height,
              )}
            </Text>
          </View>
        </View>

        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
          <Text style={styles.status}>{statusText}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000",
  },
  ar: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 12,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  titleWrap: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  title: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  subtitle: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    marginTop: 2,
  },
  bottomBar: {
    paddingHorizontal: 16,
  },
  status: {
    color: "#fff",
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
});
