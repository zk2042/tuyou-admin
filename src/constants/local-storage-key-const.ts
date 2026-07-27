/**
 * key前缀
 */
const KEY_PREFIX = 'tuyou_admin_';
/**
 * localStorageKey集合
 */
export default {
  // 用户token
  USER_TOKEN: `${KEY_PREFIX}user_token`,
  // 刷新token
  REFRESH_TOKEN: `${KEY_PREFIX}refresh_token`,
  // 用户信息
  USER_INFO: `${KEY_PREFIX}user_info`,
  // 主题设置
  THEME_SETTINGS: `${KEY_PREFIX}theme_settings`,
};
