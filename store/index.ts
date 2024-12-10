import { IClockifyProject } from '@/type';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
type ILarkStore = {
  token: string;
  calendarId: string;
  updateToken: (token: string) => void;
  removeToken: () => void;
  updateCalendarId: (id: string) => void;
  removeCalendarId: () => void;
};

type IClockifyStore = {
  workspaceId: string;
  clockifyUserId: string;
  projectData: IClockifyProject[];
  updateWorkspaceId: (id: string) => void;
  updateClockifyUserId: (id: string) => void;
  updateProjectData: (newArr: IClockifyProject[]) => void;
};

export const useLarkStore = create<ILarkStore>()(
  immer(
    persist(
      (set) => ({
        token: '',
        calendarId: '',
        updateToken: (newToken: string) =>
          set((state) => {
            state.token = newToken;
          }),
        removeToken: () => set({ token: '' }),
        updateCalendarId: (newId: string) =>
          set((state) => {
            state.calendarId = newId;
          }),
        removeCalendarId: () => set({ calendarId: '' }),
      }),
      { name: 'lark-store', storage: createJSONStorage(() => localStorage) },
    ),
  ),
);

export const useClockifyStore = create<IClockifyStore>()(
  immer(
    persist(
      (set) => ({
        workspaceId: '',
        clockifyUserId: '',
        projectData: [],
        updateWorkspaceId: (newId: string) =>
          set((state: IClockifyStore) => {
            state.workspaceId = newId;
          }),
        updateClockifyUserId: (id: string) =>
          set((state: Partial<IClockifyStore>) => {
            state.clockifyUserId = id;
          }),
        updateProjectData: (newArr: IClockifyProject[]) =>
          set((state: Partial<IClockifyStore>) => {
            state.projectData = newArr;
          }),
      }),
      {
        name: 'clockify-store',
        storage: createJSONStorage(() => localStorage),
      },
    ),
  ),
);

