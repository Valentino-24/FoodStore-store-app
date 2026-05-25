// src/modules/store/services/orderService.ts

import { Order, CreateOrderDTO } from '../types';

export const formatOrderDate = (date: string): string => {
  return new Date(date).toLocaleDateString('es-ES');
};

export const isOrderDelivered = (order: Order): boolean => {
  return order.status === 'delivered';
};

export const calculateOrderTotal = (order: Order): number => {
  return order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
};
