/**
 * 后端 API 业务状态码常量定义
 * 与后端接口约定保持一致
 */

// 状态码枚举
export const STATUS_CODE = {
  // 成功
  SUCCESS: 0,

  // 通用 4xx
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,

  // 服务器 5xx
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  SERVICE_UNAVAILABLE: 503,

  // 用户 1xxx
  USER_NOT_FOUND: 1001,
  USER_ALREADY_EXISTS: 1002,
  USERNAME_OR_PASSWORD_ERROR: 1003,
  USER_DISABLED: 1004,
  TOKEN_INVALID: 1005,
  TOKEN_EXPIRED: 1006,

  // 参数 2xxx
  PARAM_ERROR: 2001,
  MISSING_REQUIRED_PARAM: 2002,
  PARAM_FORMAT_ERROR: 2003,

  // 资源 3xxx
  RESOURCE_NOT_FOUND: 3001,
  RESOURCE_ALREADY_EXISTS: 3002,
  RESOURCE_LOCKED: 3003,
} as const;

// 状态码消息映射
export const STATUS_CODE_MESSAGE = {
  [STATUS_CODE.SUCCESS]: '成功',
  [STATUS_CODE.BAD_REQUEST]: '请求参数错误',
  [STATUS_CODE.UNAUTHORIZED]: '未授权',
  [STATUS_CODE.FORBIDDEN]: '禁止访问',
  [STATUS_CODE.NOT_FOUND]: '资源不存在',
  [STATUS_CODE.METHOD_NOT_ALLOWED]: '方法不允许',
  [STATUS_CODE.REQUEST_TIMEOUT]: '请求超时',
  [STATUS_CODE.CONFLICT]: '资源冲突',
  [STATUS_CODE.INTERNAL_SERVER_ERROR]: '服务器内部错误',
  [STATUS_CODE.NOT_IMPLEMENTED]: '功能未实现',
  [STATUS_CODE.SERVICE_UNAVAILABLE]: '服务不可用',
  [STATUS_CODE.USER_NOT_FOUND]: '用户不存在',
  [STATUS_CODE.USER_ALREADY_EXISTS]: '用户已存在',
  [STATUS_CODE.USERNAME_OR_PASSWORD_ERROR]: '用户名或密码错误',
  [STATUS_CODE.USER_DISABLED]: '用户已被禁用',
  [STATUS_CODE.TOKEN_INVALID]: '无效的令牌',
  [STATUS_CODE.TOKEN_EXPIRED]: '令牌已过期',
  [STATUS_CODE.PARAM_ERROR]: '参数错误',
  [STATUS_CODE.MISSING_REQUIRED_PARAM]: '缺少必要参数',
  [STATUS_CODE.PARAM_FORMAT_ERROR]: '参数格式错误',
  [STATUS_CODE.RESOURCE_NOT_FOUND]: '资源不存在',
  [STATUS_CODE.RESOURCE_ALREADY_EXISTS]: '资源已存在',
  [STATUS_CODE.RESOURCE_LOCKED]: '资源已被锁定',
} as const;

// 状态码类型定义
export type StatusCodeType = (typeof STATUS_CODE)[keyof typeof STATUS_CODE];

// 需要重新登录的状态码
export const NEED_LOGIN_STATUS_CODES = [
  STATUS_CODE.UNAUTHORIZED,
  STATUS_CODE.TOKEN_INVALID,
  STATUS_CODE.TOKEN_EXPIRED,
] as const;

// 需要特殊处理的状态码（显示模态框）
export const MODAL_STATUS_CODES = [
  STATUS_CODE.INTERNAL_SERVER_ERROR,
  STATUS_CODE.NOT_IMPLEMENTED,
  STATUS_CODE.SERVICE_UNAVAILABLE,
] as const;

// 需要显示警告的状态码
export const WARNING_STATUS_CODES = [
  STATUS_CODE.BAD_REQUEST,
  STATUS_CODE.REQUEST_TIMEOUT,
  STATUS_CODE.CONFLICT,
  STATUS_CODE.USER_ALREADY_EXISTS,
  STATUS_CODE.PARAM_ERROR,
  STATUS_CODE.MISSING_REQUIRED_PARAM,
  STATUS_CODE.PARAM_FORMAT_ERROR,
  STATUS_CODE.RESOURCE_ALREADY_EXISTS,
  STATUS_CODE.RESOURCE_LOCKED,
] as const;

// 权限相关状态码
export const PERMISSION_STATUS_CODES = [
  STATUS_CODE.FORBIDDEN,
  STATUS_CODE.USER_DISABLED,
] as const;

/**
 * 获取状态码对应的消息
 * @param code 状态码
 * @returns 消息文本
 */
export const getStatusCodeMessage = (code: number): string => {
  return STATUS_CODE_MESSAGE[code as StatusCodeType] || '未知错误';
};

/**
 * 判断是否需要重新登录
 * @param code 状态码
 * @returns 是否需要重新登录
 */
export const isNeedLogin = (code: number): boolean => {
  return NEED_LOGIN_STATUS_CODES.includes(code as any);
};

/**
 * 判断是否需要显示模态框
 * @param code 状态码
 * @returns 是否需要显示模态框
 */
export const isModalStatusCode = (code: number): boolean => {
  return MODAL_STATUS_CODES.includes(code as any);
};

/**
 * 判断是否为警告类型的状态码
 * @param code 状态码
 * @returns 是否为警告类型
 */
export const isWarningStatusCode = (code: number): boolean => {
  return WARNING_STATUS_CODES.includes(code as any);
};

/**
 * 判断是否为权限相关的状态码
 * @param code 状态码
 * @returns 是否为权限相关
 */
export const isPermissionStatusCode = (code: number): boolean => {
  return PERMISSION_STATUS_CODES.includes(code as any);
};

/**
 * 判断是否为系统错误
 * @param code 状态码
 * @returns 是否为系统错误
 */
export const isSystemError = (code: number): boolean => {
  return MODAL_STATUS_CODES.includes(code as any);
};
