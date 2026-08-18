import { Form, Modal } from 'antd';
import { useEffect } from 'react';

import type { PermValues } from '../permissionsConfig';
import PermForm from './PermForm';

interface CreateModalProps {
  open: boolean;
  saving: boolean;
  onCancel: () => void;
  onSubmit: (values: PermValues) => void;
  moduleOptions: { label: string; value: string }[];
  moduleLoading: boolean;
  onModuleOpen?: () => void;
}

const CreateModal = ({
  open,
  saving,
  onCancel,
  onSubmit,
  moduleOptions,
  moduleLoading,
  onModuleOpen,
}: CreateModalProps) => {
  const [form] = Form.useForm<PermValues>();

  useEffect(() => {
    if (open) {
      form.setFieldsValue({ status: '启用', request_method: 'GET' });
    }
  }, [form, open]);

  return (
    <Modal
      title="新增 API 权限"
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
      <PermForm
        form={form}
        moduleOptions={moduleOptions}
        moduleLoading={moduleLoading}
        onModuleOpen={onModuleOpen}
      />
    </Modal>
  );
};

export default CreateModal;
