import { useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ORDERS_QK } from 'utils/queryKeys';
import { organizeOrders } from 'utils/utils_splitArray';
import { getOrdersBySellerId } from 'services/orders/getOrdersBySellerId';
import * as Sentry from '@sentry/react-native';

export const useOrdersQuery = (updateModal: any) =>
  useQuery({
    queryKey: ORDERS_QK,
    queryFn: async () => {
      Sentry.addBreadcrumb({ category: 'network', message: 'FETCH: orders', level: 'info' });
      try {
        const res = await getOrdersBySellerId();
        if (!res?.isOk) throw new Error(res?.body?.message ?? 'Failed to load orders');
        return res.data;
      } catch (err: any) {
        updateModal({ message: err?.message, showModal: true, modalType: 'error' });
        Sentry.captureException(err);
        throw err;
      }
    },
    staleTime: 30_000,
    gcTime: 10 * 60_000,
  });

export const useFilteredOrders = (tab: string, year: number, orders: any[] = []) => {
  const { pending, processing, completed } = useMemo(
    () => organizeOrders(Array.isArray(orders) ? orders : []),
    [orders],
  );

  const filterYear = useCallback(
    (arr: any[]) => arr.filter((o) => new Date(o.createdAt).getFullYear() === year),
    [year],
  );

  const currentOrders = useMemo(() => {
    if (tab === 'pending') return filterYear(pending);
    if (tab === 'processing') return filterYear(processing);
    return filterYear(completed);
  }, [pending, processing, completed, tab, filterYear]);

  return { pending, processing, completed, currentOrders };
};
