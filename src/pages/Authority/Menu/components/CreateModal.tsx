import { Form, Modal } from 'antd';

import type { MenuValues } from '../menuConfig';
import MenuForm from './MenuForm';

interface CreateModalProps {
  open: boolean;
  saving: boolean;
  onCancel: () => void;
  onSubmit: (values: MenuValues) => void;
  parentOptions: { label: string; value: string }[];
  parentLoading: boolean;
  onParentOpen: () => void;
}

const CreateModal = ({
  open,
  saving,
  onCancel,
  onSubmit,
  parentOptions,
  parentLoading,
  onParentOpen,
}: CreateModalProps) => {
  const [form] = Form.useForm<MenuValues>();

  return (
    <Modal
      title="新增菜单"
      open={open}
      confirmLoading={saving}
      onCancel={onCancel}
      afterOpenChange={(visible) => {
        if (visible) {
          form.setFieldsValue({
            parent_name: null,
            menu_type: '菜单',
            component: '',
            icon: '',
            hide_in_menu: false,
            sort: 1,
            status: '启用',
          });
        } else {
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

export default CreateModal;
