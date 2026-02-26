import { View, Text, Pressable } from "react-native";
import ProgressiveImage from "#components/general/ProgressiveImage";
import React from "react";
import { getEditorialImageFilePreview } from "#lib/editorial/lib/getEditorialImageFilePreview";
import { Feather } from "@expo/vector-icons";
import tw from "twrnc";
import dayjs from "dayjs";

type EditorialCardProps = {
  readonly cover: string;
  readonly headline: string;
  readonly width: number;
  readonly onPress: () => void;
  readonly date?: string;
  readonly showDetails?: boolean;
};

export default function EditorialCard({
  cover,
  headline,
  width,
  onPress,
  date,
  showDetails,
}: EditorialCardProps) {
  const highResUri = getEditorialImageFilePreview(cover, 500);
  const lowResUri = getEditorialImageFilePreview(cover, 20, 20);

  const formattedDate = date
    ? dayjs(date).format("MMM YYYY").toUpperCase()
    : "";

  const imageHeight = showDetails ? 160 : 220; // h-40 is 160px

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
    >
      <View
        style={[
          { width },
          showDetails
            ? tw`bg-white rounded-md border border-[#EFEFEF] pb-5 shadow-sm shadow-black elevation-2`
            : null,
        ]}
      >
        <ProgressiveImage
          thumbnailSource={{ uri: lowResUri }}
          source={{ uri: highResUri }}
          containerStyle={[
            tw`w-full bg-[#858585]`,
            showDetails
              ? tw`rounded-t-md rounded-b-none h-40`
              : tw`h-[220px] rounded-md`,
            { height: imageHeight },
          ]}
          imageStyle={[
            tw`w-full`,
            showDetails
              ? tw`rounded-t-md rounded-b-none h-40`
              : tw`h-[220px] rounded-md`,
            { height: imageHeight },
          ]}
          resizeMode="cover"
        />
        <View style={showDetails ? tw`px-2.5` : null}>
          <Text
            numberOfLines={2}
            style={[
              tw`font-serif text-sm text-[#0F172A] mt-[15px] font-medium`,
              showDetails ? tw`mt-2.5 mb-[15px] leading-5` : null,
            ]}
          >
            {headline}
          </Text>

          {showDetails && (
            <View style={tw`flex-row justify-between items-center mt-auto`}>
              <View style={tw`flex-row items-center gap-1`}>
                <Text
                  style={[
                    tw`text-[10px] tracking-wider text-neutral-500 font-medium uppercase font-sans-medium`,
                  ]}
                >
                  Read Story
                </Text>
                <Feather
                  name="arrow-right"
                  size={14}
                  style={tw`text-neutral-500`}
                />
              </View>
              <Text
                style={[
                  tw`text-[10px] text-neutral-500 font-medium tracking-wider font-sans-medium`,
                ]}
              >
                {formattedDate}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}
