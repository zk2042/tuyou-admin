import {
  ConfigProvider,
  Divider,
  Form,
  Modal,
  Select,
  Spin,
  Switch,
  Typography,
} from 'antd';
import { useEffect } from 'react';

export interface EditVals {
  category: string;
  is_slide: boolean;
  status: boolean;
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
  const status = Form.useWatch('status', form);
  const nextSlide = slide ?? values.is_slide ? '是' : '否';
  const nextStatus = status ?? values.status ? '正常' : '下架';

  useEffect(() => {
    if (!open) {
      return;
    }

    form.setFieldsValue(values);
  }, [form, open, values]);

  return (
    <Modal
      title="编辑笔记信息"
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
            <Form.Item label="笔记标题">
              <Typography.Text>{record.title}</Typography.Text>
            </Form.Item>
            <Form.Item<EditVals>
              label="分类"
              name="category"
              rules={[{ required: true, message: '请选择分类' }]}
            >
              <Select
                placeholder="请选择分类"
                disabled={loading}
                options={[
                  '徒步',
                  '露营',
                  '骑行',
                  '登山',
                  '跑步',
                  '攀岩',
                  '溯溪',
                ].map((value) => ({ label: value, value }))}
              />
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
            <Form.Item label="状态设置">
              <div style={cardStyle}>
                <Form.Item<EditVals>
                  name="status"
                  valuePropName="checked"
                  noStyle
                >
                  <Switch
                    checkedChildren="正常"
                    unCheckedChildren="下架"
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
          </Form>
        </Spin>
      </ConfigProvider>
    </Modal>
  );
};

export default EditModal;
