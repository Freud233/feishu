'use server'
import { client } from '@/lark-sdk'

export const getCalendar = async () => {
  return await client.calendar.calendar.list()
}
