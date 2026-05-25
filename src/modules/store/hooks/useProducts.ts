// src/modules/store/hooks/useProducts.ts
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { storeApi } from '../api/storeApi';
import { Product } from '../types';

interface ProductFilters {
  categoria_id?: number;
  busqueda?: string;
}

export const useProducts = (
  filters: ProductFilters = {}
): UseQueryResult<Product[], Error> => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      const response = await storeApi.getProducts(filters);
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: 'stale',
  });
};

export const useProductById = (
  id: string | undefined
): UseQueryResult<Product, Error> => {
  return useQuery({
    queryKey: ['products', id],
    queryFn: async () => {
      if (!id) throw new Error('Product ID is required');
      const response = await storeApi.getProductById(id);
      return response.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
};