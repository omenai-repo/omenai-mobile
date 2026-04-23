import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useMutation } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import { appwriteConfig } from "#config/appwrite.config";
import { updateEventInstallationViews } from "#services/events/events.service";
import { getPromotionalFileView } from "#lib/storage/getPromotionalsFileView";
import { useModalStore } from "#store/modal/modalStore";
import { uploadToAppwrite } from "#utils/uploadToAppwrite";
import { storage } from "#appWrite_config";

type InstallationViewsManagerProps = {
  eventId: string;
  galleryId: string;
  existingViews: string[];
  onUploadSuccess: () => void;
};

export default function InstallationViewsManager({
  eventId,
  galleryId,
  existingViews,
  onUploadSuccess,
}: InstallationViewsManagerProps) {
  const { updateModal, updateConfirmationModal, clear } = useModalStore();
  const windowWidth = Dimensions.get("window").width;
  const slideWidth = windowWidth - 56;
  const slideGap = 12;
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const onViewableItemsChanged = useRef(
    ({
      viewableItems,
    }: {
      viewableItems: { index: number | null }[];
    }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setActiveIndex(viewableItems[0].index);
      }
    },
  ).current;
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 60,
  }).current;

  useEffect(() => {
    if (activeIndex >= existingViews.length) {
      setActiveIndex(Math.max(0, existingViews.length - 1));
    }
  }, [existingViews.length, activeIndex]);

  const addInstallationViewMutation = useMutation({
    mutationFn: (imageId: string) =>
      updateEventInstallationViews(eventId, galleryId, imageId, "add"),
    onSuccess: async (result) => {
      if (!result.isOk) {
        updateModal({
          showModal: true,
          modalType: "error",
          message: result.message || "Unable to update installation views.",
        });
        return;
      }

      onUploadSuccess();
      updateModal({
        showModal: true,
        modalType: "success",
        message: "Installation image added.",
      });
    },
  });

  const handleAddInstallationImage = async () => {
    if (!galleryId) {
      updateModal({
        showModal: true,
        modalType: "error",
        message: "Unable to identify your gallery account.",
      });
      return;
    }

    if (!appwriteConfig.promotionalBucketId) {
      updateModal({
        showModal: true,
        modalType: "error",
        message: "Promotional storage bucket is not configured.",
      });
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.9,
    });

    if (pickerResult.canceled || !pickerResult.assets?.length) return;
    const asset = pickerResult.assets[0];

    try {
      const upload = await uploadToAppwrite({
        bucketId: appwriteConfig.promotionalBucketId,
        file: {
          uri: asset.uri,
          name: asset.fileName || `installation-${Date.now()}.jpg`,
          type: asset.mimeType || "image/jpeg",
        },
        fallbackName: `installation-${Date.now()}.jpg`,
        fallbackType: "image/jpeg",
        errorMessage: "Failed to upload installation image",
      });

      addInstallationViewMutation.mutate(upload.$id);
    } catch (error: any) {
      updateModal({
        showModal: true,
        modalType: "error",
        message: error?.message || "Unable to upload selected image.",
      });
    }
  };

  const removeInstallationViewMutation = useMutation({
    mutationFn: async (imageId: string) => {
      if (!appwriteConfig.promotionalBucketId) {
        throw new Error("Promotional storage bucket is not configured.");
      }

      await storage.deleteFile({
        bucketId: appwriteConfig.promotionalBucketId,
        fileId: imageId,
      });

      return updateEventInstallationViews(eventId, galleryId, imageId, "remove");
    },
    onSuccess: async (result) => {
      if (!result.isOk) {
        updateModal({
          showModal: true,
          modalType: "error",
          message: result.message || "Unable to remove installation view.",
        });
        return;
      }

      onUploadSuccess();
      updateModal({
        showModal: true,
        modalType: "success",
        message: "Installation image removed.",
      });
    },
    onError: (error: any) => {
      console.log(error);
      updateModal({
        showModal: true,
        modalType: "error",
        message: error?.message || "Unable to remove installation view.",
      });
    },
    onSettled: () => {
      setDeletingId(null);
    },
  });

  const handleConfirmRemove = (imageId: string) => {
    updateConfirmationModal({
      child: (
        <View style={tw`p-5`}>
          <Text style={tw`text-base text-neutral-900 mb-2`}>
            Remove Installation View
          </Text>
          <Text style={tw`text-sm text-neutral-600 mb-5`}>
            Are you sure you want to remove this installation view? This action
            cannot be undone.
          </Text>
          <View style={tw`flex-row gap-3`}>
            <TouchableOpacity
              style={tw`flex-1 py-3 border border-neutral-300 rounded-sm items-center`}
              activeOpacity={0.85}
              onPress={() => clear()}
            >
              <Text style={tw`text-sm text-neutral-700`}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`flex-1 py-3 bg-red-600 rounded-sm items-center`}
              activeOpacity={0.85}
              onPress={() => {
                clear();
                setDeletingId(imageId);
                removeInstallationViewMutation.mutate(imageId);
              }}
            >
              <Text style={tw`text-sm text-white`}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      ),
    });
  };

  return (
    <View style={tw`bg-white rounded-md border border-neutral-200 p-3 mb-4`}>
      <View style={tw`flex-row items-center justify-between mb-2`}>
        <View>
          <Text style={tw`text-sm text-neutral-900`}>Installation Views</Text>
          <Text style={tw`text-xs text-neutral-500`}>
            Provide spatial context with in-room photography.
          </Text>
          {!!existingViews.length && (
            <Text style={tw`text-[10px] text-neutral-400 mt-1`}>
              {existingViews.length} uploaded
            </Text>
          )}
        </View>
        <TouchableOpacity
          style={tw`px-3 py-2 border border-neutral-300 rounded-sm`}
          activeOpacity={0.8}
          onPress={handleAddInstallationImage}
          disabled={addInstallationViewMutation.isPending}
        >
          <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-700`}>
            {addInstallationViewMutation.isPending ? "Uploading..." : "Add Images"}
          </Text>
        </TouchableOpacity>
      </View>

      {existingViews.length === 0 ? (
        <View style={tw`h-44 rounded-md bg-neutral-100 items-center justify-center`}>
          <Ionicons name="image-outline" size={28} color="#A3A3A3" />
          <Text style={tw`text-xs text-neutral-500 mt-2`}>
            No installation views uploaded yet.
          </Text>
        </View>
      ) : (
        <View>
          <FlatList
            data={existingViews}
            horizontal
            pagingEnabled={false}
            snapToInterval={slideWidth + slideGap}
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => `${item}-${index}`}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            onMomentumScrollEnd={(e) => {
              const offsetX = e.nativeEvent.contentOffset.x;
              const index = Math.round(
                offsetX / (slideWidth + slideGap),
              );
              if (index >= 0 && index < existingViews.length) {
                setActiveIndex(index);
              }
            }}
            getItemLayout={(_, index) => ({
              length: slideWidth + slideGap,
              offset: (slideWidth + slideGap) * index,
              index,
            })}
            renderItem={({ item }) => {
              const isDeleting = deletingId === item;
              return (
                <View
                  style={[
                    tw`h-56 rounded-md bg-neutral-200 mr-3 overflow-hidden`,
                    { width: slideWidth },
                  ]}
                >
                  <Image
                    source={{
                      uri: /^https?:\/\//i.test(item)
                        ? item
                        : getPromotionalFileView(item, 1400),
                    }}
                    style={tw`w-full h-full`}
                    resizeMode="cover"
                  />
                  <View style={tw`absolute top-2 right-2`}>
                    <TouchableOpacity
                      style={tw`px-3 py-2 bg-red-600/90 rounded-sm`}
                      activeOpacity={0.85}
                      onPress={() => handleConfirmRemove(item)}
                      disabled={
                        isDeleting || removeInstallationViewMutation.isPending
                      }
                    >
                      {isDeleting ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Text
                          style={tw`text-[10px] uppercase tracking-widest text-white`}
                        >
                          Remove
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          />
          {existingViews.length > 1 && (
            <View
              style={tw`flex-row justify-center items-center gap-1.5 mt-3 mb-0.5`}
            >
              {existingViews.map((_, i) => (
                <View
                  key={i}
                  style={
                    i === activeIndex
                      ? tw`h-1.5 w-5 rounded-full bg-neutral-800`
                      : tw`h-1.5 w-1.5 rounded-full bg-neutral-300`
                  }
                />
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
}
