'use server';
import { client } from '@/lark-sdk';
import { ResData } from '@/type/response';
import * as lark from '@larksuiteoapi/node-sdk';
export const getLarkCalendar = async (token: string): Promise<ResData> => {
  console.log('🚀 ~ getCalendar ~ openId:', token);
  try {
    if (!token)
      return {
        code: 10001,
        msg: '获取日程失败',
      };
    // const data = await fetch('https://open.feishu.cn/open-apis/calendar/v4/calendars/primary', {
    //   method: 'POST',
    //   headers: {
    //     Authorization: `Bearer ${openId}`,
    //   },
    // })
    // return data.json()
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

export const createCalendarEvent = async (payload: any, token: string): Promise<ResData> => {
  try {
    const { code, data, msg } = await client.calendar.calendarEvent.create(payload, lark.withUserAccessToken(token));
    return code === 0 ? { data, msg, code } : { code: 10001, msg: '登录错误' };
  } catch (error) {
    throw error;
  }
};

export const getCalendarEvents = async (calendarId: string, token: string): Promise<ResData> => {
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
