export type OrderStatusKey = 'pending' | 'processing' | 'completed';

export type OrderActionType = 'track' | 'action' | null;

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
  exclusivity_type?: 'exclusive' | 'non-exclusive' | string;
  acceptBtn?: () => void;
  declineBtn?: () => void;
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
