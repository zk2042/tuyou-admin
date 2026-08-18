import { Divider, Form, Input, Modal } from 'antd';
import { useEffect } from 'react';

export interface CreateVals {
  word: string;
}

interface CreateProps {
  open: boolean;
  saving: boolean;
  onCancel: () => void;
  onSubmit: (vals: CreateVals) => void;
}

const CreateModal = ({ open, saving, onCancel, onSubmit }: CreateProps) => {
  const [form] = Form.useForm<CreateVals>();

  useEffect(() => {
    if (!open) {
      return;
    }

    form.resetFields();
    form.setFieldsValue({
      word: '',
    } as Partial<CreateVals>);
  }, [form, open]);

  return (
    <Modal
      title="新增敏感词"
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
          label="敏感词"
          name="word"
          rules={[
            { required: true, message: '请输入敏感词' },
            {
              max: 50,
              message: '敏感词不超过 50 个字符',
            },
          ]}
        >
          <Input
            placeholder="请输入敏感词（支持中文、英文、数字、特殊符号）"
            maxLength={50}
            showCount
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateModal;
