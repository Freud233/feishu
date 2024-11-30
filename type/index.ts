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

export interface ICrateClockifyTimeEntry {
    billable:         boolean;
    customAttributes: ICustomAttribute[];
    customFields:     ICustomField[];
    description:      string;
    end:              Date;
    projectId:        string;
    start:            Date;
    tagIds:           string[];
    taskId:           string;
    type:             string;
}

export interface ICustomAttribute {
    name:      string;
    namespace: string;
    value:     string;
}

export interface ICustomField {
    customFieldId: string;
    sourceType:    string;
    value:         string;
}
