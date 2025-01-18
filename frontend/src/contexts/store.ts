import { create } from "zustand";

interface WorkerState {
  worker: Worker | null;
  setWorker: (worker: Worker) => void;
}

export const usePdrStore = create<WorkerState>()((set) => ({
    worker: null,
    setWorker: (worker) => set({ worker }),
}));