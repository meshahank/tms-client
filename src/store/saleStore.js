import { create } from 'zustand'

export const useSaleStore = create((set, get) => ({
  student: null,
  cartItems: [],
  setStudent: (student) => set({ student, cartItems: [] }),
  clearStudent: () => set({ student: null, cartItems: [] }),
  addItem: (item) =>
    set((state) => ({
      cartItems: [...state.cartItems, { ...item, uid: crypto.randomUUID() }],
    })),
  removeItem: (uid) => set((state) => ({ cartItems: state.cartItems.filter((item) => item.uid !== uid) })),
  cartTotal: () => get().cartItems.reduce((sum, item) => sum + item.price, 0),
  discard: () => set({ cartItems: [] }),
}))
