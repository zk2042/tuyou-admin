/*
 * 字典工具函数
 * @description 提供字典数据转换的通用工具函数
 * * - dictToValueEnum: 数组 → ProTable valueEnum（筛选下拉、状态标签）
 * - getNestedValue: 取嵌套对象的字段值
 * @author zk
 * @date 2026-07-20
 */

// ========== 类型 ==========
interface DictItem {
  dataValue?: string;
  dataLabel?: string;
  extendedProps?: Record<string, any>;
  [key: string]: any;
}

// ========== 取嵌套值 ==========
export const getNestedValue = (obj: Record<string, any>, path: string): any => {
  if (!path.includes('.')) return obj[path];
  return path.split('.').reduce((cur, key) => cur?.[key], obj);
};

// ========== 数组 → ProTable valueEnum ==========
export const dictToValueEnum = (
  dictData: DictItem[],
  options: {
    valueField?: string;
    labelField?: string;
    statusField?: string;
    defaultStatus?: string;
  } = {},
) => {
  const {
    valueField = 'dataValue',
    labelField = 'dataLabel',
    statusField = 'extendedProps.status',
    defaultStatus = 'Default',
  } = options;

  return dictData.reduce((acc, item) => {
    const value = getNestedValue(item, valueField);
    acc[value] = {
      text: getNestedValue(item, labelField) || '',
      status: getNestedValue(item, statusField) || defaultStatus,
    };
    return acc;
  }, {} as Record<string, any>);
};
