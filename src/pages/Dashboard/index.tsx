import Forbidden from '@/pages/Exception/403';
import { queryActivity } from '@/services/activity';
import type { ActivityItem } from '@/services/activity/types';
import { querySystemMessage } from '@/services/message/system';
import type { MessageItem } from '@/services/message/system/types';
import type { WorkbenchData } from '@/services/workbench';
import { getWorkbench } from '@/services/workbench';
import { message } from '@/utils/message';
import { hasMenuPath } from '@/utils/route';
import {
  ArrowRightOutlined,
  BellOutlined,
  CalendarOutlined,
  CommentOutlined,
  FileTextOutlined,
  ReadOutlined,
  SafetyCertificateOutlined,
  TagOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Column } from '@ant-design/plots';
import { PageContainer } from '@ant-design/pro-components';
import { history, useAccess, useModel } from '@umijs/max';
import {
  Avatar,
  Button,
  Card,
  Col,
  Empty,
  List,
  Row,
  Skeleton,
  Statistic,
  Tag,
  Timeline,
  Typography,
} from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './index.less';

const shortcuts = [
  {
    title: '活动管理',
    desc: '查看和管理旅行活动',
    icon: <CalendarOutlined />,
    path: '/activity',
    perm: 'activity:list',
  },
  {
    title: '会员管理',
    desc: '查看和管理平台会员',
    icon: <TeamOutlined />,
    path: '/user/member',
    perm: 'member:list',
  },
  {
    title: '笔记管理',
    desc: '审核最新发布的内容',
    icon: <FileTextOutlined />,
    path: '/content/note',
    perm: 'note:list',
  },
  {
    title: '评论管理',
    desc: '处理用户互动与评论',
    icon: <CommentOutlined />,
    path: '/comment',
    perm: 'comment:list',
  },
  {
    title: '标签管理',
    desc: '管理活动标签',
    icon: <TagOutlined />,
    path: '/tag',
    perm: 'tag:list',
  },
  {
    title: '互动管理',
    desc: '管理用户互动记录',
    icon: <BellOutlined />,
    path: '/message/interact',
    perm: 'message:interact:list',
  },
  {
    title: '权限管理',
    desc: '管理后台角色与权限',
    icon: <SafetyCertificateOutlined />,
    path: '/authority/role',
    perm: 'role:list',
  },
];

const statItems = (data?: WorkbenchData) => [
  {
    title: '会员总数',
    value: data?.member_total ?? 0,
    icon: <TeamOutlined />,
    color: '#2e7d32',
  },
  {
    title: '活动总数',
    value: data?.activity_total ?? 0,
    icon: <CalendarOutlined />,
    color: '#1677ff',
  },
  {
    title: '发布总数',
    value: data?.publish_total ?? 0,
    icon: <ReadOutlined />,
    color: '#d48806',
  },
  {
    title: '评论总数',
    value: data?.comment_total ?? 0,
    icon: <CommentOutlined />,
    color: '#c41d7f',
  },
];

const formatDate = (value: string) => {
  const date = new Date(value.replace(/-/g, '/'));
  return Number.isNaN(date.getTime())
    ? value
    : `${date.getMonth() + 1}月${date.getDate()}日`;
};

const trendConfig = {
  xField: 'date',
  yField: 'count',
  paddingBottom: 8,
  paddingLeft: 18,
  style: {
    fill: '#8ed1a6',
    maxWidth: 26,
    radiusTopLeft: 4,
    radiusTopRight: 4,
  },
  label: {
    text: 'count',
    position: 'top',
    offset: 10,
    style: {
      fill: 'rgba(0, 0, 0, 0.65)',
      fontSize: 12,
    },
  },
  axis: {
    x: {
      title: false,
      line: true,
      tick: true,
      labelAutoRotate: false,
    },
    y: {
      title: '人',
      line: true,
      tick: true,
      label: true,
      grid: true,
      gridStroke: '#e8f3ea',
      gridLineDash: [3, 3],
    },
  },
  tooltip: {
    title: (item: { date: string }) => item.date,
    items: [{ channel: 'y', name: '注册数' }],
  },
  legend: false,
  animate: { enter: { type: 'growInY', duration: 500 } },
} as const;

const noticeMeta = {
  系统: { color: 'green', tag: 'blue' },
  活动: { color: '#faad14', tag: 'orange' },
};

function LatestActivities({
  loading,
  list,
}: {
  loading: boolean;
  list: ActivityItem[];
}) {
  return (
    <Card
      title="最新发布活动"
      className={`${styles.panel} ${styles.activityPanel}`}
      extra={
        <Button type="link" onClick={() => history.push('/activity')}>
          查看全部 <ArrowRightOutlined />
        </Button>
      }
    >
      {loading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : (
        <List
          dataSource={list}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="暂无活动"
              />
            ),
          }}
          renderItem={(item) => (
            <List.Item
              className={styles.activityItem}
              onClick={() => history.push('/activity')}
            >
              <Avatar shape="square" size={48} src={item.cover_img} />
              <div className={styles.itemMain}>
                <Typography.Text strong ellipsis>
                  {item.title}
                </Typography.Text>
                <Typography.Text type="secondary">
                  {item.leader_name} · {formatDate(item.start_time)}出发
                </Typography.Text>
              </div>
              <Tag
                color={item.activity_status === '报名中' ? 'green' : 'default'}
              >
                {item.activity_status}
              </Tag>
            </List.Item>
          )}
        />
      )}
    </Card>
  );
}

function LatestNotices({
  loading,
  list,
}: {
  loading: boolean;
  list: MessageItem[];
}) {
  return (
    <Card title="最新动态" className={styles.panel}>
      {loading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : list.length ? (
        <Timeline
          className={styles.timeline}
          items={list.map((item) => {
            const meta = noticeMeta[
              item.msg_type as keyof typeof noticeMeta
            ] ?? {
              color: 'gray',
              tag: 'default',
            };

            return {
              key: item.id,
              color: meta.color,
              children: (
                <div className={styles.notice}>
                  <Tag color={meta.tag}>{item.msg_type}</Tag>
                  <Typography.Text className={styles.noticeText}>
                    {item.content}
                  </Typography.Text>
                  <Typography.Text
                    type="secondary"
                    className={styles.noticeTime}
                  >
                    {item.send_time}
                  </Typography.Text>
                </div>
              ),
            };
          })}
        />
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无动态" />
      )}
    </Card>
  );
}

const DashboardPage: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { hasPerm } = useAccess();
  const canView = hasPerm('workbench:view');
  const canViewActivities =
    hasPerm('activity:list') &&
    hasMenuPath('/activity', initialState?.menu_tree);
  const canViewMessages = hasPerm('message:system:list');
  const visibleShortcuts = useMemo(
    () =>
      shortcuts.filter(
        (item) =>
          hasPerm(item.perm) && hasMenuPath(item.path, initialState?.menu_tree),
      ),
    [hasPerm, initialState?.menu_tree],
  );
  const [data, setData] = useState<WorkbenchData>();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [notices, setNotices] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actLoading, setActLoading] = useState(false);
  const [noticeLoading, setNoticeLoading] = useState(false);
  const [welcome, setWelcome] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getWorkbench();
      if (!response.data) {
        setData(undefined);
        if (response.message) {
          message.error(response.message);
        }
        return;
      }

      setData(response.data);
    } catch {
      setData(undefined);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadActivities = useCallback(async () => {
    setActLoading(true);
    try {
      const response = await queryActivity({ page: 1, size: 5 });
      setActivities(response.data?.list ?? []);
    } catch {
      setActivities([]);
    } finally {
      setActLoading(false);
    }
  }, []);

  const loadNotices = useCallback(async () => {
    setNoticeLoading(true);
    try {
      const response = await querySystemMessage({ page: 1, size: 4 });
      setNotices(response.data?.list ?? []);
    } catch {
      setNotices([]);
    } finally {
      setNoticeLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!canView) {
      return;
    }

    void loadData();
    if (canViewActivities) {
      void loadActivities();
    }
    if (canViewMessages) {
      void loadNotices();
    }
  }, [
    canView,
    canViewActivities,
    canViewMessages,
    loadActivities,
    loadData,
    loadNotices,
  ]);

  const name = initialState?.username || '旅行伙伴';
  const today = new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(new Date());

  useEffect(() => {
    if (!canView) {
      return;
    }

    const text = `欢迎回来，${name}！今天是${today}，愿你今天也能把每一次出发，变成值得记住的故事。`;
    let index = 0;
    setWelcome('');
    const timer = window.setInterval(() => {
      index += 1;
      setWelcome(text.slice(0, index));
      if (index >= text.length) {
        window.clearInterval(timer);
      }
    }, 35);

    return () => window.clearInterval(timer);
  }, [canView, name, today]);

  if (!canView) {
    return <Forbidden />;
  }

  return (
    <PageContainer title="工作台" ghost breadcrumbRender={false}>
      <section className={styles.welcome}>
        <Typography.Text type="secondary" className={styles.welcomeText}>
          {welcome}
          <span className={styles.cursor} />
        </Typography.Text>
      </section>

      <section className={styles.stats}>
        <Row gutter={[16, 16]}>
          {statItems(data).map((item) => (
            <Col xs={24} sm={12} xl={6} key={item.title}>
              <Card hoverable className={styles.statCard} loading={loading}>
                <Statistic
                  title={item.title}
                  value={item.value}
                  prefix={
                    <span
                      className={styles.statIcon}
                      style={{
                        color: item.color,
                        background: `${item.color}14`,
                      }}
                    >
                      {item.icon}
                    </span>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      <Row gutter={[16, 16]} className={styles.grid}>
        <Col xs={24} xl={12}>
          <Card
            title="快捷入口"
            className={`${styles.panel} ${styles.shortcutPanel}`}
            extra={
              <Typography.Text type="secondary">
                常用功能，一键直达
              </Typography.Text>
            }
          >
            <Row gutter={[12, 12]}>
              {visibleShortcuts.map((item) => (
                <Col xs={24} sm={12} key={item.title}>
                  <Card
                    hoverable
                    className={styles.shortcut}
                    onClick={() => history.push(item.path)}
                  >
                    <span className={styles.shortcutIcon}>{item.icon}</span>
                    <span>
                      <Typography.Text strong>{item.title}</Typography.Text>
                      <Typography.Paragraph
                        type="secondary"
                        ellipsis={{ rows: 1 }}
                      >
                        {item.desc}
                      </Typography.Paragraph>
                    </span>
                    <ArrowRightOutlined className={styles.arrow} />
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
        <Col xs={24} xl={12}>
          <Card
            title="近 7 天用户注册数"
            className={`${styles.panel} ${styles.trendPanel}`}
          >
            {loading ? (
              <Skeleton active paragraph={{ rows: 5 }} />
            ) : data?.register_trend.length ? (
              <div className={styles.trendChart}>
                <Column {...trendConfig} data={data.register_trend} />
              </div>
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="暂无注册数据"
              />
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className={styles.grid}>
        <Col xs={24} xl={12}>
          <LatestNotices loading={noticeLoading} list={notices} />
        </Col>
        {canViewActivities && (
          <Col xs={24} xl={12}>
            <LatestActivities loading={actLoading} list={activities} />
          </Col>
        )}
      </Row>
    </PageContainer>
  );
};

export default DashboardPage;
