import { create } from 'zustand'

export const useMenuStore = create((set) => ({
  available: [],
  selected: [],
  setItems: (available, selected) => set({ available, selected }),
  moveToSelected: (itemId) =>
    set((state) => {
      const item = state.available.find((entry) => (entry.id ?? entry._id) === itemId)
      if (!item) return state
      return {
        available: state.available.filter((entry) => (entry.id ?? entry._id) !== itemId),
        selected: [...state.selected, item],
      }
    }),
  moveToAvailable: (itemId) =>
    set((state) => {
      const item = state.selected.find((entry) => (entry.id ?? entry._id) === itemId)
      if (!item) return state
      return {
        selected: state.selected.filter((entry) => (entry.id ?? entry._id) !== itemId),
        available: [...state.available, item],
      }
    }),
}))
