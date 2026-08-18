import type { FormInstance } from 'antd';
import { Form, Input, InputNumber, Select, Spin, Switch } from 'antd';

import type { MenuValues } from '../menuConfig';

const TYPE_OPTIONS = [
  { label: '目录', value: '目录' },
  { label: '菜单', value: '菜单' },
];

interface MenuFormProps {
  form: FormInstance<MenuValues>;
  parentOptions: { label: string; value: string }[];
  parentLoading: boolean;
  onParentOpen?: () => void;
}

const MenuForm = ({
  form,
  parentOptions,
  parentLoading,
  onParentOpen,
}: MenuFormProps) => {
  const menuType = Form.useWatch('menu_type', form);

  return (
    <Form<MenuValues> form={form} layout="vertical">
      <Form.Item
        label="菜单名称"
        name="menu_name"
        rules={[{ required: true, message: '请输入菜单名称' }]}
      >
        <Input maxLength={30} placeholder="请输入菜单名称" />
      </Form.Item>
      <Form.Item label="父级菜单" name="parent_name">
        <Select
          allowClear
          showSearch
          loading={parentLoading}
          options={parentOptions}
          optionFilterProp="label"
          placeholder="请选择父级菜单"
          notFoundContent={parentLoading ? <Spin size="small" /> : undefined}
          onOpenChange={(open) => {
            if (open) onParentOpen?.();
          }}
        />
      </Form.Item>
      <Form.Item
        label="类型"
        name="menu_type"
        rules={[{ required: true, message: '请选择菜单类型' }]}
      >
        <Select
          options={TYPE_OPTIONS}
          placeholder="请选择菜单类型"
          onChange={(value) => {
            if (value === '目录') form.setFieldValue('component', '');
          }}
        />
      </Form.Item>
      <Form.Item
        label="路由路径"
        name="route_path"
        rules={[{ required: true, message: '请输入路由路径' }]}
      >
        <Input maxLength={100} placeholder="请输入路由路径" />
      </Form.Item>
      <Form.Item
        label="组件路径"
        name="component"
        dependencies={['menu_type']}
        rules={[
          ({ getFieldValue }) => ({
            required: getFieldValue('menu_type') === '菜单',
            message: '请输入组件路径',
          }),
        ]}
      >
        <Input
          maxLength={100}
          disabled={menuType === '目录'}
          placeholder={
            menuType === '目录' ? '目录无需配置组件' : '例如 ./Dashboard'
          }
        />
      </Form.Item>
      <Form.Item label="图标" name="icon">
        <Input maxLength={50} placeholder="例如 dashboard" />
      </Form.Item>
      <Form.Item label="菜单隐藏" name="hide_in_menu" valuePropName="checked">
        <Switch checkedChildren="隐藏" unCheckedChildren="显示" />
      </Form.Item>
      <Form.Item
        label="排序"
        name="sort"
        rules={[{ required: true, message: '请输入排序值' }]}
      >
        <InputNumber min={0} precision={0} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item
        label="状态"
        name="status"
        getValueProps={(value) => ({ checked: value === '启用' })}
        getValueFromEvent={(checked) => (checked ? '启用' : '禁用')}
      >
        <Switch checkedChildren="启用" unCheckedChildren="禁用" />
      </Form.Item>
    </Form>
  );
};

export default MenuForm;
