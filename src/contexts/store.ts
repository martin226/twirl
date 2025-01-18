import { create } from 'zustand'

interface PdrState {
  dpr: number
  setDpr: (dpr: number) => void
}

export const usePdrStore = create<PdrState>()((set) => ({
  dpr: 0,
  setDpr: (dpr) => set(() => ({ dpr })),
}))

