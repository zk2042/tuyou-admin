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
  is_slide: boolean;
}

interface EditProps {
  record: {
    title: string;
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
  const slide = Form.useWatch('is_slide', form);
  const nextSlide = slide ?? values.is_slide ? '是' : '否';

  useEffect(() => {
    if (!open) {
      return;
    }

    form.setFieldsValue(values);
  }, [form, open, values]);

  return (
    <Modal
      title="编辑攻略信息"
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
            <Form.Item label="攻略标题">
              <Typography.Text>{record.title}</Typography.Text>
            </Form.Item>
            <Form.Item label="幻灯片设置">
              <div style={cardStyle}>
                <Form.Item<EditVals>
                  name="is_slide"
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
                  {`当前开关${
                    nextSlide === '是' ? '已开启' : '已关闭'
                  }，保存后将设为${nextSlide}。`}
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
