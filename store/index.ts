import { create } from 'zustand'

export const useLarkStore = create((set) => ({
  token: '',
  calendarId: '',
  updateToken: (newToken: string) => set({ token: newToken }),
  removeToken: () => set({ token: '' }),
  updateCalendarId: (newId: string) => set({ calendarId: newId }),
  removeCalendarId: () => set({ calendarId: '' }),
}))

export const useClockifyStore = create((set) => ({
  workspaceId: '',
  clockifyUserId: '',
  updateWorkspaceId: (newId: string) => set({ workspaceId: newId }),
  updateClockifyUserId: (id: string) => set({ clockifyUserId: id }),
}))
