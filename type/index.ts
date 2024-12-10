/**
 * ICalendarTimeInfo 接口定义了日历事件的时间信息。
 * 注意：date 和 timestamp 字段不应同时被指定。
 * - date（可选）：表示事件的日期，格式为字符串。
 * - timestamp：表示事件的时间戳，为必填项，类型为数字。
 * - timezone：表示时区，可以是 'Asia/Shanghai' 或其他有效的时区字符串，为必填项。
 */
interface ICalendarTimeInfo {
  date?: string; // 可选的日期字段，如果提供了 timestamp，则不应提供此字段。
  timestamp: number; // 必填的时间戳字段，表示事件的具体时间。
  timezone: 'Asia/Shanghai' | string; // 必填的时区字段，可以是 'Asia/Shanghai' 或其他有效的时区字符串。
}

/**
 * ICalendarCreateEvent 接口定义了创建日历事件所需的信息。
 * - summary（可选）：事件的标题或摘要。
 * - description（可选）：事件的描述。
 * - need_notification（可选）：是否需要通知，默认为 false（如果未提供）。
 * - start_time：事件的开始时间，包含日期、时间戳和时区信息，为必填项。
 * - end_time：事件的结束时间，包含日期、时间戳和时区信息，为必填项。
 */
export interface ICalendarCreateEvent {
  summary?: string; // 可选的事件标题或摘要。
  description?: string; // 可选的事件描述。
  need_notification?: boolean; // 可选的是否需要通知的标志，默认为 false（如果未提供）。
  start_time: ICalendarTimeInfo; // 必填的事件开始时间信息。
  end_time: ICalendarTimeInfo; // 必填的事件结束时间信息。
}

/**
 * ICrateClockifyTimeEntry 接口定义了创建 Clockify 时间条目的信息。
 * - billable：表示该时间条目是否可计费，为必填项。
 * - customAttributes：自定义属性数组，为可选项，用于存储额外的信息。
 * - customFields：自定义字段数组，为可选项，用于存储特定的字段值。
 * - description：时间条目的描述，为必填项。
 * - end：时间条目的结束时间，为必填项，格式为字符串（通常是 ISO 8601 格式）。
 * - projectId：关联的项目 ID，为必填项。
 * - start：时间条目的开始时间，为必填项，格式为字符串（通常是 ISO 8601 格式）。
 * - tagIds：与该时间条目关联的标签 ID 数组，为可选项。
 * - taskId：关联的任务 ID，为可选项。
 * - type：时间条目的类型，为必填项。
 */
export interface ICrateClockifyTimeEntry {
  billable: boolean; // 必填项，表示该时间条目是否可计费。
  customAttributes: ICustomAttribute[]; // 可选项，自定义属性数组。
  customFields: ICustomField[]; // 可选项，自定义字段数组。
  description: string; // 必填项，时间条目的描述。
  end: string; // 必填项，时间条目的结束时间，格式为字符串（ISO 8601）。
  projectId: string; // 必填项，关联的项目 ID。
  start: string; // 必填项，时间条目的开始时间，格式为字符串（ISO 8601）。
  tagIds: string[]; // 可选项，与该时间条目关联的标签 ID 数组。
  taskId: string; // 可选项，关联的任务 ID。
  type: string; // 必填项，时间条目的类型。
}

/**
 * ICustomAttribute 接口定义了自定义属性的结构。
 * - name：属性的名称，为必填项。
 * - namespace：属性的命名空间，为必填项，用于区分相同名称但不同来源的属性。
 * - value：属性的值，为必填项。
 */
export interface ICustomAttribute {
  name: string; // 必填项，属性的名称。
  namespace: string; // 必填项，属性的命名空间。
  value: string; // 必填项，属性的值。
}

/**
 * ICustomField 接口定义了自定义字段的结构。
 * - customFieldId：自定义字段的 ID，为必填项。
 * - sourceType：字段值的来源类型，为必填项。
 * - value：字段的值，为必填项。
 */
export interface ICustomField {
  customFieldId: string; // 必填项，自定义字段的 ID。
  sourceType: string; // 必填项，字段值的来源类型。
  value: string; // 必填项，字段的值。
}
