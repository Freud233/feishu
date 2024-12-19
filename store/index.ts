import {
  ICalendarDescriptionStore,
  ICalendarStore,
  IClockifyProject,
  IClockifyStore,
  ILarkStore,
  IUserInfo,
} from '@/type/store';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
/**
 * 飞书 token 日历ID 数据
 * */
const useLarkStore = create<ILarkStore>()(
  devtools(
    immer(
      persist(
        (set) => ({
          token: '',
          calendarId: '',
          refreshToken: '',
          isTokenExpired: true,
          tokenExpiredAt: 0,
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
          updateRefreshToken: (newToken: string) =>
            set((state) => {
              state.refreshToken = newToken;
            }),
          updateIsTokenExpired: () =>
            set((state) => {
              const time = new Date().getTime();
              state.isTokenExpired = state.tokenExpiredAt < time;
            }),
          updateTokenExpiredAt: (newTime: number) =>
            set((state) => {
              state.tokenExpiredAt = newTime;
            }),
        }),
        { name: 'lark-store', storage: createJSONStorage(() => localStorage) },
      ),
    ),
    {
      name: 'lark',
    },
  ),
);
/**
 * Clockify相关数据
 * */
const useClockifyStore = create<IClockifyStore>()(
  devtools(
    immer(
      persist(
        (set) => ({
          workspaceId: '',
          clockifyUserId: '',
          projectData: [],
          projectId: '',
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
          updateProjectId(id) {
            set((state) => {
              state.projectId = id;
            });
          },
        }),
        {
          name: 'clockify-store',
          storage: createJSONStorage(() => localStorage),
        },
      ),
    ),
    {
      name: 'clockify',
    },
  ),
);

/**
 * 保存用户信息
 * */
const useUserInfoStore = create<IUserInfo>()(
  devtools(
    immer(
      persist(
        (set) => ({
          username: undefined,
          avatarUrl: undefined,
          userId: undefined,
          updateAvatarUrl: (newUrl: string | undefined) =>
            set((state) => {
              state.avatarUrl = newUrl;
            }),
          updateUserId: (newId: string | undefined) =>
            set((state) => {
              state.userId = newId;
            }),
          updateUsername: (newName: string | undefined) =>
            set((state) => {
              state.username = newName;
            }),
        }),
        {
          name: 'user-info',
          storage: createJSONStorage(() => sessionStorage),
        },
      ),
    ),
    {
      name: 'userInfo',
    },
  ),
);

const useCalendarStore = create<ICalendarStore>()(
  devtools(
    immer(
      persist(
        (set) => ({
          title: '',
          updateTitle: (newTitle: string) =>
            set((state) => {
              state.title = newTitle;
            }),
        }),
        {
          name: 'calendar-store',
          storage: createJSONStorage(() => localStorage),
        },
      ),
    ),
  ),
);

const useCalendarDescriptionStore = create<ICalendarDescriptionStore>()(
  devtools(
    immer(
      persist(
        (set) => ({
          description: [],
          updateDescription: (title: string) =>
            set((state) => {
              state.description.push(title);
            }),
          initDescription: () => {
            set((state) => {
              state.description = [];
            });
          },
        }),
        { name: 'calendar-title-array', storage: createJSONStorage(() => localStorage) },
      ),
    ),
  ),
);
export { useCalendarDescriptionStore, useCalendarStore, useClockifyStore, useLarkStore, useUserInfoStore };

