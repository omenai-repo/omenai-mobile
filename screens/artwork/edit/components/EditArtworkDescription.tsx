import { Text, View } from "react-native";
import React from "react";
import LargeInput from "#components/inputs/LargeInput";
import tw from "twrnc";
import FormSectionHeader from "#components/general/FormSectionHeader";

type EditArtworkDescriptionProps = {
  description: string;
  onChangeText: (text: string) => void;
};

export default function EditArtworkDescription({
  description,
  onChangeText,
}: EditArtworkDescriptionProps) {
  const maxLength = 500;

  return (
    <View style={tw`bg-white rounded-sm border border-neutral-200 p-5`}>
      <FormSectionHeader
        title="Description"
        subtitle="Share the story, medium & inspiration behind the work"
      />

      <LargeInput
        label=""
        value={description}
        onInputChange={onChangeText}
        placeHolder="Tell the story behind this piece…"
        height={160}
      />

      <Text
        style={tw`mt-2 text-right text-xs text-[#B0BBCE] font-sans-regular`}
      >
        {description.length} / {maxLength}
      </Text>
    </View>
  );
}
