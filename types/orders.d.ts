export type CollectorOrderPaymentFlags = {
  isFlutterwavePaymentEnabled: boolean;
  isStripePaymentEnabled: boolean;
  areFlagsLoading: boolean;
};

/** Collector orders list row — `screens/orders/components/OrderContainer` */
export type CollectorOrderContainerProps = {
  item: CreateOrderModelTypes;
  id: number;
  open: boolean;
  /** Stable handler: `(orderId) => void` */
  onToggleOpen: (orderId: string) => void;
  lastId: boolean;
  paymentFlags: CollectorOrderPaymentFlags;
};

export type CollectorOrderListItemProps = {
  item: CreateOrderModelTypes;
  index: number;
  isOpen: boolean;
  isLast: boolean;
  onToggleOpen: (orderId: string) => void;
  paymentFlags: CollectorOrderPaymentFlags;
};

export type OrderStatusKey = "pending" | "processing" | "completed";

export type OrderActionType = "track" | "action" | null;

export type OrderContainerProps = {
  id: number;
  open: boolean;
  setOpen: (next?: boolean) => void;
  artId: string;
  artName: string;
  price: string;
  dateTime: string;
  status: OrderStatusKey;
  lastId: boolean;
  trackBtn: () => void;
  url: string;
  payment_status?: string;
  tracking_status?: string | null;
  order_accepted?: string;
  delivered?: boolean;
  order_decline_reason?: string;
  exclusivity_type?: "exclusive" | "non-exclusive" | string;
  acceptBtn?: () => void;
  declineBtn?: () => void;
  seller_designation?: string;
};

export type OrderActionsProps = {
  status?: string;
  payment_status?: string;
  tracking_status?: string | null;
  order_accepted?: string;
  exclusivity_type?: string;
  trackBtn?: () => void;
  acceptBtn?: () => void;
  declineBtn?: () => void;
};

export type StatusBadgeProps = {
  status?: string;
  payment_status?: string;
  tracking_status?: string | null;
  order_accepted?: string;
  delivered?: boolean;
};
