import { Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "#config/colors.config";
import SummaryContainer from "./SummaryContainer";
import { getImageFileView } from "#lib/storage/getImageFileView";
import { utils_formatPrice } from "#utils/utils_priceFormatter";

export default function OrderSummary({
  data: { title, url, artist, art_id, author_id, pricing },
}: {
  data: artworkOrderDataTypes;
}) {
  const [image_href, setImageHref] = useState<string>("");
  useEffect(() => {
    if (url) {
      let image_href = getImageFileView(url, 300);
      setImageHref(image_href);
    }
  }, [url]);

  return (
    <View style={styles.container}>
      <View style={styles.ordersContainer}>
        <View style={styles.listItem}>
          <Image
            source={{ uri: image_href }}
            style={{
              height: 100,
              width: 100,
              backgroundColor: "#f5f5f5",
              borderRadius: 3,
            }}
          />
          <View style={styles.listItemDetails}>
            <Text
              style={[styles.orderItemTitle, { fontSize: 16, marginBottom: 5 }]}
            >
              {title}
            </Text>
            <Text style={styles.orderItemTitle}>{artist}</Text>
            {pricing?.shouldShowPrice === "Yes" ? (
              <Text style={{ fontSize: 18, fontWeight: "500", marginTop: 15 }}>
                {utils_formatPrice(pricing.usd_price)}
              </Text>
            ) : (
              <Text>Request Price</Text>
            )}
          </View>
        </View>
      </View>
      <SummaryContainer
        buttonTypes="Proceed to shipping"
        price={pricing?.shouldShowPrice === "Yes" ? pricing.usd_price : 0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 0,
  },
  titleHeader: {
    fontSize: 20,
    fontWeight: 500,
    color: colors.primary_black,
  },
  ordersContainer: {
    borderWidth: 1,
    borderColor: colors.inputBorder,
    marginTop: 0,
    paddingHorizontal: 20,
  },
  listItem: {
    paddingVertical: 25,
    flexDirection: "row",
    gap: 15,
  },
  statusPill: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    color: "#004617",
    fontSize: 12,
    borderRadius: 20,
    flexWrap: "wrap",
  },
  listItemDetails: {
    flex: 1,
  },
  orderItemTitle: {
    fontSize: 14,
    color: colors.primary_black,
  },
  orderItemDetails: {
    color: "#616161",
    fontSize: 12,
    marginTop: 5,
  },
});
