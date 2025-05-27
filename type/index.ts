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

/**
 * 飞书任务数据结构
 */
export interface ILarkTask {
  /**
   * 任务完成时间戳（字符串形式），"0" 表示未完成
   */
  completed_at: string;

  /**
   * 任务创建时间戳（字符串形式）
   */
  created_at: string;

  /**
   * 任务创建者信息
   */
  creator: TaskUser;

  /**
   * 任务依赖列表
   */
  dependencies: any[];

  /**
   * 任务描述
   */
  description: string;

  /**
   * 额外信息字段
   */
  extra: string;

  /**
   * 任务全局唯一标识符
   */
  guid: string;

  /**
   * 是否为里程碑任务
   */
  is_milestone: boolean;

  /**
   * 任务关联成员列表
   */
  members: TaskMember[];

  /**
   * 任务模式（数字类型，含义需参考飞书文档）
   */
  mode: number;

  /**
   * 任务来源信息
   */
  origin: TaskOrigin;

  /**
   * 父任务GUID
   */
  parent_task_guid: string;

  /**
   * 重复规则
   */
  repeat_rule: string;

  /**
   * 任务来源类型（数字类型，含义需参考飞书文档）
   */
  source: number;

  /**
   * 任务状态（todo: 待办, doing: 进行中, done: 已完成等）
   */
  status: string;

  /**
   * 子任务数量
   */
  subtask_count: number;

  /**
   * 任务摘要/标题
   */
  summary: string;

  /**
   * 任务ID
   */
  task_id: string;

  /**
   * 任务所属清单列表
   */
  tasklists: any[];

  /**
   * 任务更新时间戳（字符串形式）
   */
  updated_at: string;

  /**
   * 任务详情页URL
   */
  url: string;
}

/**
 * 任务用户信息结构
 */
interface TaskUser {
  /**
   * 用户ID
   */
  id: string;

  /**
   * 用户类型（通常为 "user"）
   */
  type: string;
}

/**
 * 任务成员信息结构
 */
interface TaskMember {
  /**
   * 成员ID
   */
  id: string;

  /**
   * 成员角色（assignee: 负责人, follower: 关注者等）
   */
  role: string;

  /**
   * 成员类型（通常为 "user"）
   */
  type: string;
}

/**
 * 任务来源信息结构
 */
interface TaskOrigin {
  /**
   * 来源链接信息
   */
  href: TaskHref;

  /**
   * 来源平台多语言名称
   */
  platform_i18n_name: TaskI18nNames;
}

/**
 * 任务来源链接信息结构
 */
interface TaskHref {
  /**
   * 链接标题
   */
  title: string;

  /**
   * 链接URL
   */
  url: string;
}

/**
 * 任务多语言名称结构
 */
interface TaskI18nNames {
  de_de: string;  // 德语
  en_us: string;  // 美式英语
  es_es: string;  // 西班牙语
  fr_fr: string;  // 法语
  it_it: string;  // 意大利语
  ja_jp: string;  // 日语
  ko_kr: string;  // 韩语
  ru_ru: string;  // 俄语
  th_th: string;  // 泰语
  zh_cn: string;  // 简体中文
  zh_hk: string;  // 繁体中文（香港）
  zh_tw: string;  // 繁体中文（台湾）
}