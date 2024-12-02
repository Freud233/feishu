import { IClockifyProject } from '@/type'
import { create } from 'zustand'

type ILarkStore = {
  token: string
  calendarId: string
  updateToken: (token: string) => void
  removeToken: () => void
  updateCalendarId: (id: string) => void
  removeCalendarId: () => void
}

type IClockifyStore = {
  workspaceId: string
  clockifyUserId: string
  projectData: IClockifyProject[]
  updateWorkspaceId: (id: string) => void
  updateClockifyUserId: (id: string) => void
  updateProjectData: (newArr: IClockifyProject[]) => void
}

export const useLarkStore = create<ILarkStore>()((set) => ({
  token: '',
  calendarId: '',
  updateToken: (newToken: string) => set((state) => ({ ...state, token: newToken })),
  removeToken: () => set({ token: '' }),
  updateCalendarId: (newId: string) => set((state) => ({ ...state, calendarId: newId })),
  removeCalendarId: () => set({ calendarId: '' }),
}))

export const useClockifyStore = create<IClockifyStore>()((set) => ({
  workspaceId: '',
  clockifyUserId: '',
  projectData: [],
  updateWorkspaceId: (newId: string) => set((state) => ({ ...state, workspaceId: newId })),
  updateClockifyUserId: (id: string) => set((state) => ({ ...state, clockifyUserId: id })),
  updateProjectData: (newArr: IClockifyProject[]) => set((state) => ({ ...state, projectData: newArr })),
}))
