import type { PwdBody } from '@/services/auth';
import { Form, Input, Modal } from 'antd';

type PwdForm = PwdBody & {
  confirm_password: string;
};

interface PwdModalProps {
  open: boolean;
  saving: boolean;
  onCancel: () => void;
  onSubmit: (values: PwdBody) => void;
}

const ChangePasswordModal = ({
  open,
  saving,
  onCancel,
  onSubmit,
}: PwdModalProps) => {
  const [form] = Form.useForm<PwdForm>();

  return (
    <Modal
      title="修改密码"
      open={open}
      confirmLoading={saving}
      onCancel={onCancel}
      afterOpenChange={(nextOpen) => {
        if (!nextOpen) {
          form.resetFields();
        }
      }}
      onOk={() => {
        void form.validateFields().then((values) => {
          onSubmit({
            old_password: values.old_password,
            new_password: values.new_password,
          });
        });
      }}
    >
      <Form<PwdForm> form={form} layout="vertical">
        <Form.Item
          name="old_password"
          label="原密码"
          rules={[{ required: true, message: '请输入原密码' }]}
        >
          <Input.Password placeholder="请输入原密码" />
        </Form.Item>

        <Form.Item
          name="new_password"
          label="新密码"
          rules={[
            { required: true, message: '请输入新密码' },
            { min: 6, message: '密码长度不能少于 6 位' },
          ]}
        >
          <Input.Password placeholder="请输入新密码" />
        </Form.Item>

        <Form.Item
          name="confirm_password"
          label="确认新密码"
          dependencies={['new_password']}
          rules={[
            { required: true, message: '请再次输入新密码' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('new_password') === value) {
                  return Promise.resolve();
                }

                return Promise.reject(new Error('两次输入的新密码不一致'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="请再次输入新密码" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChangePasswordModal;
