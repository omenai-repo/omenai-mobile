import React, { useCallback, useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import Sortable, {
  type SortableGridDragEndParams,
  type SortableGridRenderItem,
} from "react-native-sortables";
import { getImageFileView } from "#lib/storage/getImageFileView";
import { screenName } from "#constants/screenNames.constants";
import { EventArtwork } from "#services/events/events.service";
import { useModalStore } from "#store/modal/modalStore";
import { colors } from "#config/colors.config";

interface EventInventoryGridProps {
  eventId: string;
  artworks: EventArtwork[];
  onAddInventoryClick: () => void;
  onRemoveArtwork: (artworkId: string) => Promise<void>;
  onReorderArtworks: (newSequenceIds: string[]) => Promise<void>;
}

const resolveArtworkImage = (image?: string, width = 900) => {
  if (!image) return "";
  if (/^https?:\/\//i.test(image)) return image;
  return getImageFileView(image, width);
};

const getAvailabilityLabel = (artwork: EventArtwork) => {
  const rawPrice = artwork.pricing?.usd_price ?? artwork.pricing?.price;

  if (typeof rawPrice === "number" && Number.isFinite(rawPrice)) {
    return `$${rawPrice.toLocaleString()}`;
  }
};

export default function EventInventoryGrid({
  artworks,
  onAddInventoryClick,
  onRemoveArtwork,
  onReorderArtworks,
}: EventInventoryGridProps) {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { updateModal, updateConfirmationModal, clear } = useModalStore();
  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  const [items, setItems] = useState<EventArtwork[]>(artworks);

  useEffect(() => {
    setItems(artworks);
  }, [artworks]);

  const handleConfirmRemove = useCallback(
    (artworkId: string) => {
      updateConfirmationModal({
        child: (
          <View style={tw`p-5`}>
            <Text style={tw`text-base text-neutral-900 mb-2`}>Remove Artwork</Text>
            <Text style={tw`text-sm text-neutral-600 mb-5`}>
              Are you sure you want to remove this artwork from the presentation?
              It will be released back into your available vault.
            </Text>
            <View style={tw`flex-row gap-3`}>
              <TouchableOpacity
                style={tw`flex-1 py-3 border border-neutral-300 rounded-sm items-center`}
                activeOpacity={0.85}
                onPress={() => clear()}
              >
                <Text style={tw`text-sm text-neutral-700`}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`flex-1 py-3 bg-red-600 rounded-sm items-center`}
                activeOpacity={0.85}
                onPress={async () => {
                  clear();
                  setIsRemoving(artworkId);
                  try {
                    await onRemoveArtwork(artworkId);
                  } catch {
                    updateModal({
                      showModal: true,
                      modalType: "error",
                      message: "Failed to remove artwork from event.",
                    });
                  } finally {
                    setIsRemoving(null);
                  }
                }}
              >
                <Text style={tw`text-sm text-white`}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        ),
      });
    },
    [updateConfirmationModal, clear, onRemoveArtwork, updateModal],
  );

  const handleArtworkTap = useCallback(
    (item: EventArtwork) => {
      navigation.push(screenName.artwork, {
        art_id: item.art_id,
        url: item.url,
      });
    },
    [navigation],
  );

  const onDragEnd = useCallback(
    (params: SortableGridDragEndParams<EventArtwork>) => {
      const { data } = params;
      if (data === items) {
        return;
      }
      const previousSnapshot = items;
      setItems(data);
      void (async () => {
        const newIds = data.map((a) => a.art_id);
        try {
          await onReorderArtworks(newIds);
        } catch {
          setItems(previousSnapshot);
          updateModal({
            showModal: true,
            modalType: "error",
            message: "Failed to save the new order.",
          });
        }
      })();
    },
    [items, onReorderArtworks, updateModal],
  );

  const renderItem: SortableGridRenderItem<EventArtwork> = useCallback(
    ({ item }) => {
      const imageUrl = resolveArtworkImage(item.url, 700);
      const removing = isRemoving === item.art_id;
      return (
        <View style={tw`flex-1`}>
          <View style={tw`relative`}>
            <View
              style={tw`absolute top-2 right-2 z-20 rounded-sm border border-neutral-200 bg-white/90`}
            >
              <Sortable.Handle>
                <View style={tw`p-1.5`} accessibilityLabel="Drag to reorder">
                  <Ionicons name="reorder-two" size={18} color="#262626" />
                </View>
              </Sortable.Handle>
            </View>
            <Sortable.Touchable onTap={() => handleArtworkTap(item)}>
              <View>
                <View style={tw`relative`}>
                  <Image
                    source={{ uri: imageUrl }}
                    style={tw`h-44 rounded-md bg-neutral-200`}
                    resizeMode="cover"
                  />
                  {!item.availability && (
                    <View
                      style={tw`absolute top-2 left-2 px-2 py-1 rounded-sm z-10 bg-[${colors.black}]`}
                    >
                      <Text
                        style={tw`text-[9px] uppercase tracking-widest text-white font-sans-medium`}
                      >
                        Sold
                      </Text>
                    </View>
                  )}
                </View>
                <Text numberOfLines={1} style={tw`text-sm text-neutral-900 mt-2`}>
                  {item.title}
                </Text>
                <Text numberOfLines={1} style={tw`text-xs text-neutral-500`}>
                  {item.artist}
                </Text>
                <Text
                  style={tw`text-[10px] uppercase tracking-widest mt-1 text-neutral-500`}
                >
                  {getAvailabilityLabel(item)}
                </Text>
              </View>
            </Sortable.Touchable>
          </View>
          <TouchableOpacity
            style={tw`mt-2 self-start px-3 py-1.5 border border-red-200 rounded-sm`}
            onPress={() => handleConfirmRemove(item.art_id)}
            disabled={removing}
            activeOpacity={0.85}
          >
            <Text style={tw`text-[10px] uppercase tracking-widest text-red-600`}>
              {removing ? "Removing..." : "Remove"}
            </Text>
          </TouchableOpacity>
        </View>
      );
    },
    [handleArtworkTap, handleConfirmRemove, isRemoving],
  );

  return (
    <View style={tw`mt-5`}>
      <View style={tw`mb-3`}>
        <View style={tw`flex-row items-center justify-between`}>
          <View>
            <Text style={tw`text-[10px] uppercase tracking-widest text-neutral-500`}>
              Active Inventory
            </Text>
            <Text style={tw`text-sm text-neutral-800 mt-1`}>
              {artworks.length} works
            </Text>
          </View>
          <TouchableOpacity
            style={tw`px-3 py-2 border border-neutral-300 rounded-sm bg-[${colors.black}]`}
            onPress={onAddInventoryClick}
            activeOpacity={0.8}
          >
            <Text style={tw`text-[10px] uppercase tracking-widest text-white`}>
              Add Works
            </Text>
          </TouchableOpacity>
        </View>
        <View style={tw`mt-2 bg-neutral-50 border border-neutral-200 rounded-sm p-2.5`}>
          <Text style={tw`text-sm tracking-wider text-neutral-800 font-sans-normal`}>
            <Text style={tw`font-sans-semibold`}>Curatorial Sequence:</Text> use the
            grip on each tile to drag works into place. This order is shown on the public
            presentation.
          </Text>
        </View>
      </View>

      {items.length === 0 ? (
        <View style={tw`py-12 items-center`}>
          <Text style={tw`text-xs uppercase tracking-widest text-neutral-500`}>
            No artworks currently assigned to this event.
          </Text>
        </View>
      ) : (
        <Sortable.Grid
          customHandle
          data={items}
          keyExtractor={(item) => item.art_id}
          columns={2}
          rowGap={16}
          columnGap={12}
          dragActivationDelay={0}
          dragActivationFailOffset={24}
          onDragEnd={onDragEnd}
          renderItem={renderItem}
          // Parent ScrollView (RNGH) handles scroll; no nested list scroll
          overDrag="vertical"
        />
      )}
    </View>
  );
}
