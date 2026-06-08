import React, { useMemo, useState } from "react";
import { Dimensions, Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import tw from "twrnc";
import ArtworkCard from "#components/artwork/ArtworkCard";
import ArtworksImmersiveModal from "#components/artworks/ArtworksImmersiveModal";
import { screenName } from "#constants/screenNames.constants";
import type { EventArtwork, GalleryEventRecord } from "#services/events/events.service";

type FilterValue = "All" | "Available" | "Sold";

const FILTERS: FilterValue[] = ["All", "Available", "Sold"];
const { width: screenWidth } = Dimensions.get("window");

export default function FairEventWorksSection({ event }: Readonly<{ event: GalleryEventRecord }>) {
  const navigation = useNavigation<any>();
  const [activeFilter, setActiveFilter] = useState<FilterValue>("All");
  const [isImmersiveOpen, setIsImmersiveOpen] = useState(false);

  const allArtworks = useMemo(() => event.artworks ?? [], [event.artworks]);

  const filteredArtworks = useMemo(() => {
    if (activeFilter === "All") return allArtworks;
    if (activeFilter === "Available") return allArtworks.filter((art) => art.availability);
    return allArtworks.filter((art) => !art.availability);
  }, [activeFilter, allArtworks]);

  const columnsData = useMemo(() => {
    const columns: EventArtwork[][] = [[], []];
    filteredArtworks.forEach((item, idx) => columns[idx % 2].push(item));
    return columns;
  }, [filteredArtworks]);

  const cardWidth = (screenWidth - 40 - 12) / 2;

  return (
    <View style={tw`px-5 pt-20 border-t border-neutral-100`}>
      <View style={tw`border-t border-black pt-7 mb-10`}>
        {/* Section Header */}
        <View>
          <Text style={tw`text-xs uppercase tracking-widest font-sans-medium text-black`}>
            Exhibition
          </Text>
          <Text style={tw`font-serif text-4xl leading-9 text-black mt-2`}>
            Featured Works
          </Text>
        </View>

        {/* Filter Pills */}
        <View style={tw`flex-row items-center mt-5`}>
          {FILTERS.map((filter) => (
            <Pressable
              key={filter}
              onPress={() => setActiveFilter(filter)}
              style={[
                tw`px-3 py-1.5 border mr-2`,
                activeFilter === filter
                  ? tw`border-black bg-black`
                  : tw`border-neutral-300 bg-white`,
              ]}
            >
              <Text
                style={[
                  tw`text-[10px] uppercase tracking-[2px] font-medium`,
                  activeFilter === filter ? tw`text-white` : tw`text-neutral-600`,
                ]}
              >
                {filter}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Work Count and Immersive View Toggle */}
        <View style={tw`mt-4 gap-7 flex-row items-end`}>
          <View style={tw`flex-row items-baseline`}>
            <Text style={tw`font-serif text-2xl text-black`}>{filteredArtworks.length}</Text>
            {activeFilter !== "All" && (
              <>
                <Text style={tw`text-neutral-300 mx-1.5`}>/</Text>
                <Text style={tw`text-sm text-neutral-500`}>{allArtworks.length}</Text>
              </>
            )}
            <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-400 ml-1.5`}>
              {filteredArtworks.length === 1 ? "Work" : "Works"}
            </Text>
          </View>
          {filteredArtworks.length > 0 && (
            <Pressable
              onPress={() => setIsImmersiveOpen((v) => !v)}
              style={tw`mt-3 self-start flex-row items-center gap-1.5`}
            >
              <MaterialCommunityIcons name="view-grid" size={16} color={tw.color("neutral-600")} />
              <Text style={tw`text-xs uppercase tracking-widest text-neutral-600 font-sans-regular`}>
                {isImmersiveOpen ? "Close Immersive" : "Immersive View"}
              </Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* No Works Found */}
      {filteredArtworks.length === 0 ? (
        <View style={tw`py-16`}>
          <Text style={tw`text-center text-xs uppercase tracking-widest text-neutral-400`}>
            No {activeFilter.toLowerCase()} artworks found.
          </Text>
        </View>
      ) : (
        <View style={tw`flex-row gap-3`}>
          {/* Artwork Grid */}
          {columnsData.map((column, i) => (
            <View key={`column-${i}`} style={tw`flex-1`}>
              {column.map((art) => (
                <View key={art.art_id} style={tw`mb-5`}>
                  <ArtworkCard
                    artwork={art}
                    width={cardWidth}
                    hideBackground
                    useFixedImageFrame={false}
                    useImageLoadAspectRatio
                  />
                </View>
              ))}
            </View>
          ))}
        </View>
      )}

      <ArtworksImmersiveModal
        visible={isImmersiveOpen}
        onClose={() => setIsImmersiveOpen(false)}
        items={filteredArtworks}
        getHeaderText={(_, total) => `${event.title} - ${total} Works`}
        onItemPress={(item) => {
          setIsImmersiveOpen(false);
          navigation.navigate(screenName.artwork, {
            art_id: item.art_id,
            url: item.url,
          });
        }}
        renderMetaFooter={() => (
          <Text style={tw`text-xs uppercase tracking-widest text-neutral-600 mt-1 font-sans-regular`}>
            {event.gallery?.name || "Gallery"}
            {event.event_type === "art_fair" && event.location?.country ? ` - ${event.location.country}` : ""}
          </Text>
        )}
      />
    </View>
  );
}
