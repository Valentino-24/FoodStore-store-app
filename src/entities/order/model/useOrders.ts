import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from '@tanstack/react-query';
import { storeApi } from '../../../shared/api/storeApi';
import { useStore } from '../../user/model/userStore';
import { Order } from '../../../shared/types';

export const useOrders = (): UseQueryResult<Order[], Error> => {
  const user = useStore((state) => state.user);

  return useQuery({
    queryKey: ['orders', user?.id],
    queryFn: async () => {
      const response = await storeApi.getOrders();
      return response.data;
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
  });
};

export const useOrderById = (
  id: string | undefined
): UseQueryResult<Order, Error> => {
  const user = useStore((state) => state.user);

  return useQuery({
    queryKey: ['orders', id, user?.id],
    queryFn: async () => {
      if (!id) throw new Error('Order ID is required');
      const response = await storeApi.getOrderById(id);
      return response.data;
    },
    enabled: !!id && !!user,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateOrder = (): UseMutationResult<
  Order,
  Error,
  {
    forma_pago_id: number;
    direccion_entrega_id?: number;
    detalles: { producto_id: number; cantidad: number }[];
  }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderData) =>
      storeApi.createOrder(orderData).then(res => res.data),
    onSuccess: () => {

      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error: Error) => {
      console.error('Error creating order:', error.message);
    },
  });
};