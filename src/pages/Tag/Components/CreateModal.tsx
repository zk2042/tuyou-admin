import { Divider, Form, Input, Modal, Select } from 'antd';
import { useEffect } from 'react';

export interface CreateVals {
  tag_name: string;
  status: string;
}

interface CreateProps {
  open: boolean;
  saving: boolean;
  onCancel: () => void;
  onSubmit: (vals: CreateVals) => void;
}

const statusOptions = [
  { label: '启用', value: '启用' },
  { label: '禁用', value: '禁用' },
];

const CreateModal = ({ open, saving, onCancel, onSubmit }: CreateProps) => {
  const [form] = Form.useForm<CreateVals>();

  useEffect(() => {
    if (!open) {
      return;
    }

    form.resetFields();
    form.setFieldsValue({
      tag_name: '',
      status: '启用',
    } as Partial<CreateVals>);
  }, [form, open]);

  return (
    <Modal
      title="新增标签"
      open={open}
      destroyOnHidden
      confirmLoading={saving}
      onCancel={onCancel}
      onOk={() => {
        void form.validateFields().then((vals) => {
          onSubmit(vals);
        });
      }}
    >
      <Divider style={{ margin: '0 0 24px' }} />
      <Form<CreateVals> form={form} layout="vertical">
        <Form.Item<CreateVals>
          label="标签名称"
          name="tag_name"
          rules={[
            { required: true, message: '请输入标签名称' },
            { max: 20, message: '标签名称不超过 20 个字符' },
          ]}
        >
          <Input placeholder="请输入标签名称" maxLength={20} showCount />
        </Form.Item>
        <Form.Item<CreateVals>
          label="状态"
          name="status"
          rules={[{ required: true, message: '请选择状态' }]}
        >
          <Select options={statusOptions} placeholder="请选择状态" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateModal;
