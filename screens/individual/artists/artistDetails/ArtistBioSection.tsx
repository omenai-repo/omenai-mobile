import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import tw from "twrnc";

type Props = {
  readonly bio?: string | null;
};

export default function ArtistBioSection({ bio }: Readonly<Props>) {
  const [expanded, setExpanded] = useState(false);
  const trimmed = (bio ?? "").trim();

  if (!trimmed) return null;

  const wordCount = trimmed.split(/\s+/).length;
  const shouldShowToggle = wordCount > 40;

  return (
    <View style={tw`px-5 py-8 border-b border-neutral-100 bg-white`}>
      <Text
        style={tw`text-xs uppercase tracking-widest text-neutral-400 font-sans-medium mb-4`}
      >
        Biography
      </Text>
      <Text
        style={tw`font-serif text-base text-neutral-700 leading-relaxed`}
        numberOfLines={expanded || !shouldShowToggle ? undefined : 5}
      >
        {trimmed}
      </Text>
      {shouldShowToggle && (
        <Pressable onPress={() => setExpanded((v) => !v)} style={tw`mt-3`}>
          <Text
            style={tw`text-xs uppercase tracking-widest text-neutral-600 font-sans-medium`}
          >
            {expanded ? "Read less" : "Read more"}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
