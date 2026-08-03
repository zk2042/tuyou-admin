import type { ManagerResetPassword } from '@/services/authority/manager/types';
import { Form, Input, Modal, Typography } from 'antd';
import { useEffect } from 'react';

interface ResetPasswordModalProps {
  open: boolean;
  saving: boolean;
  username?: string;
  onCancel: () => void;
  onSubmit: (values: ManagerResetPassword) => void;
}

const DEFAULT_VALUES: ManagerResetPassword = {
  new_password: '',
};

const ResetPasswordModal = ({
  open,
  saving,
  username,
  onCancel,
  onSubmit,
}: ResetPasswordModalProps) => {
  const [form] = Form.useForm<ManagerResetPassword>();

  useEffect(() => {
    if (!open) {
      return;
    }

    form.resetFields();
    form.setFieldsValue(DEFAULT_VALUES);
  }, [form, open]);

  return (
    <Modal
      title="重置管理员密码"
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
      {username ? (
        <Typography.Paragraph type="secondary">
          {`正在为管理员 ${username} 重置登录密码。`}
        </Typography.Paragraph>
      ) : null}
      <Form<ManagerResetPassword>
        form={form}
        layout="vertical"
        initialValues={DEFAULT_VALUES}
      >
        <Form.Item
          label="新密码"
          name="new_password"
          rules={[{ required: true, message: '请输入新密码' }]}
        >
          <Input.Password maxLength={30} placeholder="请输入新密码" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ResetPasswordModal;
