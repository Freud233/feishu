'use server';
import { CODE } from '@/constants';
import { failure, safeAction, success } from '@/lib/result';
import { ICrateClockifyTimeEntry } from '@/type';
import { IResData } from '@/type/response';
import axios from 'axios';

const CLOCKIFY_BASE_URL = 'https://api.clockify.me/api';

const axiosInstance = axios.create({
  // 原 60s 超时会让失败请求长时间挂起；15s 足以覆盖正常接口调用
  timeout: 15 * 1000,
  baseURL: CLOCKIFY_BASE_URL,
  headers: {
    'x-api-key': process.env.clockifyKey || '',
  },
});

/** 所有 Clockify 接口统一返回 { code, msg, data }，异常由 safeAction 收口 */
const runClockify = async <T>(
  request: () => Promise<{ data: T }>,
  fallbackMsg: string,
): Promise<IResData> =>
  safeAction(async () => {
    const { data } = await request();
    return success(data);
  }, fallbackMsg);

/** 获取所有工作区 */
export async function getAllWorkSpaces(): Promise<IResData> {
  return runClockify(
    () => axiosInstance.get('/v1/workspaces?roles=WORKSPACE_ADMIN&roles=OWNER'),
    '获取工作区失败',
  );
}

/** 获取 Clockify 用户信息 */
export async function getClockifyUserInfo(): Promise<IResData> {
  return runClockify(() => axiosInstance.get('/v1/user'), '获取用户信息失败');
}

/** 获取指定用户在工作区的时间记录 */
export async function getTimeEntries(userId: string, workspaceId: string): Promise<IResData> {
  if (!userId || !workspaceId) return failure(CODE.PARAM, '缺少用户或工作区信息');
  return runClockify(
    () =>
      axiosInstance.get(
        `/v1/workspaces/${encodeURIComponent(workspaceId)}/user/${encodeURIComponent(userId)}/time-entries`,
      ),
    '获取时间记录失败',
  );
}

/** 新增时间记录 */
export async function createTimeEntries(
  workspaceId: string,
  payload?: Partial<ICrateClockifyTimeEntry>,
): Promise<IResData> {
  if (!workspaceId) return failure(CODE.PARAM, '缺少工作区信息');
  return runClockify(
    () =>
      axiosInstance.post(`/v1/workspaces/${encodeURIComponent(workspaceId)}/time-entries`, payload, {
        headers: { 'Content-Type': 'application/json' },
      }),
    '创建时间记录失败',
  );
}

/** 获取工作区下所有项目 */
export async function getAllProject(workspaceId: string): Promise<IResData> {
  if (!workspaceId) return failure(CODE.PARAM, '缺少工作区信息');
  return runClockify(
    () => axiosInstance.get(`/v1/workspaces/${encodeURIComponent(workspaceId)}/projects`),
    '获取项目列表失败',
  );
}

/**
 * 新增项目。
 *
 * 修复：原实现在项目名重复时返回 `{ code: 10005 }`，而调用方只判断 `if (res)`（恒为真），
 * 会误报「增加项目成功」。现在所有分支统一返回 IResData，由调用方按 code 判断。
 */
export async function createClockifyProject(
  workspaceId: string,
  projectName: string,
): Promise<IResData> {
  if (!workspaceId || !projectName?.trim()) return failure(CODE.PARAM, '缺少工作区或项目名');

  const projects = await getAllProject(workspaceId);
  if (projects.code !== CODE.OK) return projects;

  const list = (projects.data ?? []) as Array<{ name?: string }>;
  if (list.some((item) => item.name === projectName.trim())) {
    return failure(CODE.ACTION, '项目名重复');
  }

  return runClockify(
    () =>
      axiosInstance.post(`/v1/workspaces/${encodeURIComponent(workspaceId)}/projects`, {
        name: projectName.trim(),
        billable: false,
      }),
    '添加项目失败',
  );
}
