import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STUDENT, PRICE_MULTIPLIER } from '../constants/student';
import { Product } from '../services/productApi';

export interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  shippingFee: number | null;
  distanceKm: number | null;
  addItem: (product: Product | CartItem) => void;
  removeItem: (id: number) => void;
  changeQty: (id: number, delta: number) => void;
  clearCart: () => void;
  setShippingFee: (fee: number | null) => void;
  setDistanceKm: (km: number | null) => void;
  getTotalQuantity: () => number;
  getTotalAmount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      shippingFee: null,
      distanceKm: null,

      addItem: (product) => {
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex((item) => item.id === product.id);

        if (existingIndex > -1) {
          const updated = [...currentItems];
          updated[existingIndex].quantity += 1;
          set({ items: updated });
        } else {
          const newItem: CartItem = {
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1,
          };
          set({ items: [...currentItems, newItem] });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      changeQty: (id, delta) => {
        const currentItems = get().items;
        const updated = currentItems
          .map((item) => {
            if (item.id === id) {
              const newQty = item.quantity + delta;
              return newQty > 0 ? { ...item, quantity: newQty } : null;
            }
            return item;
          })
          .filter((item): item is CartItem => item !== null);

        set({ items: updated });
      },

      clearCart: () => {
        set({ items: [], shippingFee: null, distanceKm: null });
      },

      setShippingFee: (fee) => {
        set({ shippingFee: fee });
      },

      setDistanceKm: (km) => {
        set({ distanceKm: km });
      },

      getTotalQuantity: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getTotalAmount: () => {
        return get().items.reduce((sum, item) => {
          const itemUnitPrice = Math.round(item.price * PRICE_MULTIPLIER);
          return sum + itemUnitPrice * item.quantity;
        }, 0);
      },
    }),
    {
      name: `ktxgo-cart-${STUDENT.mssv}`,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useCartStore;
