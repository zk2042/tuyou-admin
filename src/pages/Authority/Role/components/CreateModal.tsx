import { Form, Input, Modal } from 'antd';

import type { CreateValues } from '../roleConfig';

interface CreateModalProps {
  open: boolean;
  saving: boolean;
  onCancel: () => void;
  onSubmit: (values: CreateValues) => void;
}

const CreateModal = ({
  open,
  saving,
  onCancel,
  onSubmit,
}: CreateModalProps) => {
  const [form] = Form.useForm<CreateValues>();

  return (
    <Modal
      title="新增角色"
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
      <Form<CreateValues> form={form} layout="vertical">
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
      </Form>
    </Modal>
  );
};

export default CreateModal;
