import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { getEditorialImageFilePreview } from "lib/editorial/lib/getEditorialImageFilePreview";
import { colors } from "config/colors.config";
import { fontNames } from "constants/fontNames.constants";
import { Feather } from "@expo/vector-icons";
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
  const imageUrl = getEditorialImageFilePreview(cover, 500);
  const formattedDate = date
    ? dayjs(date).format("MMM YYYY").toUpperCase()
    : "";

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <View
        style={[
          { width },
          showDetails && styles.cardContainer, // Apply container styles if showDetails is true
        ]}
      >
        <Image
          source={{ uri: imageUrl }}
          style={[styles.image, showDetails && styles.imageWithDetails]}
        />
        <View style={showDetails && styles.contentContainer}>
          <Text
            numberOfLines={2}
            style={[styles.headline, showDetails && styles.headlineLarge]}
          >
            {headline}
          </Text>

          {showDetails && (
            <View style={styles.footer}>
              <View style={styles.readArticleRow}>
                <Text style={styles.readArticleText}>Read</Text>
                <Feather
                  name="arrow-right"
                  size={16}
                  color={colors.primary_black}
                />
              </View>
              <Text style={styles.dateText}>{formattedDate}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    paddingBottom: 20,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    // Elevation for Android
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 5,
    backgroundColor: colors.grey,
  },
  imageWithDetails: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    height: 160, // Reduced height for 2-column layout
  },
  contentContainer: {
    paddingHorizontal: 10, // Reduced padding
  },
  headline: {
    fontSize: 14,
    color: colors.primary_black,
    marginTop: 15,
    fontWeight: "500",
    fontFamily: fontNames.dmSans + "Medium",
  },
  headlineLarge: {
    fontSize: 14, // Keep font size manageable for grid
    marginTop: 10,
    marginBottom: 15,
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "auto",
  },
  readArticleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  readArticleText: {
    fontSize: 12,
    color: colors.primary_black,
    fontWeight: "500",
    fontFamily: fontNames.dmSans + "Medium",
  },
  dateText: {
    fontSize: 10, // Smaller date text
    color: "#999",
    fontWeight: "500",
    fontFamily: fontNames.dmSans + "Medium",
    letterSpacing: 0.5,
  },
});
