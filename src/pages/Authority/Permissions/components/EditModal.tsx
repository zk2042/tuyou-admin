import { Form, Modal } from 'antd';
import { useEffect } from 'react';

import type { PermRecord, PermValues } from '../permissionsConfig';
import PermForm from './PermForm';

interface EditModalProps {
  open: boolean;
  saving: boolean;
  record?: PermRecord;
  onCancel: () => void;
  onSubmit: (values: PermValues) => void;
  moduleOptions: { label: string; value: string }[];
  moduleLoading: boolean;
  onModuleOpen?: () => void;
}

const EditModal = ({
  open,
  saving,
  record,
  onCancel,
  onSubmit,
  moduleOptions,
  moduleLoading,
  onModuleOpen,
}: EditModalProps) => {
  const [form] = Form.useForm<PermValues>();

  useEffect(() => {
    if (!open || !record) {
      return;
    }

    form.setFieldsValue({
      perm_name: record.perm_name,
      module: record.module,
      perm_key: record.perm_key,
      request_method: record.request_method,
      api_path: record.api_path,
      status: record.status,
    });
  }, [form, open, record]);

  return (
    <Modal
      title="编辑 API 权限"
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

export default EditModal;
