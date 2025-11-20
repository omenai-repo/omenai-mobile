import React from "react";
import { FlatList, RefreshControl } from "react-native";
import tw from "twrnc";
import OrderContainer from "./OrderContainer";
import { formatIntlDateTime } from "utils/utils_formatIntlDateTime";
import { utils_formatPrice } from "utils/utils_priceFormatter";

interface OrdersListProps {
  data: any[];
  openSection: Record<string, boolean>;
  toggleRecentOrder: (key: string | number) => void;
  selectedTab: "pending" | "processing" | "completed";
  isRefreshing: boolean;
  onRefresh: () => void;
  onAccept?: (item: any) => void;
  onDecline?: (item: any) => void;
  onTrack: (item: any) => void;
  renderExclusivityType?: (item: any) => string;
}

export const OrdersList: React.FC<OrdersListProps> = ({
  data,
  openSection,
  toggleRecentOrder,
  selectedTab,
  isRefreshing,
  onRefresh,
  onAccept,
  onDecline,
  onTrack,
  renderExclusivityType,
}) => {
  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) =>
        item?.order_id?.toString?.() ?? item?.artwork_data?._id ?? `order-${index}`
      }
      showsVerticalScrollIndicator={false}
      contentContainerStyle={tw`pb-[30px]`}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          tintColor="#000"
          colors={["#000"]}
        />
      }
      renderItem={({ item, index }) => (
        <OrderContainer
          id={index}
          url={item?.artwork_data?.url}
          open={!!openSection[item.order_id]}
          setOpen={() => toggleRecentOrder(item.order_id)}
          artId={item?.order_id}
          artName={item?.artwork_data?.title}
          dateTime={formatIntlDateTime(item?.createdAt)}
          price={utils_formatPrice(item?.artwork_data?.pricing?.usd_price)}
          status={selectedTab}
          lastId={index === data.length - 1}
          acceptBtn={selectedTab === "pending" && onAccept ? () => onAccept(item) : undefined}
          declineBtn={selectedTab === "pending" && onDecline ? () => onDecline(item) : undefined}
          delivered={item?.shipping_details?.delivery_confirmed}
          order_accepted={item?.order_accepted?.status}
          order_decline_reason={item?.order_accepted?.reason}
          payment_status={item?.payment_information?.status}
          tracking_status={item?.shipping_details?.shipment_information?.tracking?.id}
          trackBtn={() => onTrack(item)}
          {...(renderExclusivityType && {
            exclusivity_type: renderExclusivityType(item),
          })}
        />
      )}
    />
  );
};
