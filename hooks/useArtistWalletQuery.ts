import { useQuery, useIsFetching } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import * as Sentry from '@sentry/react-native';
import { fetchArtistWalletData } from 'services/wallet/fetchArtistWalletData';
import { useModalStore } from 'store/modal/modalStore';

const WALLET_QK = ['wallet', 'artist'] as const;

export function useArtistWalletQuery() {
  const { updateModal } = useModalStore();
  const [showPinModal, setShowPinModal] = useState(false);

  const {
    data: walletData,
    isLoading,
    refetch: refetchWallet,
  } = useQuery({
    queryKey: WALLET_QK,
    queryFn: async () => {
      Sentry.addBreadcrumb({
        category: 'network',
        message: 'fetchArtistWalletData',
        level: 'info',
      });

      const res = await fetchArtistWalletData();
      if (!res?.isOk) {
        Sentry.captureMessage('fetchArtistWalletData returned non-ok', 'error');
        updateModal({ showModal: true, modalType: 'error', message: 'Error fetching wallet data' });
        throw new Error('Wallet fetch failed');
      }
      return res.data;
    },
    staleTime: 15000,
  });

  // show PIN modal when wallet loads and no PIN
  useEffect(() => {
    if (walletData && !walletData.wallet_pin) setShowPinModal(true);
  }, [walletData]);

  const isFetchingWallet = useIsFetching({ queryKey: WALLET_QK }) > 0;

  return {
    walletData,
    walletLoading: isLoading,
    refetchWallet,
    isFetchingWallet,
    showPinModal,
    setShowPinModal,
  };
}
