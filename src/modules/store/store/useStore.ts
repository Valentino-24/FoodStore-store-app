import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, User, DeliveryAddress } from '../types';

interface StoreState {

  user: User | null;

  items: CartItem[];
  total: number;

  addresses: DeliveryAddress[];
  selectedAddressId: number | null;

  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;

  setUser: (user: User) => void;
  login: (user: User) => void;
  logout: () => void;

  setAddresses: (addresses: DeliveryAddress[]) => void;
  addAddress: (address: DeliveryAddress) => void;
  removeAddress: (id: number) => void;
  setSelectedAddress: (id: number | null) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({

      user: null,

      items: [],
      total: 0,

      addresses: [],
      selectedAddressId: null,

      addToCart: (item: CartItem) => {
        const state = get();
        const existingItem = state.items.find((i) => i.id === item.id);

        const items = existingItem
          ? state.items.map((cartItem) =>
              cartItem.id === item.id
                ? { ...cartItem, quantity: cartItem.quantity + (item.quantity || 1) }
                : cartItem
            )
          : [...state.items, { ...item, quantity: item.quantity || 1 }];

        const total = items.reduce((sum, current) => sum + current.price * current.quantity, 0);

        set({ items, total });
      },

      removeFromCart: (id: string) => {
        const state = get();
        const items = state.items.filter((item) => item.id !== id);
        const total = items.reduce((sum, current) => sum + current.price * current.quantity, 0);
        set({ items, total });
      },

      updateCartQuantity: (id: string, quantity: number) => {
        const state = get();
        const items = state.items.map((item) =>
          item.id === id ? { ...item, quantity: Math.max(quantity, 1) } : item
        );
        const total = items.reduce((sum, current) => sum + current.price * current.quantity, 0);
        set({ items, total });
      },

      clearCart: () => set({ items: [], total: 0 }),

      setUser: (user: User) => set({ user }),

      login: (user: User) => {
        set({ user });
      },

      logout: () => {
        set({
          user: null,
          items: [],
          total: 0,
          addresses: [],
          selectedAddressId: null,
        });
      },

      setAddresses: (addresses: DeliveryAddress[]) => {

        const selectedAddressId = get().selectedAddressId || (addresses.length > 0 ? addresses[0].id : null);
        set({ addresses, selectedAddressId });
      },

      addAddress: (address: DeliveryAddress) => {
        const state = get();
        const addresses = [...state.addresses, address];
        set({ addresses });
      },

      removeAddress: (id: number) => {
        const state = get();
        const addresses = state.addresses.filter((a) => a.id !== id);
        const selectedAddressId = state.selectedAddressId === id ? null : state.selectedAddressId;
        set({ addresses, selectedAddressId });
      },

      setSelectedAddress: (id: number | null) => {
        set({ selectedAddressId: id });
      },
    }),
    {
      name: 'foodstore-app-store',
      partialize: (state) => ({
        user: state.user,
        items: state.items,
        total: state.total,
        addresses: state.addresses,
        selectedAddressId: state.selectedAddressId,
      }),
    }
  )
);