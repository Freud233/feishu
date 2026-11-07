import { CODE } from '@/constants';
import { IResData } from '@/type/response';

/** 成功响应 */
const success = <T>(data?: T, msg = 'ok'): IResData => ({ code: CODE.OK, msg, data });

/** 失败响应 */
const failure = (code: number, msg: string): IResData => ({ code, msg });

/**
 * 统一收口 server action 的异常。
 *
 * 原实现里每个 action 都是 `try { ... } catch (e) { throw e }`，异常原样冒泡到客户端，
 * 调用方又没有 catch，容易出现未处理的 Promise rejection 和页面白屏。
 * 这里保证任何情况下都返回可判定的 IResData，调用方只需判断 code。
 */
const safeAction = async (
  action: () => Promise<IResData>,
  fallbackMsg: string,
): Promise<IResData> => {
  try {
    return await action();
  } catch (error) {
    // 仅开发环境打印摘要，避免生产日志写入 token / 用户信息等敏感内容
    if (process.env.NODE_ENV === 'development') {
      console.error('[action]', error instanceof Error ? error.message : 'unknown error');
    }
    return failure(CODE.UNKNOWN, fallbackMsg);
  }
};

export { failure, safeAction, success };
