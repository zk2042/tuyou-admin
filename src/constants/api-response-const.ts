/**
 * 后端统一返回格式定义
 * 所有接口默认返回：
 * {
 *   code: number,
 *   message: string,
 *   data: T | null
 * }
 */

import { STATUS_CODE } from './status-code-const';

export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T | null;
}

export const API_RESPONSE_SUCCESS_CODE = STATUS_CODE.SUCCESS;
