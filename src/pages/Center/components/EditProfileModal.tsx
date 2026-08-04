import type { NameBody } from '@/services/center';
import { Form, Input, Modal } from 'antd';
import { useEffect } from 'react';

interface EditModalProps {
  open: boolean;
  saving: boolean;
  values: NameBody;
  onCancel: () => void;
  onSubmit: (values: NameBody) => void;
}

const EditProfileModal = ({
  open,
  saving,
  values,
  onCancel,
  onSubmit,
}: EditModalProps) => {
  const [form] = Form.useForm<NameBody>();

  useEffect(() => {
    if (!open) {
      return;
    }

    form.setFieldsValue(values);
  }, [form, open, values]);

  return (
    <Modal
      title="编辑用户账号"
      open={open}
      confirmLoading={saving}
      onCancel={onCancel}
      afterOpenChange={(nextOpen) => {
        if (nextOpen) {
          form.setFieldsValue(values);
          return;
        }

        form.resetFields();
      }}
      onOk={() => {
        void form.validateFields().then((formValues) => {
          onSubmit({
            username: formValues.username.trim(),
          });
        });
      }}
    >
      <Form<NameBody> form={form} layout="vertical" initialValues={values}>
        <Form.Item
          name="username"
          label="用户账号"
          rules={[
            { required: true, message: '请输入用户账号' },
            { whitespace: true, message: '请输入用户账号' },
          ]}
        >
          <Input maxLength={20} placeholder="请输入用户账号" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditProfileModal;
