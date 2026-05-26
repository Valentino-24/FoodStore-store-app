import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { storeApi } from '../api/storeApi';
import { Category } from '../types';

export const useCategories = (): UseQueryResult<Category[], Error> => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await storeApi.getCategories();
      return response.data;
    },
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  });
};

export const useCategoryById = (id: number | undefined): UseQueryResult<Category, Error> => {
  return useQuery({
    queryKey: ['categories', id],
    queryFn: async () => {
      if (!id) throw new Error('ID is required');
      const response = await storeApi.getCategoryById(id);
      return response.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 30,
  });
};