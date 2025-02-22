import { Image, StyleSheet, Text, View } from "react-native";
import React, { Children } from "react";
import CloseButton from "components/buttons/CloseButton";
import { galleryOrderModalStore } from "store/modal/galleryModalStore";
import LongWhiteButton from "components/buttons/LongWhiteButton";
import LongBlackButton from "components/buttons/LongBlackButton";
import { colors } from "config/colors.config";
import { getImageFileView } from "lib/storage/getImageFileView";

type OrderDetailsModalProps = {
  children?: React.ReactNode;
};

export default function OrderDetailsModal({
  children,
}: OrderDetailsModalProps) {
  const {
    artworkDetails,
    clear,
    setModalType,
    declineForm,
    updateDeclineForm,
  } = galleryOrderModalStore();

  if (!artworkDetails) return;

  let image_href;
  image_href = getImageFileView(artworkDetails.url, 300);

  return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={{ fontSize: 16, flex: 1 }}>Order details</Text>
        <CloseButton handlePress={clear} />
      </View>
      <View style={styles.artworkDetailsContainer}>
        <Image
          source={{ uri: image_href }}
          style={{ height: 150, objectFit: "contain", marginVertical: 10 }}
        />
        {artworkDetails.details.map((detail, index) => (
          <View key={index}>
            <Text style={{ fontSize: 14, color: "#858585" }}>
              {detail.label}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: colors.primary_black,
                marginTop: 4,
              }}
            >
              {detail.value}
            </Text>
          </View>
        ))}
      </View>
      <View style={{ gap: 20, marginTop: 30 }}>
        {artworkDetails.type === "pending" && (
          <>
            <LongWhiteButton
              onClick={() => setModalType("decline")}
              value="Decline order"
            />
            <LongBlackButton
              onClick={() => setModalType("accept")}
              value="Provide shipping quote"
            />
          </>
        )}
        {artworkDetails.type === "trackingInfo" && (
          <>
            <LongBlackButton
              onClick={() => setModalType("provideTrackingInfo")}
              value="Upload tracking information"
            />
          </>
        )}
        {(!artworkDetails.type || artworkDetails.type.length < 1) && (
          <LongBlackButton
            onClick={() => void ""}
            value="No required action"
            isDisabled
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  artworkDetailsContainer: {
    borderWidth: 1,
    borderColor: colors.grey50,
    marginTop: 20,
    padding: 10,
    borderRadius: 7,
    gap: 13,
  },
});
