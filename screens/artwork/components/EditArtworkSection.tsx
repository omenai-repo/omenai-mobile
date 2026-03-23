import React, { forwardRef, useCallback, useMemo, useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import tw from "twrnc";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useQueryClient } from "@tanstack/react-query";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { colors } from "#config/colors.config";
import { useModalStore } from "#store/modal/modalStore";
import { screenName } from "#constants/screenNames.constants";
import { updateArtwork } from "#services/artworks/updateArtwork";
import { deleteArtwork } from "#services/artworks/deleteArtwork";
import LongBlackButton from "#components/buttons/LongBlackButton";

type EditArtworkModalProps = Readonly<{
  art_id: string;
  currentDescription: string;
}>;

const EditArtworkModal = forwardRef<BottomSheetModal, EditArtworkModalProps>(
  ({ art_id, currentDescription }, ref) => {
    const navigation = useNavigation<StackNavigationProp<any>>();
    const queryClient = useQueryClient();
    const { updateModal, updateConfirmationModal, clear } = useModalStore();

    const [description, setDescription] = useState(currentDescription ?? "");
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const hasChanges = description.trim() !== (currentDescription ?? "").trim();

    const snapPoints = useMemo(() => ["70%"], []);

    const dismiss = useCallback(() => {
      if (ref && "current" in ref) {
        ref.current?.dismiss();
      }
    }, [ref]);

    const handleSave = async () => {
      if (!hasChanges || description.trim() === "") return;

      setSaving(true);
      try {
        const result = await updateArtwork(
          { artwork_description: description.trim() },
          art_id,
        );

        if (result.isOk) {
          await queryClient.invalidateQueries({
            queryKey: ["artwork", art_id],
          });
          await queryClient.invalidateQueries({
            queryKey: ["artworks"],
          });
          dismiss();
          updateModal({
            message: "Artwork updated successfully",
            modalType: "success",
            showModal: true,
          });
        } else {
          updateModal({
            message: result.message || "Failed to update artwork",
            modalType: "error",
            showModal: true,
          });
        }
      } catch {
        updateModal({
          message: "An error occurred. Please try again.",
          modalType: "error",
          showModal: true,
        });
      } finally {
        setSaving(false);
      }
    };

    const handleDelete = async () => {
      setDeleting(true);
      clear();
      try {
        const result = await deleteArtwork(art_id);
        if (result.isOk) {
          await Promise.all([
            queryClient.invalidateQueries({
              queryKey: ["artworks", "galleryOrArtist", "all"],
            }),
            queryClient.invalidateQueries({
              queryKey: ["artworks"],
            }),
          ]);
          queryClient.removeQueries({ queryKey: ["artwork", art_id] });
          dismiss();
          updateModal({
            message: "Artwork successfully deleted",
            modalType: "success",
            showModal: true,
            onDismiss: () => {
              navigation.navigate(screenName.gallery.artworks);
            },
          });
        } else {
          updateModal({
            message:
              result.message || "Error deleting artwork, try again later",
            modalType: "error",
            showModal: true,
          });
        }
      } catch {
        updateModal({
          message: "An error occurred. Please try again.",
          modalType: "error",
          showModal: true,
        });
      } finally {
        setDeleting(false);
      }
    };

    const openDeleteConfirm = () => {
      updateConfirmationModal({
        child: (
          <View>
            <View style={tw`flex-row items-center gap-3 mb-4`}>
              <Ionicons name="warning" size={22} color="#dc2626" />
              <Text style={tw`text-base font-semibold text-red-700 flex-1`}>
                Delete Artwork
              </Text>
              <Pressable onPress={clear} hitSlop={8}>
                <Ionicons name="close" size={20} color="#666" />
              </Pressable>
            </View>
            <Text style={tw`text-sm text-slate-600 leading-relaxed mb-5`}>
              Are you sure you want to delete this artwork? This action cannot
              be undone and will remove the piece from all public listings.
            </Text>
            <View style={tw`gap-3`}>
              <LongBlackButton
                value="Yes, delete artwork"
                onClick={handleDelete}
                style={tw`bg-red-600 border-red-600`}
                textStyle={tw`font-sans-medium`}
              />
              <LongBlackButton
                value="Cancel"
                outline
                borderColor={tw.color("red-600")}
                textStyle={tw`font-sans-medium`}
                onClick={clear}
              />
            </View>
          </View>
        ),
      });
    };

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            opacity={0.5}
          />
        )}
        handleIndicatorStyle={tw`bg-slate-300 w-10`}
        backgroundStyle={tw`bg-white rounded-t-3xl`}
      >
        <BottomSheetScrollView
          contentContainerStyle={tw`px-5 pb-10`}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={tw`flex-row items-center justify-between mb-6`}>
            <View style={tw`flex-row items-center gap-2`}>
              <Feather name="edit-2" size={16} color={colors.primary_black} />
              <Text style={tw`text-lg font-semibold text-slate-900`}>
                Edit Artwork
              </Text>
            </View>
            <Pressable onPress={dismiss} hitSlop={8}>
              <Ionicons name="close" size={22} color="#666" />
            </Pressable>
          </View>

          {/* Description Input */}
          <Text style={tw`text-sm font-medium text-slate-500 mb-2`}>
            Description
          </Text>
          <TextInput
            multiline
            numberOfLines={6}
            value={description}
            onChangeText={setDescription}
            placeholder="Tell the story behind this piece..."
            placeholderTextColor="#a1a1aa"
            textAlignVertical="top"
            style={[
              tw`border border-slate-200 rounded-md p-3 text-sm text-slate-800 leading-relaxed`,
              { minHeight: 120 },
            ]}
          />

          <LongBlackButton
            value="Save Changes"
            onClick={handleSave}
            isLoading={saving}
            isDisabled={!hasChanges || saving}
            style={tw`mt-4`}
          />

          {/* Danger Zone */}
          <View
            style={tw`border border-red-200 rounded-xl overflow-hidden bg-red-50/30 mt-8`}
          >
            <View style={tw`px-4 py-4`}>
              <Text style={tw`text-base font-semibold text-red-800`}>
                Danger Zone
              </Text>
              <Text style={tw`text-sm text-red-600/80 mt-1 leading-relaxed`}>
                Permanently delete this artwork from your gallery. This action
                cannot be undone.
              </Text>

              <LongBlackButton
                value="Delete Artwork"
                onClick={openDeleteConfirm}
                isLoading={deleting}
                outline
                borderColor={tw.color("red-600")}
                style={tw`mt-4`}
              />
            </View>
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  },
);

EditArtworkModal.displayName = "EditArtworkModal";

export default EditArtworkModal;
