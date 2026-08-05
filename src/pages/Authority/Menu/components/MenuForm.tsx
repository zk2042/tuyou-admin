import type { FormInstance } from 'antd';
import { Form, Input, InputNumber, Select, Switch } from 'antd';

import type { MenuValues } from '../menuConfig';

const TYPE_OPTIONS = [
  { label: '目录', value: '目录' },
  { label: '菜单', value: '菜单' },
];

interface MenuFormProps {
  form: FormInstance<MenuValues>;
}

const MenuForm = ({ form }: MenuFormProps) => {
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
      <Form.Item
        label="父级菜单"
        name="parent_name"
        dependencies={['menu_type']}
        rules={[
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (getFieldValue('menu_type') !== '菜单' || value?.trim()) {
                return Promise.resolve();
              }

              return Promise.reject(new Error('请输入父级菜单'));
            },
          }),
        ]}
      >
        <Input
          maxLength={30}
          allowClear
          disabled={menuType === '目录'}
          placeholder={
            menuType === '目录' ? '一级目录无父级菜单' : '请输入父级菜单'
          }
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
            if (value === '目录') {
              form.setFieldValue('parent_name', null);
            }
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
        label="排序"
        name="sort"
        rules={[{ required: true, message: '请输入排序值' }]}
      >
        <InputNumber min={0} precision={0} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item label="状态" name="status" valuePropName="checked">
        <Switch checkedChildren="启用" unCheckedChildren="禁用" />
      </Form.Item>
    </Form>
  );
};

export default MenuForm;
