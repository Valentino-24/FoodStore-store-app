// src/modules/store/hooks/useIngredients.ts
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { storeApi } from '../api/storeApi';
import { Ingredient } from '../types';

export const useIngredients = (): UseQueryResult<Ingredient[], Error> => {
  return useQuery({
    queryKey: ['ingredients'],
    queryFn: async () => {
      const response = await storeApi.getIngredients();
      return response.data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useIngredientById = (id: number | undefined): UseQueryResult<Ingredient, Error> => {
  return useQuery({
    queryKey: ['ingredients', id],
    queryFn: async () => {
      if (!id) throw new Error('ID is required');
      const response = await storeApi.getIngredientById(id);
      return response.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 30,
  });
};
