import {
  ConfigProvider,
  Divider,
  Form,
  Input,
  Modal,
  Spin,
  Switch,
  Typography,
} from 'antd';
import { useEffect } from 'react';
import { MEMBER_STATUS, type EditVals, type RoleText } from '../shared';

interface EditProps {
  entityLabel: string;
  roleText?: RoleText;
  record: {
    nickname: string;
    status?: string;
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
  entityLabel,
  roleText = '普通会员',
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
  const roleFlag = Form.useWatch('roleFlag', form);
  const statusFlag = status ?? values.status;
  const roleChecked = roleFlag ?? values.roleFlag;
  const nextStatus = statusFlag ? '正常' : '禁用';
  const nextRole = roleChecked ? '领队' : roleText;
  const isCancelled = record.status === MEMBER_STATUS.CANCELLED;

  useEffect(() => {
    if (!open) {
      return;
    }

    form.setFieldsValue(values);
  }, [form, open, values.roleFlag, values.status]);

  return (
    <Modal
      title={`编辑${entityLabel}信息`}
      open={open}
      destroyOnHidden
      confirmLoading={saving}
      onCancel={onCancel}
      onOk={() => {
        if (loading) {
          return;
        }

        void form.validateFields().then((values) => {
          onSubmit(values);
        });
      }}
    >
      <Divider style={{ margin: '0 0 24px' }} />
      <ConfigProvider theme={switchTheme}>
        <Spin spinning={loading}>
          <Form<EditVals> form={form} layout="vertical" initialValues={values}>
            <Form.Item label={`${entityLabel}昵称`}>
              <Input value={record.nickname} disabled />
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
                    unCheckedChildren="禁用"
                    disabled={loading || isCancelled}
                  />
                </Form.Item>
                <Typography.Paragraph
                  type={isCancelled ? 'warning' : 'secondary'}
                  style={{ marginTop: 16, marginBottom: 0 }}
                >
                  {isCancelled
                    ? `该${entityLabel}已注销，状态不可在此修改，请通过"恢复"操作还原。`
                    : `当前开关${
                        statusFlag ? '已开启' : '已关闭'
                      }，保存后状态为${nextStatus}。`}
                </Typography.Paragraph>
              </div>
            </Form.Item>

            <Form.Item label="角色设置">
              <div style={cardStyle}>
                <Form.Item<EditVals>
                  name="roleFlag"
                  valuePropName="checked"
                  noStyle
                >
                  <Switch
                    checkedChildren="领队"
                    unCheckedChildren={roleText}
                    disabled={loading}
                  />
                </Form.Item>
                <Typography.Paragraph
                  type="secondary"
                  style={{ marginTop: 16, marginBottom: 0 }}
                >
                  {`当前开关${
                    roleChecked ? '已开启' : '已关闭'
                  }，保存后角色将设为${nextRole}。`}
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
