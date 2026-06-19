import React, { useState, useCallback } from "react";
import {
  View,
  Image,
  Text,
  useWindowDimensions,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import tw from "twrnc";
import { museumColors } from "#config/colors.config";

// Artwork slot is capped at this fraction of the shorter screen axis so the
// matte and frame always have breathing room regardless of device size.
const MAX_ARTWORK_RATIO = 0.55;

const MATTE_PADDING = 20; // off-white inner border, dp
const FRAME_THICKNESS = 10; // dark outer frame, dp
const LABEL_GAP = 14; // space between frame and label card, dp

// Platform shadows differ (iOS shadow* vs Android elevation) — kept outside tw
const frameShadow = {
  shadowColor: "#000",
  shadowOffset: { width: 4, height: 8 },
  shadowOpacity: 0.5,
  shadowRadius: 18,
  elevation: 14,
};

interface MuseumViewerProps {
  visible: boolean;
  onClose: () => void;
  imageUri: string;
  title: string;
  artist: string;
  year?: string;
  medium?: string;
  dimensions?: string;
  /** Natural pixel dimensions of the image — used to derive the display aspect ratio */
  naturalWidth: number;
  naturalHeight: number;
}

export default function MuseumViewer({
  visible,
  onClose,
  imageUri,
  title,
  artist,
  year,
  medium,
  dimensions,
  naturalWidth,
  naturalHeight,
}: MuseumViewerProps) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Derive a slot size that respects the artwork's aspect ratio and never
  // exceeds MAX_ARTWORK_RATIO of either screen axis.
  const artworkAspect =
    naturalWidth > 0 && naturalHeight > 0 ? naturalWidth / naturalHeight : 1;

  const maxSlotWidth = screenWidth * MAX_ARTWORK_RATIO;
  const maxSlotHeight = screenHeight * MAX_ARTWORK_RATIO;

  let slotWidth: number;
  let slotHeight: number;

  if (artworkAspect >= 1) {
    slotWidth = maxSlotWidth;
    slotHeight = slotWidth / artworkAspect;
    if (slotHeight > maxSlotHeight) {
      slotHeight = maxSlotHeight;
      slotWidth = slotHeight * artworkAspect;
    }
  } else {
    slotHeight = maxSlotHeight;
    slotWidth = slotHeight * artworkAspect;
    if (slotWidth > maxSlotWidth) {
      slotWidth = maxSlotWidth;
      slotHeight = slotWidth / artworkAspect;
    }
  }

  const matteWidth = slotWidth + MATTE_PADDING * 2;
  const matteHeight = slotHeight + MATTE_PADDING * 2;
  const frameWidth = matteWidth + FRAME_THICKNESS * 2;
  const frameHeight = matteHeight + FRAME_THICKNESS * 2;

  const handleLoadEnd = useCallback(() => setImageLoading(false), []);
  const handleError = useCallback(() => {
    setImageLoading(false);
    setImageError(true);
  }, []);

  const metaLine = [medium, dimensions].filter(Boolean).join(" · ");

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={false}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <StatusBar barStyle="light-content" />

      <View style={[tw`flex-1`, { backgroundColor: museumColors.wall }]}>
        <View style={tw`absolute inset-0 z-10`} pointerEvents="none" />

        <ScrollView
          contentContainerStyle={[
            tw`grow items-center justify-center px-6 z-20`,
            {
              paddingTop: (insets.top || 20) + 50,
              paddingBottom: (insets.bottom || 20) + 20,
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Frame → matte → artwork slot, layered for a physical framing effect */}
          <View
            style={[
              tw`items-center justify-center border`,
              frameShadow,
              {
                width: frameWidth,
                height: frameHeight,
                backgroundColor: museumColors.frameBackground,
                // Asymmetric border colours simulate a bevelled wooden frame
                borderTopColor: museumColors.frameBevelLight,
                borderLeftColor: museumColors.frameBevelLight,
                borderBottomColor: museumColors.frameBevelDark,
                borderRightColor: museumColors.frameBevelDark,
              },
            ]}
          >
            <View
              style={[
                tw`items-center justify-center`,
                {
                  width: matteWidth,
                  height: matteHeight,
                  backgroundColor: museumColors.matte,
                },
              ]}
            >
              {/* Runtime-calculated dimensions stay inline */}
              <View
                style={{
                  width: slotWidth,
                  height: slotHeight,
                  overflow: "hidden",
                }}
              >
                {imageLoading && (
                  <View
                    style={[
                      StyleSheet.absoluteFill,
                      tw`items-center justify-center`,
                      { backgroundColor: museumColors.slotBackground },
                    ]}
                  >
                    <ActivityIndicator
                      color={museumColors.accent}
                      size="small"
                    />
                  </View>
                )}

                {imageError ? (
                  <View
                    style={[
                      StyleSheet.absoluteFill,
                      tw`items-center justify-center`,
                      { backgroundColor: museumColors.slotBackground },
                    ]}
                  >
                    <Text style={[tw`text-xs`, { color: museumColors.accent }]}>
                      Unable to load artwork
                    </Text>
                  </View>
                ) : (
                  <Image
                    source={{ uri: imageUri }}
                    style={{ width: slotWidth, height: slotHeight }}
                    resizeMode="cover"
                    onLoadEnd={handleLoadEnd}
                    onError={handleError}
                  />
                )}
              </View>
            </View>
          </View>

          {/* Label card matches the frame width, mimicking a museum wall placard */}
          <View
            style={[
              tw`py-2.5 px-3.5`,
              {
                width: frameWidth,
                marginTop: LABEL_GAP,
                backgroundColor: museumColors.labelCardBackground,
                borderWidth: 0.5,
                borderColor: museumColors.labelCardBorder,
              },
            ]}
          >
            <Text
              style={[
                tw`text-base font-serif-bold mb-0.5 capitalize`,
                { color: museumColors.labelTitle },
              ]}
              numberOfLines={2}
            >
              {title}
            </Text>
            <Text
              style={[
                tw`text-sm mb-px font-serif capitalize`,
                { color: museumColors.labelArtist },
              ]}
            >
              {artist}
              {year ? `, ${year}` : ""}
            </Text>
            {!!metaLine && (
              <Text
                style={[
                  tw`text-sm font-sans-regular tracking-wide mt-0.5`,
                  { color: museumColors.labelMeta },
                ]}
              >
                {metaLine}
              </Text>
            )}
          </View>
        </ScrollView>

        {/* Platform-specific top offset stays inline per style exception rule */}
        <TouchableOpacity
          style={[
            tw`absolute right-[18px] w-9 h-9 rounded-full items-center justify-center z-10`,
            {
              top: Platform.OS === "android" ? 40 : insets.top + 10,
              backgroundColor: "rgba(0,0,0,0.42)",
            },
          ]}
          onPress={onClose}
          activeOpacity={0.75}
        >
          <Feather name="x" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
