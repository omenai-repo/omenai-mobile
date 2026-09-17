import React from "react";
import OrderContainer from "./OrderContainer";
import type { CollectorOrderListItemProps } from "#types/orders";

const CollectorOrderListItem = React.memo(
  function CollectorOrderListItem({
    item,
    index,
    isOpen,
    isLast,
    onToggleOpen,
    paymentFlags,
  }: CollectorOrderListItemProps) {
    return (
      <OrderContainer
        item={item}
        id={index}
        open={isOpen}
        onToggleOpen={onToggleOpen}
        lastId={isLast}
        paymentFlags={paymentFlags}
      />
    );
  },
  (prev, next) =>
    prev.item === next.item &&
    prev.index === next.index &&
    prev.isOpen === next.isOpen &&
    prev.isLast === next.isLast &&
    prev.onToggleOpen === next.onToggleOpen &&
    prev.paymentFlags === next.paymentFlags,
);

export default CollectorOrderListItem;
