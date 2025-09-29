import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getOrdersForUser } from 'services/orders/getOrdersForUser';
import { useAppStore } from 'store/app/appStore';

type Partitioned = {
  pendingOrders: CreateOrderModelTypes[];
  completedOrders: CreateOrderModelTypes[];
};

function partition(list: CreateOrderModelTypes[]): Partitioned {
  const pending: CreateOrderModelTypes[] = [];
  const completed: CreateOrderModelTypes[] = [];

  for (const order of list) {
    const accepted = order.order_accepted.status;
    const delivered = order.shipping_details.delivery_confirmed;

    if (accepted === '') {
      pending.push(order);
    } else if (accepted === 'accepted' && !delivered) {
      pending.push(order);
    } else if (
      (accepted === 'accepted' && delivered && order.status === 'completed') ||
      accepted === 'declined'
    ) {
      completed.push(order);
    }
  }
  return { pendingOrders: pending, completedOrders: completed };
}

export function useCollectorOrders() {
  const queryClient = useQueryClient();
  const userId = useAppStore((state) => state.userSession.id);

  const query = useQuery({
    queryKey: ['orders', userId],
    queryFn: async () => {
      const res = await getOrdersForUser();
      if (!res?.isOk) throw new Error('Failed to fetch orders');
      return res.data as CreateOrderModelTypes[];
    },
    select: partition,
  });

  const invalidate = useCallback(
    () => queryClient.invalidateQueries({ queryKey: ['orders', userId] }),
    [queryClient],
  );

  return { ...query, invalidate };
}
