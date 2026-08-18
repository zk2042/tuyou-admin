import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Divider,
  Form,
  Input,
  Modal,
  Radio,
  Space,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';

import { message } from '@/utils/message';
import MemberSelectModal, { type SelectedMember } from './MemberSelectModal';

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

  //+ 已选会员（带完整展示信息）
  const [selectedMembers, setSelectedMembers] = useState<SelectedMember[]>([]);
  //+ 选择弹窗开关
  const [selectOpen, setSelectOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    form.resetFields();
    form.setFieldsValue({
      content: '',
      receive_type: 0,
    } as Partial<SendVals>);
    setSelectedMembers([]);
  }, [form, open]);

  const handleSubmit = () => {
    void form.validateFields().then((vals) => {
      const result: SendVals = {
        content: vals.content.trim(),
        receive_type: vals.receive_type,
      };

      if (vals.receive_type === 1) {
        //+ 指定会员时，校验至少选一个
        if (selectedMembers.length === 0) {
          message.warning('请至少选择一个会员');
          return;
        }
        result.member_ids = selectedMembers.map((item) => Number(item.id));
      }

      onSubmit(result);
    });
  };

  //+ 从已选列表移除单个会员
  const removeMember = (id: string) => {
    setSelectedMembers(selectedMembers.filter((item) => item.id !== id));
  };

  //+ 确认选择弹窗回传
  const handleSelectConfirm = (list: SelectedMember[]) => {
    setSelectedMembers(list);
    setSelectOpen(false);
  };

  return (
    <>
      <Modal
        title="发送系统消息"
        open={open}
        destroyOnHidden
        confirmLoading={saving}
        width={640}
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
            <Form.Item label="指定会员" required>
              <div style={cardStyle}>
                <Space style={{ marginBottom: 12 }}>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                      setSelectOpen(true);
                    }}
                  >
                    选择会员
                  </Button>
                  <Typography.Text type="secondary">
                    支持按 ID、昵称、手机号搜索，可多选
                  </Typography.Text>
                </Space>
                <Space size={[6, 8]} wrap>
                  {selectedMembers.length === 0 ? (
                    <Typography.Text type="secondary">
                      暂未选择任何会员，点击上方按钮添加
                    </Typography.Text>
                  ) : (
                    selectedMembers.map((item) => (
                      <Tag
                        key={item.id}
                        closable
                        color="blue"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          paddingInline: 4,
                          height: 'auto',
                          lineHeight: '24px',
                        }}
                        onClose={() => {
                          removeMember(item.id);
                        }}
                      >
                        <Space size={4}>
                          <Avatar
                            size={20}
                            src={item.avatar}
                            icon={<UserOutlined />}
                          />
                          <Tooltip title={item.phone}>
                            <span>{item.nickname}</span>
                          </Tooltip>
                          <Typography.Text
                            type="secondary"
                            style={{ fontSize: 12 }}
                          >
                            ID:{item.id}
                          </Typography.Text>
                        </Space>
                      </Tag>
                    ))
                  )}
                </Space>
                <Typography.Paragraph
                  type="secondary"
                  style={{ marginTop: 12, marginBottom: 0 }}
                >
                  {`已选择 ${selectedMembers.length} 个会员，将仅向这些会员发送消息。`}
                </Typography.Paragraph>
              </div>
            </Form.Item>
          )}
        </Form>
      </Modal>
      <MemberSelectModal
        open={selectOpen}
        value={selectedMembers}
        onCancel={() => {
          setSelectOpen(false);
        }}
        onConfirm={handleSelectConfirm}
      />
    </>
  );
};

export default SendModal;
