/**
 * 飞书store
 * */
export type ILarkStore = {
  token: string;
  calendarId: string;
  refreshToken: string;
  isTokenExpired: boolean;
  tokenExpiredAt: number;
  updateToken: (token: string) => void;
  removeToken: () => void;
  updateCalendarId: (id: string) => void;
  removeCalendarId: () => void;
  updateRefreshToken: (token: string) => void;
  updateIsTokenExpired: () => void;
  updateTokenExpiredAt: (time: number) => void;
};

export type IUserInfo = {
  username: string | undefined;
  userId: string | undefined;
  avatarUrl: string | undefined;
  updateUsername: (newName: string | undefined) => void;
  updateUserId: (newId: string | undefined) => void;
  updateAvatarUrl: (newUrl: string | undefined) => void;
};
export type IClockifyStore = {
  workspaceId: string;
  clockifyUserId: string;
  projectData: IClockifyProject[];
  projectId: string;
  updateWorkspaceId: (id: string) => void;
  updateClockifyUserId: (id: string) => void;
  updateProjectData: (newArr: IClockifyProject[]) => void;
  updateProjectId: (id: string) => void;
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
