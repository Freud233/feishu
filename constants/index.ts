/** 统一业务状态码：0 成功，其余为可直接展示给用户的错误 */
export const CODE = {
  OK: 0,
  UNKNOWN: 10000,
  LARK: 10001,
  ACTION: 10002,
  LOGIN: 10003,
  PARAM: 10004,
  TOKEN: 10005,
} as const;

/** 飞书登录地址；client_id 与回调地址支持环境变量覆盖，便于多环境部署 */
const LARK_CLIENT_ID = process.env.NEXT_PUBLIC_LARK_CLIENT_ID || 'cli_a682708d8038100e';
const LARK_REDIRECT_URI = process.env.NEXT_PUBLIC_LARK_REDIRECT_URI || 'https://su9.top/auth';
export const LARK_LOGIN_URL =
  `https://accounts.feishu.cn/open-apis/authen/v1/authorize` +
  `?client_id=${LARK_CLIENT_ID}` +
  `&redirect_uri=${encodeURIComponent(LARK_REDIRECT_URI)}` +
  `&scope=calendar:calendar`;

/** 创建飞书任务时默认指派的成员 open_id，可用环境变量覆盖，避免换账号后失效 */
export const LARK_TASK_ASSIGNEE_ID =
  process.env.NEXT_PUBLIC_LARK_TASK_ASSIGNEE_ID || 'ou_a94f013df62163fd13eca73b7ce50a62';
