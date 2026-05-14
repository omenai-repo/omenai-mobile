import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  KeyboardEvent,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import tw from "twrnc";
import LongBlackButton from "#components/buttons/LongBlackButton";
import { colors } from "#config/colors.config";
import { getImageFileView } from "#lib/storage/getImageFileView";
import {
  fetchGalleryInventory,
} from "#services/events/events.service";
import { useModalStore } from "#store/modal/modalStore";

type ArtworkSelectionPayload = {
  featured_artworks: string[];
  participating_artists: string[];
};

type ArtworkSelectorModalProps = {
  isOpen: boolean;
  onClose: () => void;
  galleryId: string;
  validatedPayload: any;
  onFinalSubmit: (payload: ArtworkSelectionPayload) => Promise<void> | void;
  alreadyFeaturedIds: string[];
};

const resolveArtworkImage = (image?: string, width = 900) => {
  if (!image) return "";
  if (/^https?:\/\//i.test(image)) return image;
  return getImageFileView(image, width);
};

const INVENTORY_PAGE_SIZE = 20;

export default function ArtworkSelectorModal({
  isOpen,
  onClose,
  galleryId,
  onFinalSubmit,
  alreadyFeaturedIds,
}: ArtworkSelectorModalProps) {
  const insets = useSafeAreaInsets();
  const { updateModal } = useModalStore();
  const [inventoryResults, setInventoryResults] = useState<ArtworkSchemaTypes[]>(
    [],
  );
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedArtworkIds, setSelectedArtworkIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const wasOpenRef = useRef(false);

  const featuredIdsSet = useMemo(
    () => new Set(alreadyFeaturedIds || []),
    [alreadyFeaturedIds],
  );

  // 1) Debounce search to match web (ArtworkSelectorModal: 500ms)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 2) loadInventory(page, search, isAppend) — same pattern as web
  const loadInventory = useCallback(
    async (pageNum: number, search: string, isAppend: boolean) => {
      if (!galleryId) {
        updateModal({
          showModal: true,
          modalType: "error",
          message: "Unable to identify your gallery account.",
        });
        return;
      }

      if (isAppend) {
        setLoadingMore(true);
      } else {
        setInventoryLoading(true);
      }

      try {
        const response = await fetchGalleryInventory(
          galleryId,
          pageNum,
          INVENTORY_PAGE_SIZE,
          search,
        );
        if (!response.isOk) {
          updateModal({
            showModal: true,
            modalType: "error",
            message: response.message || "Unable to load available works.",
          });
          return;
        }
        const inventoryRows = (response.data ?? []) as ArtworkSchemaTypes[];
        const available = inventoryRows.filter((item) => !featuredIdsSet.has(item.art_id));
        if (isAppend) {
          setInventoryResults((prev) => [...prev, ...available]);
        } else {
          setInventoryResults(available);
        }
        setHasMore(response.pagination?.hasMore ?? false);
        setPage(pageNum);
      } catch (error: any) {
        updateModal({
          showModal: true,
          modalType: "error",
          message: error?.message || error?.body?.message || "Unable to load available works.",
        });
      } finally {
        if (isAppend) {
          setLoadingMore(false);
        } else {
          setInventoryLoading(false);
        }
      }
    },
    [galleryId, featuredIdsSet, updateModal],
  );

  // 3) On open or debounced search change: page 1 + fetch (matches web
  //    ArtworkSelectorModal useEffect on isOpen, debouncedSearch, loadInventory)
  useEffect(() => {
    if (isOpen) {
      setPage(1);
      if (!wasOpenRef.current) {
        setSelectedArtworkIds([]);
      }
      wasOpenRef.current = true;
      loadInventory(1, debouncedSearch, false);
    } else {
      wasOpenRef.current = false;
    }
  }, [isOpen, debouncedSearch, loadInventory]);

  // Fill the gap above the keyboard with the sheet background (KeyboardAvoidingView
  // leaves transparent padding where the dimmed screen showed through).
  useEffect(() => {
    if (!isOpen) {
      setKeyboardHeight(0);
      return;
    }
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const onShow = (e: KeyboardEvent) =>
      setKeyboardHeight(e.endCoordinates.height);
    const onHide = () => setKeyboardHeight(0);
    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [isOpen]);

  const toggleArtworkSelection = (artId: string) => {
    setSelectedArtworkIds((prev) =>
      prev.includes(artId) ? prev.filter((id) => id !== artId) : [...prev, artId],
    );
  };

  const handleLoadMore = () => {
    if (!hasMore || loadingMore || inventoryLoading) return;
    loadInventory(page + 1, debouncedSearch, true);
  };

  const handleSubmit = async () => {
    if (!selectedArtworkIds.length) {
      updateModal({
        showModal: true,
        modalType: "error",
        message: "Select at least one artwork.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const participating_artists = Array.from(
        new Set(
          inventoryResults
            .filter((a) => selectedArtworkIds.includes(a.art_id))
            .map((a) => a.author_id)
            .filter((id): id is string => Boolean(id)),
        ),
      );
      await onFinalSubmit({
        featured_artworks: selectedArtworkIds,
        participating_artists,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const sheetPaddingBottom = insets.bottom + keyboardHeight;

  return (
    <Modal visible={isOpen} animationType="slide" transparent>
      <View style={tw`flex-1`}>
        <Pressable
          style={tw`flex-1 bg-black/40`}
          onPress={onClose}
          disabled={isSubmitting}
          accessibilityRole="button"
          accessibilityLabel="Dismiss modal"
        />
        <View
          style={[
            tw`bg-white rounded-t-2xl px-4 pt-4`,
            { maxHeight: "80%", paddingBottom: sheetPaddingBottom },
          ]}
        >
          <View style={tw`flex-row items-center justify-between mb-3`}>
            <Text style={tw`text-lg text-neutral-900`}>Add Works to Event</Text>
          </View>
          <TextInput
            placeholder="Search by artwork title or artist name..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={() => setDebouncedSearch(searchTerm.trim())}
            returnKeyType="search"
            clearButtonMode="while-editing"
            style={tw`border border-neutral-300 rounded-sm px-3 py-2 text-sm mb-3`}
          />
          {inventoryLoading ? (
            <View style={tw`py-6 items-center`}>
              <ActivityIndicator size="small" color={colors.black} />
            </View>
          ) : (
            <FlatList
              data={inventoryResults}
              keyExtractor={(item) => item.art_id}
              style={tw`max-h-80`}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              renderItem={({ item }) => {
                const selected = selectedArtworkIds.includes(item.art_id);
                const imageUri = item.url || item.image_url || "";
                return (
                  <Pressable
                    onPress={() => toggleArtworkSelection(item.art_id)}
                    style={tw`flex-row items-center gap-3 py-2 border-b border-neutral-100`}
                  >
                    <Image
                      source={{ uri: resolveArtworkImage(imageUri, 300) }}
                      style={tw`h-11 w-11 rounded-sm bg-neutral-200`}
                    />
                    <View style={tw`flex-1`}>
                      <Text numberOfLines={1} style={tw`text-xs text-neutral-900`}>
                        {item.artist}
                      </Text>
                      <Text numberOfLines={1} style={tw`text-[10px] italic text-neutral-500 mt-1`}>
                        {item.title} , {item.year}
                      </Text>
                    </View>
                    <Ionicons
                      name={selected ? "checkbox" : "square-outline"}
                      size={20}
                      color={selected ? "#111827" : "#A3A3A3"}
                    />
                  </Pressable>
                );
              }}
              ListEmptyComponent={
                <View style={tw`py-8 items-center px-2`}>
                  <Text style={tw`text-sm text-neutral-900 text-center font-medium`}>
                    No matching artworks
                  </Text>
                  <Text style={tw`text-xs text-neutral-500 text-center mt-1 max-w-sm`}>
                    Try adjusting your search, or ensure your inventory is not already
                    assigned to other active events.
                  </Text>
                </View>
              }
              ListFooterComponent={
                hasMore ? (
                  <Pressable
                    onPress={handleLoadMore}
                    disabled={loadingMore}
                    style={tw`py-4 items-center mb-1`}
                  >
                    {loadingMore ? (
                      <ActivityIndicator size="small" color={colors.black} />
                    ) : (
                      <Text
                        style={tw`text-[10px] font-medium tracking-widest uppercase text-neutral-500`}
                      >
                        Load more artworks
                      </Text>
                    )}
                  </Pressable>
                ) : null
              }
              showsVerticalScrollIndicator={false}
            />
          )}
          <LongBlackButton
            value={`Add selected works (${selectedArtworkIds.length})`}
            onClick={handleSubmit}
            isLoading={isSubmitting}
            style={tw`mt-3`}
            textStyle={tw`text-[10px]`}
          />
        </View>
      </View>
    </Modal>
  );
}
