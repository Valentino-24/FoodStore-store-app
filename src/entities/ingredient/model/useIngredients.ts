import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { storeApi } from '../../../shared/api/storeApi';
import { Ingredient } from '../../../shared/types';

export const useIngredients = (): UseQueryResult<Ingredient[], Error> => {
  return useQuery({
    queryKey: ['ingredients'],
    queryFn: async () => {
      const response = await storeApi.getIngredients();
      return response.data;
    },
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
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