import { Text, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import LongBlackButton from "#components/buttons/LongBlackButton";
import tw from "twrnc";
import { colors } from "#config/colors.config";

type ConfirmSaveArtworkModalProps = {
  onConfirm: () => void;
  onCancel: () => void;
  canSave: boolean;
  isSaving: boolean;
};

export default function ConfirmSaveArtworkModal({
  onConfirm,
  onCancel,
  canSave,
  isSaving,
}: ConfirmSaveArtworkModalProps) {
  return (
    <View style={tw`gap-3`}>
      <View style={tw`flex-row items-center gap-3`}>
        <Text style={tw`font-sans-bold text-lg text-[${colors.black}]`}>
          Save Changes?
        </Text>
      </View>
      <Text style={tw`font-sans-regular text-sm text-slate-500 leading-5`}>
        Are you sure you want to update this artwork? Your changes will be
        published immediately.
      </Text>
      <View style={tw`gap-2.5`}>
        <LongBlackButton
          value="Save Changes"
          onClick={onConfirm}
          isDisabled={!canSave || isSaving}
          isLoading={isSaving}
        />
        <LongBlackButton value="Cancel" onClick={onCancel} outline />
      </View>
    </View>
  );
}
