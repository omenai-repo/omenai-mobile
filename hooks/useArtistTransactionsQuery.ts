import { useQuery, useIsFetching } from '@tanstack/react-query';
import * as Sentry from '@sentry/react-native';
import { fetchArtistTransactions } from 'services/wallet/fetchArtistTransactions';
import { useModalStore } from 'store/modal/modalStore';

const TXNS_QK = ['wallet', 'artist', 'txns', { status: 'all' }] as const;

export function useArtistTransactionsQuery() {
  const { updateModal } = useModalStore();

  const {
    data: transactions,
    isLoading,
    refetch: refetchTxns,
  } = useQuery({
    queryKey: TXNS_QK,
    queryFn: async () => {
      Sentry.addBreadcrumb({
        category: 'network',
        message: 'fetchArtistTransactions',
        level: 'info',
      });

      const res = await fetchArtistTransactions({ status: 'all' });
      if (!res?.isOk) {
        Sentry.captureMessage('fetchArtistTransactions returned non-ok', 'error');
        updateModal({
          showModal: true,
          modalType: 'error',
          message: 'Error fetching transactions',
        });
        throw new Error('Transactions fetch failed');
      }
      return res.data;
    },
    staleTime: 30000,
  });

  const isFetchingTxns = useIsFetching({ queryKey: TXNS_QK }) > 0;

  return {
    transactions,
    txnsLoading: isLoading,
    refetchTxns,
    isFetchingTxns,
  };
}
