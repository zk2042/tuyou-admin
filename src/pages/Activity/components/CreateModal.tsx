import ImageUpload from '@/components/ImageUpload';
import type { LeaderItem } from '@/services/activity/types';
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Drawer,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
} from 'antd';
import type { Dayjs } from 'dayjs';
import { useEffect } from 'react';

const typeOpts = [
  { label: '徒步', value: '徒步' },
  { label: '露营', value: '露营' },
  { label: '骑行', value: '骑行' },
  { label: '登山', value: '登山' },
  { label: '跑步', value: '跑步' },
  { label: '攀岩', value: '攀岩' },
  { label: '溯溪', value: '溯溪' },
];

const diffOpts = [
  { label: '入门', value: '入门' },
  { label: '中等', value: '中等' },
  { label: '中高等', value: '中高等' },
  { label: '高等', value: '高等' },
];

export interface CreateVals {
  title: string;
  leader_name: string;
  cover_img: string;
  activity_type: string;
  address: string;
  start_time: Dayjs;
  end_time: Dayjs;
  max_people: number;
  price: number;
  difficulty: string;
  activity_content: string;
}

interface CreateProps {
  open: boolean;
  saving: boolean;
  leaderLoading: boolean;
  leaderList: LeaderItem[];
  onCancel: () => void;
  onSubmit: (vals: CreateVals) => void;
  uploadRequest?: (file: File) => Promise<string>;
  uploadDisabled?: boolean;
}

const CreateModal = ({
  open,
  saving,
  leaderLoading,
  leaderList,
  onCancel,
  onSubmit,
  uploadRequest,
  uploadDisabled = false,
}: CreateProps) => {
  const [form] = Form.useForm<CreateVals>();

  useEffect(() => {
    if (!open) {
      return;
    }

    form.resetFields();
    form.setFieldsValue({
      activity_type: '徒步',
      difficulty: '入门',
    } as Partial<CreateVals>);
  }, [form, open]);

  return (
    <Drawer
      title="创建活动"
      open={open}
      closable
      destroyOnHidden
      onClose={onCancel}
      width={720}
      footer={
        <Space>
          <Button onClick={onCancel}>取消</Button>
          <Button
            type="primary"
            loading={saving}
            onClick={() => {
              void form.validateFields().then((vals) => {
                onSubmit(vals);
              });
            }}
          >
            创建活动
          </Button>
        </Space>
      }
    >
      <Divider style={{ margin: '0 0 24px' }} />
      <Form<CreateVals> form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="活动标题"
              name="title"
              rules={[{ required: true, message: '请输入活动标题' }]}
            >
              <Input placeholder="请输入活动标题" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="领队名字"
              name="leader_name"
              rules={[{ required: true, message: '请选择领队名字' }]}
            >
              <Select
                showSearch
                loading={leaderLoading}
                options={leaderList.map((item) => ({
                  label: item.leader_name,
                  value: item.leader_name,
                }))}
                placeholder="请选择领队名字"
                optionFilterProp="label"
                notFoundContent={leaderLoading ? '加载中' : '暂无领队'}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="活动封面"
              name="cover_img"
              rules={[{ required: true, message: '请上传活动封面' }]}
            >
              <ImageUpload
                uploadRequest={uploadRequest}
                disabled={uploadDisabled}
                tip={
                  uploadDisabled
                    ? '暂无图片上传权限'
                    : '支持上传图片作为活动封面'
                }
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="活动类型"
              name="activity_type"
              rules={[{ required: true, message: '请选择活动类型' }]}
            >
              <Select options={typeOpts} placeholder="请选择活动类型" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="活动地址"
              name="address"
              rules={[{ required: true, message: '请输入活动地址' }]}
            >
              <Input placeholder="请输入活动举办地点" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="人数上限"
              name="max_people"
              rules={[{ required: true, message: '请输入人数上限' }]}
            >
              <InputNumber
                min={1}
                precision={0}
                placeholder="请输入人数上限"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="开始时间"
              name="start_time"
              rules={[{ required: true, message: '请选择开始时间' }]}
            >
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm"
                placeholder="请选择开始时间"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="结束时间"
              name="end_time"
              dependencies={['start_time']}
              rules={[
                { required: true, message: '请选择结束时间' },
                ({ getFieldValue }) => ({
                  validator(_, value?: Dayjs) {
                    const start = getFieldValue('start_time') as
                      | Dayjs
                      | undefined;

                    if (!value || !start || value.isAfter(start)) {
                      return Promise.resolve();
                    }

                    return Promise.reject(new Error('结束时间需晚于开始时间'));
                  },
                }),
              ]}
            >
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm"
                placeholder="请选择结束时间"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="费用"
              name="price"
              rules={[{ required: true, message: '请输入费用' }]}
            >
              <InputNumber
                min={0}
                precision={2}
                placeholder="请输入活动费用，免费请填 0"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="难度"
              name="difficulty"
              rules={[{ required: true, message: '请选择难度' }]}
            >
              <Select options={diffOpts} placeholder="请选择难度" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="活动介绍"
              name="activity_content"
              rules={[{ required: true, message: '请输入活动介绍' }]}
            >
              <Input.TextArea rows={6} placeholder="请输入活动详情正文" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

export default CreateModal;
