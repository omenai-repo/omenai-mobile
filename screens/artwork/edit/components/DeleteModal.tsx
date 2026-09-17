import { Text, View } from "react-native";
import React from "react";
import LongBlackButton from "#components/buttons/LongBlackButton";
import tw from "twrnc";

type DeleteModalProps = Readonly<{
  onDelete: () => void;
  onCancel: () => void;
  loading: boolean;
}>;

export default function DeleteModal({
  onDelete,
  onCancel,
  loading,
}: DeleteModalProps) {
  return (
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
          onClick={onDelete}
          isLoading={loading}
          style={tw`bg-red-600 border border-red-600`}
        />
        <LongBlackButton
          value="Cancel"
          onClick={onCancel}
          outline
          borderColor="#DC2626"
        />
      </View>
    </View>
  );
}
