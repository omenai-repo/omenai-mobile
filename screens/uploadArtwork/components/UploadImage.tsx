import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import UploadImageInput from "#components/inputs/UploadImageInput";
import LongBlackButton from "#components/buttons/LongBlackButton";
import * as ImagePicker from "expo-image-picker";
import { uploadArtworkStore } from "#store/gallery/uploadArtworkStore";
import { useAppStore } from "#store/app/appStore";
import { useModalStore } from "#store/modal/modalStore";

export default function UploadImage({
  handleUpload,
}: Readonly<{
  handleUpload: () => void;
}>) {
  const { image, setImage } = uploadArtworkStore();
  const { userType } = useAppStore();
  const { updateModal } = useModalStore();

  const [isImageChanging, setIsImageChanging] = useState(false);
  const MAX_SIZE_MB = 10;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

  const pickImage = async () => {
    if (image) setIsImageChanging(true);

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/webp",
      ];

      if (asset.mimeType && !allowedTypes.includes(asset.mimeType)) {
        updateModal({
          message: "Please select a PNG, JPEG, JPG, or WEBP image.",
          modalType: "error",
          showModal: true,
        });
        setIsImageChanging(false);
        return;
      }

      // 10MB limit
      if (asset.fileSize && asset.fileSize > MAX_SIZE_BYTES) {
        updateModal({
          message: `Image is too large. Max file size is ${MAX_SIZE_MB}MB.`,
          modalType: "error",
          showModal: true,
        });
        setIsImageChanging(false);
        return;
      }

      setImage(result);
    }
    setIsImageChanging(false);
  };

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 40 }}>
        {!image && !isImageChanging && (
          <UploadImageInput label="Upload image" handlePress={pickImage} />
        )}
        {isImageChanging && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#000" />
            <Text style={{ marginTop: 10, fontSize: 13, color: "#555" }}>
              Loading image...
            </Text>
          </View>
        )}
        {image && !isImageChanging && (
          <Image source={{ uri: image.assets[0].uri }} style={styles.image} />
        )}
      </View>

      <View style={styles.buttonsContainer}>
        {image && (
          <LongBlackButton outline value="Change image" onClick={pickImage} />
        )}
        <LongBlackButton
          value={userType === "gallery" ? "Proceed" : "Get price quote"}
          onClick={handleUpload}
          isLoading={false}
          isDisabled={image === null}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingOverlay: {
    height: 340,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  imageWrapper: {
    position: "relative",
  },
  image: {
    height: 340,
    width: "100%",
    objectFit: "contain",
  },
  changeOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    paddingVertical: 10,
    alignItems: "center",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  changeText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  buttonsContainer: {
    gap: 20,
  },
});
