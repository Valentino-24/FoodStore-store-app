// src/modules/store/services/cartService.ts

import { CartItem } from '../types';

export const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

export const validateCartItem = (item: CartItem): boolean => {
  return item.id && item.price > 0 && item.quantity > 0;
};

export const groupByCategory = (items: CartItem[]) => {
  return items.reduce((acc, item) => {
    const category = item.category || 'Sin categoría';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {} as Record<string, CartItem[]>);
};