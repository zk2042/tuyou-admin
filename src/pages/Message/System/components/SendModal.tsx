import {
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Space,
  Tag,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';

export interface SendVals {
  content: string;
  receive_type: number;
  member_ids?: number[];
}

interface SendModalProps {
  open: boolean;
  saving: boolean;
  onCancel: () => void;
  onSubmit: (vals: SendVals) => void;
}

const cardStyle = {
  padding: 16,
  border: '1px solid #f0f0f0',
  borderRadius: 12,
  background: '#fafafa',
};

const SendModal = ({ open, saving, onCancel, onSubmit }: SendModalProps) => {
  const [form] = Form.useForm<SendVals>();
  const receiveType = Form.useWatch('receive_type', form);
  const [memberIds, setMemberIds] = useState<number[]>([]);

  useEffect(() => {
    if (!open) {
      return;
    }

    form.resetFields();
    form.setFieldsValue({
      content: '',
      receive_type: 0,
    } as Partial<SendVals>);
    setMemberIds([]);
  }, [form, open]);

  const handleSubmit = () => {
    void form.validateFields().then((vals) => {
      const result: SendVals = {
        content: vals.content.trim(),
        receive_type: vals.receive_type,
      };

      if (vals.receive_type === 1) {
        result.member_ids = memberIds;
      }

      onSubmit(result);
    });
  };

  return (
    <Modal
      title="发送系统消息"
      open={open}
      destroyOnHidden
      confirmLoading={saving}
      width={560}
      onCancel={onCancel}
      onOk={handleSubmit}
    >
      <Divider style={{ margin: '0 0 24px' }} />
      <Form<SendVals> form={form} layout="vertical">
        <Form.Item<SendVals>
          label="消息正文"
          name="content"
          rules={[
            { required: true, message: '请输入消息正文' },
            { max: 200, message: '消息正文不超过 200 个字符' },
          ]}
        >
          <Input.TextArea
            rows={4}
            placeholder="请输入消息正文"
            maxLength={200}
            showCount
          />
        </Form.Item>
        <Form.Item<SendVals>
          label="接收对象"
          name="receive_type"
          rules={[{ required: true, message: '请选择接收对象' }]}
        >
          <Radio.Group>
            <Space direction="vertical">
              <Radio value={0}>全体会员</Radio>
              <Radio value={1}>指定会员</Radio>
            </Space>
          </Radio.Group>
        </Form.Item>
        {receiveType === 1 && (
          <Form.Item label="会员 ID" required>
            <div style={cardStyle}>
              <InputNumber
                style={{ width: '100%' }}
                placeholder="输入会员 ID 后回车添加"
                min={1}
                precision={0}
                onPressEnter={(e) => {
                  const value = Number((e.target as HTMLInputElement).value);
                  if (
                    !Number.isNaN(value) &&
                    value > 0 &&
                    !memberIds.includes(value)
                  ) {
                    setMemberIds([...memberIds, value]);
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
              />
              <Space size={[4, 4]} wrap style={{ marginTop: 12 }}>
                {memberIds.length === 0 ? (
                  <Typography.Text type="secondary">
                    暂未添加任何会员 ID
                  </Typography.Text>
                ) : (
                  memberIds.map((id) => (
                    <Tag
                      key={id}
                      closable
                      color="blue"
                      onClose={() => {
                        setMemberIds(memberIds.filter((item) => item !== id));
                      }}
                    >
                      {id}
                    </Tag>
                  ))
                )}
              </Space>
              <Typography.Paragraph
                type="secondary"
                style={{ marginTop: 12, marginBottom: 0 }}
              >
                {`已选择 ${memberIds.length} 个会员，将仅向这些会员发送消息。`}
              </Typography.Paragraph>
            </div>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default SendModal;
