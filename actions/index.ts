'use server'
import { client } from '@/lark-sdk'
import * as lark from '@larksuiteoapi/node-sdk'
export const getCalendar = async (openId: string) => {
  console.log('🚀 ~ getCalendar ~ openId:', openId)
  try {
    if (!openId) return
    // const data = await fetch('https://open.feishu.cn/open-apis/calendar/v4/calendars/primary', {
    //   method: 'POST',
    //   headers: {
    //     Authorization: `Bearer ${openId}`,
    //   },
    // })
    // return data.json()
    const data = await client.calendar.calendar
      .primary(
        {
          params: {
            user_id_type: 'open_id',
          },
        },
        lark.withUserAccessToken(`${openId}`)
      )
      .then((res) => {
        console.log(res)
        return res
      })
      .catch((e) => {
        console.error(JSON.stringify(e.response.data, null, 4))
      })
    return data
  } catch (error) {
    throw error
  }
}

export const createCalendarEvent = async (payload: any) => {
  console.log('🚀 ~ createCalendarEvent ~ payload:', payload)
  try {
    const res = await client.calendar.calendarEvent.create(payload)
    console.log('🚀 ~ createCalendarEvent ~ res:', res)
    return res
  } catch (error) {
    throw error
  }
}

export const getCalendarEvents = async (calendarId: string) => {
  const data = await client.calendar.calendarEvent
    .list(
      {
        path: {
          calendar_id: calendarId,
        },
      },
      lark.withUserAccessToken('u-dUTDtKakB2YVxIpNvRKxP8l12W3w44t1VgG0k5uy242c')
    )
    
  return data
}
