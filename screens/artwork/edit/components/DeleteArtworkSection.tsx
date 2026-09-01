import { Text, View, Pressable } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useModalStore } from "#store/account/modal/modalStore";
import CardHeaderStripe from "#components/general/CardHeaderStripe";
import tw from "twrnc";
import LongBlackButton from "#components/buttons/LongBlackButton";
import { deleteArtwork } from "#services/artwork/deleteArtwork";

export default function DeleteArtworkSection({
  art_id,
  onDeleteSuccess,
}: {
  art_id: string;
  onDeleteSuccess: () => void;
}) {
  const { updateConfirmationModal, clear, updateModal } = useModalStore();

  const [loading, setLoading] = useState<boolean>(false);

  const openConfirmModal = () => {
    updateConfirmationModal({ child: <DeleteModal /> });
  };

  const handleDelete = async () => {
    setLoading(true);
    clear();
    const deleteArtworkData = await deleteArtwork(art_id);
    if (deleteArtworkData?.isOk) {
      updateModal({
        message: "Artwork successfully deleted",
        modalType: "success",
        showModal: true,
        onDismiss: onDeleteSuccess,
      });
    } else {
      updateModal({
        message: "Error deleting artwork, try again later",
        modalType: "error",
        showModal: true,
      });
    }
    setLoading(false);
  };

  const DeleteModal = () => (
    <View>
      <Text style={tw`font-sans-semibold text-lg text-[#B91C1C] mb-4`}>
        Delete Artwork
      </Text>

      <Text style={tw`font-sans-regular text-sm text-slate-500 leading-5 mb-5`}>
        Are you sure you want to delete this artwork? This action cannot be
        undone and will remove the piece from all public listings.
      </Text>

      <View style={tw`gap-3`}>
        <LongBlackButton
          value="Yes, delete artwork"
          onClick={handleDelete}
          isLoading={loading}
          style={tw`bg-red-600 border border-red-600`}
        />
        <LongBlackButton
          value="Cancel"
          onClick={clear}
          outline
          borderColor="#DC2626"
        />
      </View>
    </View>
  );

  return (
    <View
      style={tw`bg-[#FFF5F5] border border-[#FECACA] rounded-sm overflow-hidden`}
    >
      <CardHeaderStripe
        title="Danger Zone"
        icon="warning-outline"
        variant="danger"
      />

      <View style={tw`px-5 py-4 gap-4`}>
        <Text style={tw`font-sans-regular text-xs text-[#B91C1C] leading-5`}>
          Permanently delete this artwork.{" "}
          <Text style={tw`font-sans-semibold`}>
            This action cannot be undone
          </Text>{" "}
          and will remove the piece from all public listings.
        </Text>

        <LongBlackButton
          value="Delete Artwork"
          onClick={openConfirmModal}
          isLoading={loading}
          outline
          borderColor="#DC2626"
          textStyle={tw`text-[#DC2626]`}
        />
      </View>
    </View>
  );
}
