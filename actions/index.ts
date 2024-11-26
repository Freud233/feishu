'use server'
import { client } from '@/lark-sdk'

export const getCalendar = async () => {
  try {
    return await client.calendar.calendar.list()
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

export const getCalendarEvents = async () => {
  try {
    return await client.calendar.calendarEvent.list({ path: { calendar_id: 'feishu.cn_LmrMbhw6ax6msjdXFf3MDh@group.calendar.feishu.cn' } })
  } catch (error) {
    throw error
  }
}
