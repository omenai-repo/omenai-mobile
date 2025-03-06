import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { getImageFileView } from "lib/storage/getImageFileView";
import { colors } from "config/colors.config";
import { orderCardStatusTypes } from "screens/galleryOrders/components/OrdersListing";
import { TouchableOpacity } from "react-native-gesture-handler";
import FittedBlackButton from "components/buttons/FittedBlackButton";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import tw from "twrnc";
import { utils_formatPrice } from "utils/utils_priceFormatter";

export type ordersColorsTypes = { bgColor: string; textColor: string };

type OrderItemProps = {
  url: string;
  artworkName: string;
  amount?: string;
  order_id: string;
  status: orderCardStatusTypes;
  color?: ordersColorsTypes;
  handlePress: (e: orderCardStatusTypes) => void;
};

export default function OrderCard({
  artworkName,
  amount,
  status,
  color,
  handlePress,
  order_id,
  url,
}: OrderItemProps) {
  const statusPills = {
    Pending: (
      <View
        style={[styles.statusPill, color && { backgroundColor: color.bgColor }]}
      >
        <MaterialIcons name="info" />
        <Text style={[styles.status, color && { color: color.textColor }]}>
          Action required
        </Text>
      </View>
    ),
    "Pending tracking info": (
      <View
        style={[styles.statusPill, color && { backgroundColor: color.bgColor }]}
      >
        <MaterialIcons name="check-circle" size={14} />
        <Text style={[styles.status, color && { color: color.textColor }]}>
          Payment completed
        </Text>
      </View>
    ),
    "Declined by gallery": (
      <View
        style={[styles.statusPill, color && { backgroundColor: color.bgColor }]}
      >
        <Feather name="x-circle" size={14} color={color?.textColor} />
        <Text style={[styles.status, color && { color: color.textColor }]}>
          {status}
        </Text>
      </View>
    ),
    "Order completed": (
      <View
        style={[styles.statusPill, color && { backgroundColor: color.bgColor }]}
      >
        <MaterialIcons name="check-circle" size={14} />
        <Text style={[styles.status, color && { color: color.textColor }]}>
          {status}
        </Text>
      </View>
    ),
  };

  const defaultPill = (
    <View
      style={[styles.statusPill, color && { backgroundColor: color.bgColor }]}
    >
      <MaterialIcons name="info" />
      <Text style={[styles.status, color && { color: color.textColor }]}>
        {status}
      </Text>
    </View>
  );

  const ViewOrder = () => {
    let text = "View order details";

    if (status === "Pending tracking info") {
      text = "Upload tracking info";
    }

    return (
      <TouchableOpacity onPress={() => handlePress(status)}>
        <View
          style={{
            backgroundColor: colors.primary_black,
            paddingHorizontal: 10,
            paddingVertical: 10,
            borderRadius: 40,
          }}
        >
          <Text style={{ fontSize: 14, color: colors.white }}>{text}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  let image_href = getImageFileView(url, 700);

  return (
    <View style={{ paddingVertical: 10 }}>
      <View style={styles.listItem}>
        <Image
          source={{ uri: image_href }}
          style={{ width: 100, backgroundColor: "#f5f5f5", borderRadius: 5 }}
          resizeMode="cover"
        />
        <View style={styles.listItemDetails}>
          <View>
            <Text style={styles.orderItemTitle}>{artworkName}</Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                marginTop: 7,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: 500, flex: 1 }}>
                {amount}
              </Text>
              <Text style={{ fontSize: 14 }}>Order ID: #{order_id}</Text>
              {/* <Text style={styles.orderItemDetails}>Ordered: {dateOrdered}</Text> */}
            </View>
          </View>
          <View style={tw`mt-[20px] gap-[15px]`}>
            <View style={tw`flex-wrap`}>
              {statusPills[status as keyof typeof statusPills] || defaultPill}
            </View>
            <View style={tw`flex-wrap`}>
              <ViewOrder />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  listItem: {
    flexDirection: "row",
    gap: 15,
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
  orderItem: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  statusPill: {
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#FEF7EC",
    height: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  status: {
    textTransform: "capitalize",
    fontSize: 12,
    color: "#F3A218",
  },
});
