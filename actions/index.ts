'use server';
import { client } from '@/lark-sdk';
import { ILarkTask, ITaskMember } from '@/type';
import { IResData } from '@/type/response';
import * as lark from '@larksuiteoapi/node-sdk';
const getLarkCalendar = async (token: string): Promise<IResData> => {
  console.log('🚀 ~ getCalendar ~ openId:', token);
  try {
    if (!token)
      return {
        code: 10001,
        msg: '获取日程失败',
      };
    const { data, code, msg } = await client.calendar.calendar.primary(
      {
        params: {
          user_id_type: 'open_id',
        },
      },
      lark.withUserAccessToken(`${token}`),
    );
    return code === 0 ? { data, msg, code } : { code: 10001, msg: '登录错误' };
  } catch (error) {
    throw error;
  }
};

const createCalendarEvent = async (payload: any, token: string): Promise<IResData> => {
  try {
    const { code, data, msg } = await client.calendar.calendarEvent.create(payload, lark.withUserAccessToken(token));
    return code === 0 ? { data, msg, code } : { code: 10001, msg: '登录错误' };
  } catch (error) {
    throw error;
  }
};

const getCalendarEvents = async (calendarId: string, token: string): Promise<IResData> => {
  try {
    const { data, code, msg } = await client.calendar.calendarEvent.list(
      {
        path: {
          calendar_id: calendarId,
        },
      },
      lark.withUserAccessToken(token),
    );
    return code === 0 ? { data, msg, code } : { code: 10001, msg: '登录错误' };
  } catch (error) {
    throw error;
  }
};

const getUserInfo = async (token: string) => {
  try {
    const { code, data, msg } = await client.authen.userInfo.get({}, lark.withUserAccessToken(token));
    return code === 0 ? { data, msg, code } : { code: 10001, msg: '获取用户信息错误' };
  } catch (error) {
    throw error;
  }
};

// 获取任务列表

const getTaskList = async (token: string): Promise<IResData> => {
  if (!token) return { code: 10005, msg: '请先登录' }
  try {
    const { code, data, msg } = await client.task.v2.task.list({
      params: {
        page_size: 50,
        completed: false
      }
    }, lark.withUserAccessToken(token))
    return code === 0 ? { data, msg, code } : { code: 10002, msg: '获取任务列表失败' };
  } catch (error) {
    throw error
  }
}

// 更新任务

const patchTask = async (newTask: Partial<ILarkTask>, token: string): Promise<IResData> => {
  console.log("🚀 ~ patchTask ~ summary:", newTask)
  if (!token) return { code: 10005, msg: '请先登录' }
  try {
    const { code, data, msg } = await client.task.v2.task.patch({
      data: {
        task: newTask,
        update_fields: ['completed_at']
      },
      path: {
        task_guid: newTask.guid || ''
      }
    }, lark.withUserAccessToken(token))
    console.log("🚀 ~ patchTask ~ data:", data)
    return code === 0 ? { data, msg, code } : { code: 10002, msg: '获取任务列表失败' };
  } catch (error) {
    throw error
  }
}

// 创建任务

const createTask = async (payload: { summary: string, members: ITaskMember[] }, token: string): Promise<IResData> => {
  if (!token) return { code: 10005, msg: '请先登录' }
  try {
    const { code, data, msg } = await client.task.v2.task.create({
      data: {
        summary: payload.summary,
        members: payload.members
      }
    }, lark.withUserAccessToken(token))
    return code === 0 ? { data, msg, code } : { code: 10002, msg: '创建任务失败' };

  } catch (error) {
    throw error
  }
}
export { createCalendarEvent, createTask, getCalendarEvents, getLarkCalendar, getTaskList, getUserInfo, patchTask };

