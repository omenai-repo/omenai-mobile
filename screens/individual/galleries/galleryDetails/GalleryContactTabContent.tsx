import React, { useMemo } from "react";
import { Linking, Pressable, Text, View } from "react-native";
import tw from "twrnc";
import { useGalleryContact } from "#screens/individual/hooks/useGalleries";

type Props = { galleryId: string; isActive: boolean };

export default function GalleryContactTabContent({ galleryId, isActive }: Props) {
  const { data, isLoading, isError } = useGalleryContact(galleryId, isActive);

  const mapUrl = useMemo(() => {
    if (!data) return null;
    const address = data.address || {};
    const addressLine = address.address_line || "";
    const cityStateZip = [address.city, address.state, address.zip].filter(Boolean).join(", ");
    const queryParts = [data.name, addressLine, cityStateZip, address.country].filter(Boolean);
    if (queryParts.length < 2) return null;
    const q = encodeURIComponent(queryParts.join(", "));
    return `https://www.google.com/maps/search/?api=1&query=${q}`;
  }, [data]);

  const openMap = () => {
    if (mapUrl) Linking.openURL(mapUrl);
  };

  if (!isActive) return null;

  if (isLoading) {
    return (
      <View style={tw`py-20 items-center`}>
        <Text style={tw`text-xs uppercase tracking-widest text-neutral-400`}>Loading contact details...</Text>
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={tw`py-20 px-4`}>
        <Text style={tw`text-center text-xs uppercase text-neutral-400`}>
          Contact information is not available right now.
        </Text>
      </View>
    );
  }

  const address = data.address || {};
  const addressLine = address.address_line || "";
  const cityStateZip = [address.city, address.state, address.zip].filter(Boolean).join(", ");

  return (
    <View style={tw`flex-1 px-4 pb-16 pt-6`}>
      <Text style={tw`font-serif text-2xl text-neutral-900 mb-8`}>Gallery location</Text>

      <View style={tw`mb-8`}>
        <Text
          style={tw`text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-sans-medium mb-4`}
        >
          Gallery address
        </Text>
        <View style={tw`gap-1`}>
          <Text style={tw`text-sm text-neutral-900 font-sans-medium uppercase tracking-wide`}>
            {data.name}
          </Text>
          {!!addressLine && <Text style={tw`text-sm text-neutral-500 font-sans-regular uppercase`}>{addressLine}</Text>}
          {!!cityStateZip && <Text style={tw`text-sm text-neutral-500 font-sans-regular uppercase`}>{cityStateZip}</Text>}
          {!!address.country && <Text style={tw`text-sm text-neutral-500 font-sans-regular uppercase`}>{address.country}</Text>}
        </View>
      </View>

      {mapUrl && (
        <Pressable
          onPress={openMap}
          style={({ pressed }) => [tw`mb-8 border border-neutral-200 bg-neutral-50 rounded-sm py-4 px-4`, pressed && tw`opacity-90`]}
        >
          <Text style={tw`text-center text-sm font-sans text-neutral-900`}>Open in Maps</Text>
        </Pressable>
      )}

      <View style={tw`pt-8 mt-4 border-t border-neutral-100`}>
        <Text style={tw`text-xs text-neutral-400 font-sans-regular leading-5`}>
          To inquire about purchasing artworks, open a specific work and use Request price. Transactions are
          handled securely through Omenai.
        </Text>
      </View>
    </View>
  );
}
