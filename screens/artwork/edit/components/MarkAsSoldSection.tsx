import { Text, View } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import LongBlackButton from "#components/buttons/LongBlackButton";
import ConfirmationModal from "#components/modal/ConfirmationModal";
import { updateArtwork } from "#services/artwork/updateArtwork";
import { useModalStore } from "#store/account/modal/modalStore";
import { useQueryClient } from "@tanstack/react-query";
import CardHeaderStripe from "#components/general/CardHeaderStripe";
import tw from "twrnc";

export default function MarkAsSoldSection({
  art_id,
  availability,
  onMarkAsSoldSuccess,
}: {
  art_id: string;
  availability: boolean;
  onMarkAsSoldSuccess: () => void;
}) {
  const { updateModal } = useModalStore();
  const queryClient = useQueryClient();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleMarkAsSold = async () => {
    setShowConfirm(false);
    setIsLoading(true);
    try {
      const result = await updateArtwork({ availability: false }, art_id);
      if (!result.isOk) {
        updateModal({
          message:
            result.message ??
            "Unable to mark artwork as sold. Please try again.",
          modalType: "error",
          showModal: true,
        });
        return;
      }
      queryClient.invalidateQueries({
        queryKey: ["artworks", "galleryOrArtist", "all"],
      });
      queryClient.invalidateQueries({ queryKey: ["artwork_single", art_id] });
      updateModal({
        message: "Artwork marked as sold successfully.",
        modalType: "success",
        showModal: true,
        onDismiss: onMarkAsSoldSuccess,
      });
    } catch {
      updateModal({
        message: "An error occurred while marking as sold. Please try again.",
        modalType: "error",
        showModal: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Sold state ── */
  if (!availability) {
    return (
      <View
        style={tw`bg-[#ECFDF5] border border-[#A7F3D0] rounded-sm px-5 py-4 flex-row items-center gap-3`}
      >
        <View
          style={tw`h-9 w-9 rounded-full bg-[#D1FAE5] items-center justify-center`}
        >
          <Ionicons name="checkmark-circle" size={20} color="#10B981" />
        </View>
        <View style={tw`flex-1`}>
          <Text style={tw`font-sans-semibold text-sm text-[#065F46]`}>
            Artwork Sold
          </Text>
          <Text
            style={tw`font-sans-regular text-xs text-[#2D6A4F] leading-5 mt-0.5`}
          >
            No longer available for purchase
          </Text>
        </View>
      </View>
    );
  }

  /* ── Available state ── */
  return (
    <>
      <View
        style={tw`bg-white border border-[#E8ECF4] rounded-sm overflow-hidden`}
      >
        <CardHeaderStripe title="Mark as Sold" icon="checkmark-done-outline" />

        <View style={tw`p-5 gap-4`}>
          <Text style={tw`font-sans-regular text-xs text-[#7A8AA8] leading-5`}>
            Sold artworks remain in your inventory but will no longer be
            available for purchase.{" "}
            <Text style={tw`font-sans-semibold text-[#0F172A]`}>
              This action is permanent.
            </Text>
          </Text>

          <LongBlackButton
            value="Mark as Sold"
            onClick={() => setShowConfirm(true)}
            isLoading={isLoading}
            outline
            borderColor="#0F172A"
            style={tw`h-12 rounded-sm`}
            textStyle={tw`font-sans-medium text-xs tracking-widest`}
          />
        </View>
      </View>

      <ConfirmationModal
        isVisible={showConfirm}
        onClose={() => setShowConfirm(false)}
        child={
          <ConfirmMarkSoldSheet
            onConfirm={handleMarkAsSold}
            onCancel={() => setShowConfirm(false)}
            isLoading={isLoading}
          />
        }
      />
    </>
  );
}

function ConfirmMarkSoldSheet({
  onConfirm,
  onCancel,
  isLoading,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  return (
    <View style={tw`gap-3.5`}>
      <Text style={tw`font-sans-bold text-lg text-[#0F172A]`}>
        Mark Artwork as Sold?
      </Text>

      <Text style={tw`font-sans-regular text-sm text-slate-500 leading-5`}>
        Are you sure you want to mark this artwork as sold? This action cannot
        be undone, and the artwork will no longer be available for purchase.
      </Text>

      <View style={tw`gap-2.5`}>
        <LongBlackButton
          value={isLoading ? "Saving…" : "Yes, Mark as Sold"}
          onClick={onConfirm}
          isLoading={isLoading}
          isDisabled={isLoading}
        />
        <LongBlackButton value="Cancel" onClick={onCancel} outline />
      </View>
    </View>
  );
}
