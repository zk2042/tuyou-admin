import {
  ConfigProvider,
  Divider,
  Form,
  Modal,
  Spin,
  Switch,
  Typography,
} from 'antd';
import { useEffect } from 'react';

export interface EditVals {
  status: boolean;
  is_hot: boolean;
}

interface EditProps {
  record: {
    tag_name: string;
  };
  values: EditVals;
  open: boolean;
  loading?: boolean;
  saving: boolean;
  onCancel: () => void;
  onSubmit: (data: EditVals) => void;
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
  record,
  values,
  open,
  loading = false,
  saving,
  onCancel,
  onSubmit,
}: EditProps) => {
  const [form] = Form.useForm<EditVals>();
  const status = Form.useWatch('status', form);
  const isHot = Form.useWatch('is_hot', form);
  const nextStatus = status ?? values.status ? '启用' : '禁用';
  const nextHot = isHot ?? values.is_hot ? '是' : '否';

  useEffect(() => {
    if (!open) {
      return;
    }

    form.setFieldsValue(values);
  }, [form, open, values]);

  return (
    <Modal
      title="编辑标签"
      open={open}
      destroyOnHidden
      confirmLoading={saving}
      onCancel={onCancel}
      onOk={() => {
        if (loading) {
          return;
        }

        void form.validateFields().then((current) => {
          onSubmit(current);
        });
      }}
    >
      <Divider style={{ margin: '0 0 24px' }} />
      <ConfigProvider theme={switchTheme}>
        <Spin spinning={loading}>
          <Form<EditVals> form={form} layout="vertical" initialValues={values}>
            <Form.Item label="标签名称">
              <Typography.Text>{record.tag_name}</Typography.Text>
            </Form.Item>
            <Form.Item label="状态设置">
              <div style={cardStyle}>
                <Form.Item<EditVals>
                  name="status"
                  valuePropName="checked"
                  noStyle
                >
                  <Switch
                    checkedChildren="启用"
                    unCheckedChildren="禁用"
                    disabled={loading}
                  />
                </Form.Item>
                <Typography.Paragraph
                  type="secondary"
                  style={{ marginTop: 16, marginBottom: 0 }}
                >
                  {`保存后状态将设为${nextStatus}。`}
                </Typography.Paragraph>
              </div>
            </Form.Item>
            <Form.Item label="热门设置">
              <div style={cardStyle}>
                <Form.Item<EditVals>
                  name="is_hot"
                  valuePropName="checked"
                  noStyle
                >
                  <Switch
                    checkedChildren="是"
                    unCheckedChildren="否"
                    disabled={loading}
                  />
                </Form.Item>
                <Typography.Paragraph
                  type="secondary"
                  style={{ marginTop: 16, marginBottom: 0 }}
                >
                  {`保存后是否热门将设为${nextHot}。`}
                </Typography.Paragraph>
              </div>
            </Form.Item>
          </Form>
        </Spin>
      </ConfigProvider>
    </Modal>
  );
};

export default EditModal;
