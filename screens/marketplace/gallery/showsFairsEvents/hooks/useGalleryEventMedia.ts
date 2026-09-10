import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import type { PickedAsset } from "../helpers/createEventHelpers";

export function useGalleryEventMedia(updateModal: any) {
  const [coverAsset, setCoverAsset] = useState<PickedAsset | null>(null);
  const [coverPreviewUri, setCoverPreviewUri] = useState("");
  const [installationAssets, setInstallationAssets] = useState<PickedAsset[]>([]);

  const pickCover = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      updateModal({
        showModal: true,
        modalType: "error",
        message: "Photo library access is required to set a cover image.",
      });
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.9,
    });
    if (res.canceled || !res.assets?.[0]) return;
    const a = res.assets[0];
    setCoverAsset({
      uri: a.uri,
      mimeType: a.mimeType || "image/jpeg",
      name: a.fileName || `cover-${Date.now()}.jpg`,
    });
    setCoverPreviewUri(a.uri);
  };

  const addInstallationImages = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 1,
      selectionLimit: 12,
    });
    if (res.canceled || !res.assets?.length) return;
    const next: PickedAsset[] = res.assets.map((a, i) => ({
      uri: a.uri,
      mimeType: a.mimeType || "image/jpeg",
      name: a.fileName || `installation-${Date.now()}-${i}.jpg`,
    }));
    setInstallationAssets((prev) => [...prev, ...next]);
  };

  const removeInstallationAt = (index: number) => {
    setInstallationAssets((prev) => prev.filter((_, i) => i !== index));
  };

  return {
    coverAsset,
    coverPreviewUri,
    installationAssets,
    pickCover,
    addInstallationImages,
    removeInstallationAt,
  };
}
