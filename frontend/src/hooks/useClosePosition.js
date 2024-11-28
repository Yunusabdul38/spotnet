import { useMutation, useQuery } from '@tanstack/react-query';
import { axiosInstance } from 'utils/axios';
import { closePosition } from 'services/transaction';
import { useWalletStore } from 'stores/useWalletStore';

export const useClosePosition = () => {
  const { walletId } = useWalletStore();

  return useMutation({
    mutationFn: async () => {
      if (!walletId) {
        console.error('closePositionEvent: walletId is undefined');
        return;
      }
      const response = await axiosInstance.get(`/api/get-repay-data?supply_token=ETH&wallet_id=${walletId}`);
      await closePosition(response.data);
      await axiosInstance.get(`/api/close-position?position_id=${response.data.position_id}`);
    },
    onError: (error) => {
      console.error('Error during closePositionEvent', error);
    },
  });
};

export const useCheckPosition = () => {
  const { walletId } = useWalletStore();

  return useQuery({
    queryKey: ['hasOpenPosition', walletId],
    queryFn: async () => {
      if (!walletId) return { has_opened_position: false };

      console.log(walletId);
      const { data } = await axiosInstance.get('/api/has-user-opened-position', {
        params: { wallet_id: walletId },
      });
      return data;
    },
    enabled: !!walletId,
  });
};
