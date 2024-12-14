/**
 * 表示响应数据的结构
 *
 * @typedef {Object} ResData
 * @property {number|undefined} code - 操作的状态码，0 表示成功，非 0 表示错误
 * @property {any} [data] - 可选属性，包含任何类型的数据（建议为具体类型以提高类型安全性）
 * @property {string|undefined} msg - 与 code 相关的消息或错误描述
 */
export type IResData = {
  code: number | undefined;
  data?: any /* 建议替换为具体类型，如：data?: SpecificDataType; */;
  msg: string | undefined;
};
