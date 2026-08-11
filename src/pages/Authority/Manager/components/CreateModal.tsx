import { Form, Input, Modal, Select, Spin } from 'antd';
import { useEffect } from 'react';

import type { CreateValues, RoleProps } from '../managerConfig';

interface CreateModalProps extends RoleProps {
  open: boolean;
  saving: boolean;
  onCancel: () => void;
  onSubmit: (values: CreateValues) => void;
}

const DEFAULT_VALUES: CreateValues = {
  username: '',
  adminname: '',
  password: '123456',
  role: '',
};

const CreateModal = ({
  open,
  saving,
  roleOptions,
  roleLoading,
  onRoleOpen,
  onCancel,
  onSubmit,
}: CreateModalProps) => {
  const [form] = Form.useForm<CreateValues>();

  useEffect(() => {
    if (!open) {
      return;
    }

    form.setFieldsValue(DEFAULT_VALUES);
  }, [form, open]);

  return (
    <Modal
      title="新增管理员"
      open={open}
      destroyOnHidden
      confirmLoading={saving}
      onCancel={onCancel}
      onOk={() => {
        void form.validateFields().then((values) => {
          onSubmit(values);
        });
      }}
    >
      <Form<CreateValues>
        form={form}
        layout="vertical"
        initialValues={DEFAULT_VALUES}
      >
        <Form.Item
          label="登录账号"
          name="username"
          rules={[{ required: true, message: '请输入登录账号' }]}
        >
          <Input maxLength={30} placeholder="请输入登录账号" />
        </Form.Item>
        <Form.Item
          label="真实姓名"
          name="adminname"
          rules={[{ required: true, message: '请输入管理员真实姓名' }]}
        >
          <Input maxLength={20} placeholder="请输入管理员真实姓名" />
        </Form.Item>
        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: '请输入密码' }]}
          extra="默认密码为 123456"
        >
          <Input.Password placeholder="请输入密码" />
        </Form.Item>
        <Form.Item
          label="所属角色"
          name="role"
          rules={[{ required: true, message: '请选择所属角色' }]}
        >
          <Select
            showSearch
            loading={roleLoading}
            options={roleOptions}
            placeholder="请选择所属角色"
            optionFilterProp="label"
            notFoundContent={roleLoading ? <Spin size="small" /> : '暂无角色'}
            onOpenChange={onRoleOpen}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateModal;
