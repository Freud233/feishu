/**
 * 飞书store
 * */
export type ILarkStore = {
  token: string;
  calendarId: string;
  updateToken: (token: string) => void;
  removeToken: () => void;
  updateCalendarId: (id: string) => void;
  removeCalendarId: () => void;
};

export type IClockifyStore = {
  workspaceId: string;
  clockifyUserId: string;
  projectData: IClockifyProject[];
  updateWorkspaceId: (id: string) => void;
  updateClockifyUserId: (id: string) => void;
  updateProjectData: (newArr: IClockifyProject[]) => void;
};

export interface IClockifyProject {
  id: string;
  name: string;
  hourlyRate: HourlyRate;
  clientId: string;
  workspaceId: string;
  billable: boolean;
  memberships: Membership[];
  color: string;
  estimate: Estimate;
  archived: boolean;
  duration: string;
  clientName: string;
  note: string;
  costRate: CostRate;
  timeEstimate: TimeEstimate;
  budgetEstimate: any;
  estimateReset: any;
  template: boolean;
  public: boolean;
}

export interface HourlyRate {
  amount: number;
  currency: string;
}

export interface Membership {
  userId: string;
  hourlyRate: any;
  costRate: any;
  targetId: string;
  membershipType: string;
  membershipStatus: string;
}

export interface Estimate {
  estimate: string;
  type: string;
}

export interface CostRate {
  amount: number;
  currency: string;
}

export interface TimeEstimate {
  estimate: string;
  type: string;
  resetOption: any;
  active: boolean;
  includeNonBillable: boolean;
}

export interface ILarkUserInfo {
  calendar: Calendar;
  user_id: string;
}

export interface Calendar {
  calendar_id: string;
  color: number;
  description: string;
  permissions: string;
  role: string;
  summary: string;
  summary_alias: string;
  type: string;
}
