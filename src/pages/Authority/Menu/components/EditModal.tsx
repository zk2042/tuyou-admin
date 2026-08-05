import { Form, Modal } from 'antd';
import { useEffect } from 'react';

import type { MenuRecord, MenuValues } from '../menuConfig';
import MenuForm from './MenuForm';

interface EditModalProps {
  open: boolean;
  saving: boolean;
  record?: MenuRecord;
  onCancel: () => void;
  onSubmit: (values: MenuValues) => void;
}

const EditModal = ({
  open,
  saving,
  record,
  onCancel,
  onSubmit,
}: EditModalProps) => {
  const [form] = Form.useForm<MenuValues>();

  useEffect(() => {
    if (!open || !record) {
      return;
    }

    form.setFieldsValue({
      menu_name: record.menu_name,
      parent_name: record.parent_name,
      menu_type: record.menu_type,
      route_path: record.route_path,
      sort: record.sort,
      status: record.status,
    });
  }, [form, open, record]);

  return (
    <Modal
      title="编辑菜单"
      open={open}
      confirmLoading={saving}
      onCancel={onCancel}
      afterOpenChange={(visible) => {
        if (!visible) {
          form.resetFields();
        }
      }}
      onOk={() => {
        void form.validateFields().then((values) => {
          onSubmit({
            ...values,
            parent_name:
              values.menu_type === '目录'
                ? null
                : values.parent_name?.trim() || null,
          });
        });
      }}
    >
      <MenuForm form={form} />
    </Modal>
  );
};

export default EditModal;
