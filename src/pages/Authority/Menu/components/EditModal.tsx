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
  parentOptions: { label: string; value: string }[];
  parentLoading: boolean;
  onParentOpen?: () => void;
}

const EditModal = ({
  open,
  saving,
  record,
  onCancel,
  onSubmit,
  parentOptions,
  parentLoading,
  onParentOpen,
}: EditModalProps) => {
  const [form] = Form.useForm<MenuValues>();

  useEffect(() => {
    if (!open || !record) {
      return;
    }

    form.setFieldsValue({
      menu_name: record.menu_name,
      parent_name: record.parent_name || null,
      menu_type: record.menu_type_name,
      route_path: record.route_path,
      component: record.component,
      icon: record.icon,
      hide_in_menu: record.hide_in_menu === 1,
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
            menu_name: values.menu_name.trim(),
            parent_name: values.parent_name?.trim() || null,
            route_path: values.route_path.trim(),
            component: values.component.trim(),
            icon: values.icon.trim(),
          });
        });
      }}
    >
      <MenuForm
        form={form}
        parentOptions={parentOptions}
        parentLoading={parentLoading}
        onParentOpen={onParentOpen}
      />
    </Modal>
  );
};

export default EditModal;
