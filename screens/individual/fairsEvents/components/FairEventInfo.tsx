import React, { useMemo, useState } from "react";
import { Linking, Pressable, Text, View } from "react-native";
import tw from "twrnc";
import type { GalleryEventRecord } from "#services/events/events.service";

type Props = {
  readonly event: GalleryEventRecord;
};

function InfoBlock({
  label,
  children,
}: Readonly<{
  label: string;
  children: React.ReactNode;
}>) {
  return (
    <View style={tw`pt-5 border-t border-neutral-200`}>
      <Text style={tw`text-xs uppercase tracking-widest font-sans-regular text-black`}>
        {label}
      </Text>
      <View style={tw`mt-3 gap-3`}>{children}</View>
    </View>
  );
}

export default function FairEventInfo({ event }: Readonly<Props>) {
  const [descExpanded, setDescExpanded] = useState(false);

  const description = event.description || "No curatorial statement available.";
  const descWords = description.split(" ");
  const isLongDesc = descWords.length > 70;
  const displayedDesc =
    isLongDesc && !descExpanded ? `${descWords.slice(0, 70).join(" ")}...` : description;

  const formattedStart = useMemo(
    () =>
      new Date(event.start_date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      }),
    [event.start_date],
  );

  const formattedEnd = useMemo(
    () =>
      new Date(event.end_date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    [event.end_date],
  );

  const handleOpenViewingRoom = async () => {
    if (!event.external_url) return;
    const supported = await Linking.canOpenURL(event.external_url);
    if (supported) await Linking.openURL(event.external_url);
  };

  return (
    <View style={tw`px-5 py-20 gap-12 border-b border-neutral-200`}>
      {/* Gallery + Title */}
      <View style={tw`border-t border-neutral-500 pt-5 gap-4`}>
        <Text style={tw`text-xs uppercase tracking-widest font-sans-font-sans-medium text-black`}>
          {event.gallery?.name || "Gallery"}
        </Text>
        <Text style={tw`font-serif text-4xl leading-tight tracking-tight text-black`}>
          {event.title}
        </Text>
      </View>

      {/* Dates */}
      <InfoBlock label="Dates">
        <Text style={tw`text-base text-neutral-700 font-sans-regular`}>{formattedStart}</Text>
        <Text style={tw`text-xs uppercase tracking-widest text-neutral-400 font-sans-regular`}>
          Through
        </Text>
        <Text style={tw`text-base text-neutral-700 font-sans-regular`}>{formattedEnd}</Text>
      </InfoBlock>

      {/* Location */}
      {(event.location?.venue || event.location?.city) && (
        <InfoBlock label="Location">
          {!!event.location?.venue && (
            <Text style={tw`text-base text-neutral-700 font-sans-regular`}>{event.location.venue}</Text>
          )}
          {!!event.location?.city && (
            <Text style={tw`text-base text-neutral-500 font-sans-regular`}>
              {event.location.city}
              {event.location?.country ? `, ${event.location.country}` : ""}
            </Text>
          )}
        </InfoBlock>
      )}

      {/* Booth Number */}
      {!!event.booth_number && (
        <InfoBlock label="Booth Number">
          <Text style={tw`text-base text-neutral-700 font-sans-regular`}>{event.booth_number}</Text>
        </InfoBlock>
      )}

      {/* Works */}
      {!!event.artworks?.length && (
        <InfoBlock label="Works">
          <Text style={tw`font-serif text-6xl leading-tight tracking-tight text-black`}>
            {event.artworks.length}
          </Text>
        </InfoBlock>
      )}

      {/* External URL CTA */}
      {!!event.external_url && (
        <View style={tw`pt-5 mt-5`}>
          <Pressable
            onPress={handleOpenViewingRoom}
            style={tw`bg-black py-4 px-4 items-center`}
          >
            <Text style={tw`text-white text-xs uppercase tracking-widest font-sans-regular`}>
              Enter Viewing Room
            </Text>
          </Pressable>
        </View>
      )}

      {/* Curatorial Statement */}
      <View style={tw`pt-5 border-t border-neutral-500`}>
        <Text style={tw`text-xs uppercase tracking-widest font-sans-medium text-black mb-10`}>
          Curatorial Statement
        </Text>
        <Text style={tw`font-serif text-lg leading-9 text-neutral-800`}>
          {displayedDesc}
        </Text>
        {isLongDesc && (
          <Pressable
            onPress={() => setDescExpanded((prev) => !prev)}
            style={tw`mt-8 flex-row items-center`}
          >
            <Text style={tw`text-xs uppercase tracking-widest text-neutral-500 font-sans-regular`}>
              {descExpanded ? "Show Less" : "Continue Reading"}
            </Text>
            <Text style={tw`text-neutral-500 ml-2 font-sans-regular`}>{descExpanded ? "↑" : "↓"}</Text>
          </Pressable>
        )}
      </View>

    </View>
  );
}
