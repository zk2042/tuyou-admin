import { apiRequest } from '@/lib/apiRequest';
import {
  ProFormSelect,
  type ProFormSelectProps,
} from '@ant-design/pro-components';
import { App } from 'antd';
import type { DefaultOptionType } from 'antd/lib/select';
import _ from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';

/**
 * API下拉选择框组件
 * @author gp
 * @description 基于API数据的通用下拉选择框组件，支持搜索和过滤功能
 * @param {string} api - API接口地址
 * @param {string} method - 请求方法，默认为'GET'
 * @param {object} params - 请求参数
 * @param {string} resultField - 响应数据字段路径，例如'data.list'
 * @param {string} valueField - 值字段名，默认为'value'
 * @param {string} labelField - 标签字段名，默认为'label'
 * @param {string} name - 表单项名称
 * @param {string} label - 表单项标签
 * @param {string} placeholder - 占位符
 * @param {boolean} required - 是否必填
 * @param {any} rules - 验证规则
 * @param {any} fieldProps - 额外的属性
 * @param {any} formInstance - 表单实例
 * @param {Array} disabledOption - 需要禁用的选项枚举值
 * @param {Array} hiddenOption - 需要隐藏的选项枚举值
 * @param {boolean} immediate - 是否立即加载数据，默认为true
 * @param {Function} transformData - 数据转换函数
 * @returns {React.ReactElement} - API下拉选择框组件
 */
interface ApiSelectProps extends Omit<ProFormSelectProps, 'options'> {
  api: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  params?: Record<string, any>;
  resultField?: string;
  valueField?: string;
  labelField?: string;
  disabledOption?: (string | number)[];
  hiddenOption?: (string | number)[];
  immediate?: boolean;
  transformData?: (data: any[]) => any[];
}

const ApiSelect: React.FC<ApiSelectProps> = ({
  api,
  method = 'GET',
  params = {},
  resultField = '',
  valueField = 'value',
  labelField = 'label',
  name,
  label,
  placeholder,
  required = false,
  rules = [],
  fieldProps = {},
  disabledOption = [],
  hiddenOption = [],
  immediate = true,
  transformData,
  ...restProps
}) => {
  const [rawOptions, setRawOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { message } = App.useApp();

  /**
   * 获取API数据
   */
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiRequest<any>({
        url: api,
        method,
        params: method === 'GET' ? params : undefined,
        data: method !== 'GET' ? params : undefined,
      });

      // 默认从统一响应结构的 data 字段取值，也支持外部自定义 resultField。
      let data = resultField ? _.get(response, resultField, []) : response.data;

      // 如果数据不是数组，尝试转换为数组
      if (!Array.isArray(data)) {
        data = data ? [data] : [];
      }

      // 应用数据转换函数
      if (transformData && typeof transformData === 'function') {
        data = transformData(data);
      }

      setRawOptions(data);
    } catch (error) {
      console.error(`获取API数据失败, 接口: ${api}`, error);
      message.error(`获取API数据失败, 接口: ${api}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 组件挂载时或 api 变化时获取数据
   */
  useEffect(() => {
    if (immediate && api) {
      // 重置选项，以便显示加载状态
      setRawOptions([]);
      fetchData();
    }
  }, [api, method, JSON.stringify(params), resultField, immediate]);

  /**
   * 处理选项的过滤和禁用逻辑
   */
  const options = useMemo(() => {
    if (rawOptions.length === 0) return [];

    return rawOptions
      .filter((item) => {
        // 获取选项值
        const value = _.get(item, valueField);
        return !hiddenOption.includes(value);
      })
      .map((item) => {
        // 获取选项值和标签
        const value = _.get(item, valueField);
        const label = _.get(item, labelField);

        return {
          label,
          value,
          disabled: disabledOption.includes(value),
          // 保留原始数据，以便在需要时使用
          ...item,
        };
      });
  }, [rawOptions, disabledOption, hiddenOption, valueField, labelField]);

  /**
   * 获取标签文本
   * @param label 标签对象
   * @param fallbackLabel 字段名称兜底值
   * @returns 标签文本
   */
  const getLabelText = (label: any, fallbackLabel: string): string => {
    // 如果label是字符串，直接返回
    if (typeof label === 'string') {
      return label;
    }

    // 如果label是React元素且有props属性
    if (label && typeof label === 'object' && 'props' in label) {
      // 安全地访问props对象
      const props = label.props as Record<string, any>;

      // 如果有children属性且为字符串，则返回children
      if (props && props.children && typeof props.children === 'string') {
        return props.children;
      }
    }

    // 默认返回兜底文本
    return fallbackLabel;
  };

  /**
   * 生成验证规则
   */
  const generateRules = () => {
    const defaultRules: any[] = [];

    if (required) {
      defaultRules.push({
        required: true,
        message: `请选择${getLabelText(label, String(name ?? '该项'))}`,
      });
    }

    return [...defaultRules, ...rules];
  };

  return (
    <ProFormSelect
      name={name}
      label={label}
      placeholder={placeholder}
      rules={rules.length > 0 ? rules : generateRules()}
      options={options}
      fieldProps={{
        showSearch: true,
        filterOption: (input: string, option?: DefaultOptionType) =>
          (option?.label ?? '')
            .toString()
            .toLowerCase()
            .includes(input.toLowerCase()),
        loading,
        ...fieldProps,
      }}
      {...restProps}
    />
  );
};

export default ApiSelect;
