import {
  ConfigProvider,
  Form,
  Input,
  Modal,
  Select,
  Switch,
  Typography,
} from 'antd';
import { useEffect } from 'react';

import type { EditValues } from '../managerConfig';
import { ROLE_OPTIONS } from '../managerConfig';

interface EditModalProps {
  open: boolean;
  saving: boolean;
  record?: {
    username: string;
    adminname: string;
  };
  values: EditValues;
  onCancel: () => void;
  onSubmit: (values: EditValues) => void;
}

const cardStyle = {
  padding: 20,
  border: '1px solid #f0f0f0',
  borderRadius: 12,
  background: '#fafafa',
};

const switchTheme = {
  components: {
    Switch: {
      handleSize: 22,
      trackHeight: 30,
      innerMaxMargin: 30,
      innerMinMargin: 12,
      trackMinWidth: 68,
      trackPadding: 4,
    },
  },
} as const;

const EditModal = ({
  open,
  saving,
  record,
  values,
  onCancel,
  onSubmit,
}: EditModalProps) => {
  const [form] = Form.useForm<EditValues>();
  const status = Form.useWatch('status', form);
  const statusFlag = status ?? values.status;
  const nextStatus = statusFlag ? '启用' : '禁用';

  useEffect(() => {
    if (!open) {
      return;
    }

    form.setFieldsValue(values);
  }, [form, open, values]);

  return (
    <Modal
      title="编辑管理员"
      open={open}
      destroyOnHidden
      confirmLoading={saving}
      onCancel={onCancel}
      onOk={() => {
        void form.validateFields().then((currentValues) => {
          onSubmit(currentValues);
        });
      }}
    >
      <ConfigProvider theme={switchTheme}>
        <Form<EditValues> form={form} layout="vertical" initialValues={values}>
          <Form.Item
            label="登录账号"
            name="username"
            rules={[{ required: true, message: '请输入登录账号' }]}
          >
            <Input maxLength={30} placeholder="请输入登录账号" />
          </Form.Item>
          <Form.Item
            label="真实姓名"
            name="adminname"
            rules={[{ required: true, message: '请输入管理员真实姓名' }]}
          >
            <Input maxLength={20} placeholder="请输入管理员真实姓名" />
          </Form.Item>
          <Form.Item
            label="所属角色"
            name="role"
            rules={[{ required: true, message: '请选择所属角色' }]}
          >
            <Select options={ROLE_OPTIONS} placeholder="请选择所属角色" />
          </Form.Item>
          <Form.Item label="账号状态">
            <div style={cardStyle}>
              <Form.Item<EditValues>
                name="status"
                valuePropName="checked"
                noStyle
              >
                <Switch checkedChildren="启用" unCheckedChildren="禁用" />
              </Form.Item>
              <Typography.Paragraph
                type="secondary"
                style={{ marginTop: 16, marginBottom: 0 }}
              >
                {`当前开关${
                  statusFlag ? '已开启' : '已关闭'
                }，保存后账号状态为${nextStatus}。`}
              </Typography.Paragraph>
            </div>
          </Form.Item>
          {record ? (
            <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
              {`正在编辑管理员 ${record.username}（${record.adminname}）`}
            </Typography.Paragraph>
          ) : null}
        </Form>
      </ConfigProvider>
    </Modal>
  );
};

export default EditModal;
