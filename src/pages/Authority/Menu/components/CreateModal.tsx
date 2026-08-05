import { Form, Modal } from 'antd';

import type { MenuValues } from '../menuConfig';
import MenuForm from './MenuForm';

interface CreateModalProps {
  open: boolean;
  saving: boolean;
  onCancel: () => void;
  onSubmit: (values: MenuValues) => void;
}

const CreateModal = ({
  open,
  saving,
  onCancel,
  onSubmit,
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
            sort: 1,
            status: true,
          });
        } else {
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

export default CreateModal;
