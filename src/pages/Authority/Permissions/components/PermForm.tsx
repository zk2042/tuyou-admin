import type { FormInstance } from 'antd';
import { Form, Input, Select, Spin, Switch } from 'antd';

import type { PermValues } from '../permissionsConfig';

interface PermFormProps {
  form: FormInstance<PermValues>;
  moduleOptions: { label: string; value: string }[];
  moduleLoading: boolean;
  onModuleOpen: () => void;
}

const METHOD_OPTIONS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map(
  (value) => ({ value, label: value }),
);

const PermForm = ({
  form,
  moduleOptions,
  moduleLoading,
  onModuleOpen,
}: PermFormProps) => (
  <Form<PermValues> form={form} layout="vertical">
    <Form.Item
      label="权限名称"
      name="perm_name"
      rules={[{ required: true, message: '请输入权限名称' }]}
    >
      <Input maxLength={50} placeholder="请输入权限名称" />
    </Form.Item>
    <Form.Item
      label="模块"
      name="module"
      rules={[{ required: true, message: '请选择模块' }]}
    >
      <Select
        showSearch
        loading={moduleLoading}
        placeholder="请选择模块"
        options={moduleOptions}
        optionFilterProp="label"
        notFoundContent={moduleLoading ? <Spin size="small" /> : '暂无模块'}
        onOpenChange={(open) => {
          if (open) onModuleOpen();
        }}
      />
    </Form.Item>
    <Form.Item
      label="权限标识"
      name="perm_key"
      rules={[{ required: true, message: '请输入权限标识' }]}
    >
      <Input maxLength={100} placeholder="请输入权限标识" />
    </Form.Item>
    <Form.Item
      label="请求方法"
      name="request_method"
      rules={[{ required: true, message: '请选择请求方法' }]}
    >
      <Select placeholder="请选择请求方法" options={METHOD_OPTIONS} />
    </Form.Item>
    <Form.Item
      label="API 路径"
      name="api_path"
      rules={[{ required: true, message: '请输入 API 路径' }]}
    >
      <Input maxLength={200} placeholder="请输入 API 路径" />
    </Form.Item>
    <Form.Item
      label="状态"
      name="status"
      getValueProps={(value) => ({ checked: value === '启用' })}
      getValueFromEvent={(checked) => (checked ? '启用' : '禁用')}
      rules={[{ required: true }]}
    >
      <Switch checkedChildren="启用" unCheckedChildren="禁用" />
    </Form.Item>
  </Form>
);

export default PermForm;
