'use server';
import { CODE } from '@/constants';
import { client } from '@/lark-sdk';
import { failure, safeAction, success } from '@/lib/result';
import { ILarkTask, ITaskMember } from '@/type';
import { IResData } from '@/type/response';
import * as lark from '@larksuiteoapi/node-sdk';

/** 创建日历事件的请求体类型直接取自 SDK，避免 any 散落 */
type CreateCalendarEventPayload = Parameters<typeof client.calendar.calendarEvent.create>[0];

/** 获取用户主日历 */
export async function getLarkCalendar(token: string): Promise<IResData> {
  if (!token) return failure(CODE.TOKEN, '请先登录');
  return safeAction(
    async () => {
      const { data, code, msg } = await client.calendar.calendar.primary(
        { params: { user_id_type: 'open_id' } },
        lark.withUserAccessToken(token),
      );
      return code === CODE.OK ? success(data, msg) : failure(CODE.LARK, '获取日程失败');
    },
    '获取日程失败',
  );
}

export async function createCalendarEvent(
  payload: CreateCalendarEventPayload,
  token: string,
): Promise<IResData> {
  if (!token) return failure(CODE.TOKEN, '请先登录');
  return safeAction(
    async () => {
      const { code, data, msg } = await client.calendar.calendarEvent.create(
        payload,
        lark.withUserAccessToken(token),
      );
      return code === CODE.OK ? success(data, msg) : failure(CODE.LARK, '创建日程失败');
    },
    '创建日程失败',
  );
}

export async function getCalendarEvents(calendarId: string, token: string): Promise<IResData> {
  if (!token || !calendarId) return failure(CODE.PARAM, '请先登录');
  return safeAction(
    async () => {
      const { data, code, msg } = await client.calendar.calendarEvent.list(
        { path: { calendar_id: calendarId } },
        lark.withUserAccessToken(token),
      );
      return code === CODE.OK ? success(data, msg) : failure(CODE.LARK, '获取日程列表失败');
    },
    '获取日程列表失败',
  );
}

export async function getUserInfo(token: string): Promise<IResData> {
  if (!token) return failure(CODE.TOKEN, '请先登录');
  return safeAction(
    async () => {
      const { code, data, msg } = await client.authen.userInfo.get({}, lark.withUserAccessToken(token));
      return code === CODE.OK ? success(data, msg) : failure(CODE.LARK, '获取用户信息失败');
    },
    '获取用户信息失败',
  );
}

/** 获取未完成任务列表 */
export async function getTaskList(token: string): Promise<IResData> {
  if (!token) return failure(CODE.TOKEN, '请先登录');
  return safeAction(
    async () => {
      const { code, data, msg } = await client.task.v2.task.list(
        { params: { page_size: 50, completed: false } },
        lark.withUserAccessToken(token),
      );
      return code === CODE.OK ? success(data, msg) : failure(CODE.LARK, '获取任务列表失败');
    },
    '获取任务列表失败',
  );
}

/**
 * 更新任务完成状态。
 *
 * 修复两处问题：
 * 1. 原实现把 `dayjs() + ''`（可读日期字符串）当 completed_at 传给飞书，接口需要的是秒级时间戳字符串；
 * 2. update_fields 只有 completed_at，却同时想修改 status，导致 status 切换不生效。
 */
export async function patchTask(newTask: Partial<ILarkTask>, token: string): Promise<IResData> {
  if (!token) return failure(CODE.TOKEN, '请先登录');
  if (!newTask.guid) return failure(CODE.PARAM, '缺少任务标识');

  return safeAction(
    async () => {
      const isDone = newTask.status === 'done';
      const task = {
        ...newTask,
        completed_at: isDone ? String(Math.floor(Date.now() / 1000)) : '0',
      };
      const { code, data, msg } = await client.task.v2.task.patch(
        {
          data: {
            task,
            update_fields: ['completed_at', 'status'],
          },
          path: { task_guid: newTask.guid as string },
        },
        lark.withUserAccessToken(token),
      );
      return code === CODE.OK ? success(data, msg) : failure(CODE.LARK, '更新任务失败');
    },
    '更新任务失败',
  );
}

export async function createTask(
  payload: { summary: string; members: ITaskMember[] },
  token: string,
): Promise<IResData> {
  if (!token) return failure(CODE.TOKEN, '请先登录');
  if (!payload.summary?.trim()) return failure(CODE.PARAM, '任务名称不能为空');

  return safeAction(
    async () => {
      const { code, data, msg } = await client.task.v2.task.create(
        { data: { summary: payload.summary, members: payload.members } },
        lark.withUserAccessToken(token),
      );
      return code === CODE.OK ? success(data, msg) : failure(CODE.LARK, '创建任务失败');
    },
    '创建任务失败',
  );
}
