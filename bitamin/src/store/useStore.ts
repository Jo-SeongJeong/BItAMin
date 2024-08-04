import { create } from 'zustand'

interface ExampleState {
  count: number
  increment: () => void
}

const useStore = create<ExampleState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}))

export default useStore
