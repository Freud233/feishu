'use server'
const CLOCKIFY_BASE_URL = 'https://api.clockify.me/api'
import { ICrateClockifyTimeEntry } from '@/type'
import axios from 'axios'

const axiosInstance = axios.create({
  timeout: 1000 * 60,
  baseURL: CLOCKIFY_BASE_URL,
  headers: {
    'x-api-key': process.env.clockifyKey || '',
  },
})
/**
 * 获取clockify所有工作区
 */
export const getAllWorkSpaces = async () => {
  const { data } = await axiosInstance.get('/v1/workspaces?roles=WORKSPACE_ADMIN&roles=OWNER')
  console.log('🚀 ~ getAllWorkSpaces ~ data:', data)
  return data
}
/**
 * 获取用户信息
 *
 * */
export const getUserInfo = async () => {
  const { data } = await axiosInstance.get('/v1/user')
  return data
}

/**
 * Get time entries for a user on workspace
 * @Param('userId', 用户ID)
 * @Param('workspaceId', 工作区ID)
 * */

export const getTimeEntries = async (userId: string, workspaceId: string) => {
  if (!userId || !workspaceId) return
  const { data } = await axiosInstance.get(`/v1/workspaces/${workspaceId}/user/${userId}/time-entries`)
  return data
}

/**
 * Add a new time entry
 *
 * */

export const createTimeEntries = async (workspaceId: string, payload?: Partial<ICrateClockifyTimeEntry>) => {
  const { data } = await axiosInstance.post(`/v1/workspaces/${workspaceId}/time-entries`, payload, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return data
}

/**
 * Get all projects on workspace
 * */
export const getAllProject = async (workspaceId: string) => {
  if (!workspaceId) return
  const { data } = await axiosInstance.get(`/v1/workspaces/${workspaceId}/projects`)
  console.log('🚀 ~ getAllProject ~ data:', data)
  return data
}
