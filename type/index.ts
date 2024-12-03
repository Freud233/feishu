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
    end:              string;
    projectId:        string;
    start:            string;
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

export interface IClockifyProject {
  id: string
  name: string
  hourlyRate: HourlyRate
  clientId: string
  workspaceId: string
  billable: boolean
  memberships: Membership[]
  color: string
  estimate: Estimate
  archived: boolean
  duration: string
  clientName: string
  note: string
  costRate: CostRate
  timeEstimate: TimeEstimate
  budgetEstimate: any
  estimateReset: any
  template: boolean
  public: boolean
}

export interface HourlyRate {
  amount: number
  currency: string
}

export interface Membership {
  userId: string
  hourlyRate: any
  costRate: any
  targetId: string
  membershipType: string
  membershipStatus: string
}

export interface Estimate {
  estimate: string
  type: string
}

export interface CostRate {
  amount: number
  currency: string
}

export interface TimeEstimate {
  estimate: string
  type: string
  resetOption: any
  active: boolean
  includeNonBillable: boolean
}

export interface ILarkUserInfo {
  calendar: Calendar
  user_id: string
}

export interface Calendar {
  calendar_id: string
  color: number
  description: string
  permissions: string
  role: string
  summary: string
  summary_alias: string
  type: string
}
