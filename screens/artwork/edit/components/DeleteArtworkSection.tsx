import { Text, View } from "react-native";
import React, { useState } from "react";
import { useModalStore } from "#store/account/modal/modalStore";
import CardHeaderStripe from "#components/general/CardHeaderStripe";
import tw from "twrnc";
import LongBlackButton from "#components/buttons/LongBlackButton";
import { deleteArtwork } from "#services/artwork/deleteArtwork";
import DeleteModal from "./DeleteModal";

export default function DeleteArtworkSection({
  art_id,
  onDeleteSuccess,
}: Readonly<{
  art_id: string;
  onDeleteSuccess: () => void;
}>) {
  const { updateConfirmationModal, clear, updateModal } = useModalStore();

  const [loading, setLoading] = useState<boolean>(false);

  const openConfirmModal = () => {
    updateConfirmationModal({
      child: (
        <DeleteModal
          onDelete={handleDelete}
          onCancel={clear}
          loading={loading}
        />
      ),
    });
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
