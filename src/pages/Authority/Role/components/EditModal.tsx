import { Form, Input, Modal, Switch } from 'antd';
import { useEffect } from 'react';

import type { EditValues, RoleRecord } from '../roleConfig';

interface EditModalProps {
  open: boolean;
  saving: boolean;
  record?: RoleRecord;
  onCancel: () => void;
  onSubmit: (values: EditValues) => void;
}

const EditModal = ({
  open,
  saving,
  record,
  onCancel,
  onSubmit,
}: EditModalProps) => {
  const [form] = Form.useForm<EditValues>();

  useEffect(() => {
    if (!open || !record) {
      return;
    }

    form.setFieldsValue({
      role_name: record.role_name,
      role_code: record.role_code,
      description: record.description,
      status: record.status,
    });
  }, [form, open, record]);

  return (
    <Modal
      title="编辑角色"
      open={open}
      confirmLoading={saving}
      onCancel={onCancel}
      afterOpenChange={(visible) => {
        if (!visible) {
          form.resetFields();
        }
      }}
      onOk={() => {
        void form.validateFields().then(onSubmit);
      }}
    >
      <Form<EditValues> form={form} layout="vertical">
        <Form.Item
          label="角色名称"
          name="role_name"
          rules={[{ required: true, message: '请输入角色名称' }]}
        >
          <Input maxLength={30} placeholder="请输入角色名称" />
        </Form.Item>
        <Form.Item
          label="角色标识"
          name="role_code"
          rules={[{ required: true, message: '请输入角色标识' }]}
        >
          <Input maxLength={50} placeholder="请输入角色标识" />
        </Form.Item>
        <Form.Item
          label="描述"
          name="description"
          rules={[{ required: true, message: '请输入角色描述' }]}
        >
          <Input.TextArea
            maxLength={200}
            rows={4}
            showCount
            placeholder="请输入角色描述"
          />
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
    </Modal>
  );
};

export default EditModal;
