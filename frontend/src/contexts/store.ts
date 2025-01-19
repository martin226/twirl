import { create } from "zustand";

interface WorkerState {
  worker: Worker | null;
  setWorker: (worker: Worker) => void;
}

export const usePdrStore = create<WorkerState>()((set) => ({
    worker: null,
    setWorker: (worker) => set({ worker }),
}));

export interface Parameter {
  group: boolean;
  name: string;
  type?: string;
  value?: number;
  min_value?: number;
  max_value?: number;
  parameters?: Parameter[];
}

interface State {
  openscad: string;
  setOpenscad: (openscad: string) => void;
  parameters: Parameter[],
  setParameters: (parameters: Parameter[] | ((prev: Parameter[]) => Parameter[])) => void;
}

export const useStateStore = create<State>((set) => ({
    openscad: "",
    setOpenscad: (openscad) => set({ openscad }),
    parameters: [],
    setParameters: (parameters) => 
        set((state) => ({ 
            parameters: typeof parameters === 'function' 
                ? parameters(state.parameters) 
                : parameters 
        })),
}));
