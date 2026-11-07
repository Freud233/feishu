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

// devtools 只在开发环境启用，避免生产环境每次状态变更都走扩展序列化
const DEVTOOLS_ENABLED = process.env.NODE_ENV === 'development';

/**
 * 飞书 token / 日历 ID 数据
 * 注意：tokenExpiredAt 统一为毫秒时间戳（Date.now() 体系）
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
          // 登出时清空全部关联状态，避免残留 refreshToken / 过期时间造成误判
          removeToken: () =>
            set((state) => {
              state.token = '';
              state.refreshToken = '';
              state.calendarId = '';
              state.tokenExpiredAt = 0;
              state.isTokenExpired = true;
            }),
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
              state.isTokenExpired = Date.now() >= state.tokenExpiredAt;
            }),
          updateTokenExpiredAt: (newTime: number) =>
            set((state) => {
              state.tokenExpiredAt = newTime;
            }),
        }),
        { name: 'lark-store', storage: createJSONStorage(() => localStorage) },
      ),
    ),
    { name: 'lark', enabled: DEVTOOLS_ENABLED },
  ),
);

/**
 * Clockify 相关数据
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
    { name: 'clockify', enabled: DEVTOOLS_ENABLED },
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
    { name: 'userInfo', enabled: DEVTOOLS_ENABLED },
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
    { enabled: DEVTOOLS_ENABLED },
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
              if (state.description.includes(title)) return;
              if (state.description.length > 4) {
                state.description.shift();
              }
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
    { enabled: DEVTOOLS_ENABLED },
  ),
);

export { useCalendarDescriptionStore, useCalendarStore, useClockifyStore, useLarkStore, useUserInfoStore };
