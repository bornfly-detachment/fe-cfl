import { create } from 'zustand'
import type { Language } from '@/lib/translations'

type UIState = {
  sidebarOpen: boolean
  currentView: string
  currentTaskId: string | null
  theme: 'dark' | 'light' | 'system'
  fontSize: 'sm' | 'md' | 'lg'
  language: Language
}

type ChronicleState = {
  uiState: UIState
  setUIState: (updates: Partial<UIState>) => void
  toggleSidebar: () => void
}

export const useChronicleStore = create<ChronicleState>((set) => ({
  uiState: {
    sidebarOpen: true,
    currentView: 'prvse-world',
    currentTaskId: null,
    theme: 'dark',
    fontSize: 'md',
    language: 'zh',
  },
  setUIState: (updates) => set((state) => ({ uiState: { ...state.uiState, ...updates } })),
  toggleSidebar: () => set((state) => ({ uiState: { ...state.uiState, sidebarOpen: !state.uiState.sidebarOpen } })),
}))
