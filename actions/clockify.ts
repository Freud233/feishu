'use server';
const CLOCKIFY_BASE_URL = 'https://api.clockify.me/api';
import { ICrateClockifyTimeEntry } from '@/type';
import axios from 'axios';

const axiosInstance = axios.create({
  timeout: 1000 * 60,
  baseURL: CLOCKIFY_BASE_URL,
  headers: {
    'x-api-key': process.env.clockifyKey || '',
  },
});
/**
 * 获取clockify所有工作区
 */
const getAllWorkSpaces = async () => {
  const { data } = await axiosInstance.get('/v1/workspaces?roles=WORKSPACE_ADMIN&roles=OWNER');
  console.log('🚀 ~ getAllWorkSpaces ~ data:', data);
  return data;
};
/**
 * 获取用户信息
 *
 * */
const getClockifyUserInfo = async () => {
  const { data } = await axiosInstance.get('/v1/user');
  return data;
};

/**
 * Get time entries for a user on workspace
 * @Param('userId', 用户ID)
 * @Param('workspaceId', 工作区ID)
 * */

const getTimeEntries = async (userId: string, workspaceId: string) => {
  if (!userId || !workspaceId) return;
  const { data } = await axiosInstance.get(`/v1/workspaces/${workspaceId}/user/${userId}/time-entries`);
  return data;
};

/**
 * Add a new time entry
 *
 * */

const createTimeEntries = async (workspaceId: string, payload?: Partial<ICrateClockifyTimeEntry>) => {
  const { data } = await axiosInstance.post(`/v1/workspaces/${workspaceId}/time-entries`, payload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return data;
};

/**
 * Get all projects on workspace
 * */
const getAllProject = async (workspaceId: string) => {
  if (!workspaceId) return;
  const { data } = await axiosInstance.get(`/v1/workspaces/${workspaceId}/projects`);
  return data;
};

/**
 * Add a new project
 * @requires workspaceId,projectName
 * */

const createClockifyProject = async (workspaceId: string, projectName: string) => {
  if (!workspaceId || !projectName) return;
  const res = await getAllProject(workspaceId);
  if (res.some((item: any) => item.name == projectName))
    return {
      code: 10005,
      msg: '项目名重复',
    };
  const { data } = await axiosInstance.post(`/v1/workspaces/${workspaceId}/projects`, {
    name: projectName,
    billable: false,
  });
  return data;
};

export {
  createClockifyProject,
  createTimeEntries,
  getAllProject,
  getAllWorkSpaces,
  getClockifyUserInfo,
  getTimeEntries
};

