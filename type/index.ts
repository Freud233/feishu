/**
 * date 不与 timestamp 同时指定
 *
 * */
interface ICalendarTimeInfo {
  date?: string
  timestamp: number
  timezone: 'Asia/Shanghai' | string
}

export interface ICalendarCreateEvent {
  summary?: string
  description?: string
  need_notification?: boolean
  start_time: ICalendarTimeInfo
  end_time: ICalendarTimeInfo
}
