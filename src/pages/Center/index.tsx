import { formatNoticeTime } from '@/constants/common-const';
import {
  getMe,
  updatePassword,
  type CurrentInfo,
  type PwdBody,
} from '@/services/auth';
import {
  clearNotice,
  deleteNotice,
  queryNotice,
  queryNoticeUnread,
  readAllNotice,
  readNotice,
  updateAvatar,
  updateName,
  type NameBody,
  type NoticeItem,
} from '@/services/center';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setUnreadCount } from '@/store/slices/noticeSlice';
import { setUser } from '@/utils/auth';
import { message } from '@/utils/message';
import {
  BellOutlined,
  CameraOutlined,
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { history, useLocation, useModel } from '@umijs/max';
import type { UploadProps } from 'antd';
import {
  App,
  Avatar,
  Badge,
  Button,
  Card,
  Divider,
  Empty,
  Image,
  Pagination,
  Space,
  Spin,
  Tag,
  Typography,
  Upload,
} from 'antd';
import React from 'react';

import ChangePasswordModal from './components/ChangePasswordModal';
import EditProfileModal from './components/EditProfileModal';
import styles from './index.less';

const NOTICE_SIZE = 10;
const NOTICE_PREVIEW = 5;

type UserState = {
  id: string;
  username: string;
  role: string;
  avatar: string;
  adminname?: string;
  status?: boolean;
};

function toCurrentInfo(profile?: UserState): CurrentInfo | undefined {
  return Boolean(profile?.id) &&
    typeof profile?.adminname === 'string' &&
    typeof profile?.status === 'boolean'
    ? {
        id: profile.id,
        username: profile.username,
        adminname: profile.adminname,
        role: profile.role,
        avatar: profile.avatar,
        status: profile.status,
      }
    : undefined;
}

const noticeMap = {
  0: {
    title: '系统通知',
    icon: <BellOutlined />,
  },
  1: {
    title: '安全设置提醒',
    icon: <SafetyCertificateOutlined />,
  },
  2: {
    title: '设备登录提醒',
    icon: <LockOutlined />,
  },
} as const;

const CenterPage: React.FC = () => {
  const { modal } = App.useApp();
  const location = useLocation();
  const { initialState, setInitialState } = useModel('@@initialState');
  const dispatch = useAppDispatch();
  const unreadCount = useAppSelector((state) => state.notice.unreadCount);
  const [profileLoading, setProfileLoading] = React.useState(false);
  const [noticeLoading, setNoticeLoading] = React.useState(false);
  const [noticeAct, setNoticeAct] = React.useState<number>();
  const [readAllLoading, setReadAllLoading] = React.useState(false);
  const [clearLoading, setClearLoading] = React.useState(false);
  const [usernameSaving, setUsernameSaving] = React.useState(false);
  const [avatarSaving, setAvatarSaving] = React.useState(false);
  const [passwordSaving, setPasswordSaving] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [passwordOpen, setPasswordOpen] = React.useState(false);
  const [avatarPreviewOpen, setAvatarPreviewOpen] = React.useState(false);
  const [noticeOpen, setNoticeOpen] = React.useState(false);
  const [noticePage, setNoticePage] = React.useState(1);
  const [noticeTotal, setNoticeTotal] = React.useState(0);
  const [profile, setProfile] = React.useState<CurrentInfo | undefined>(
    toCurrentInfo(initialState),
  );
  const [notifications, setNotifications] = React.useState<NoticeItem[]>([]);

  const syncInfo = React.useCallback(
    (nextInfo: CurrentInfo) => {
      setProfile(nextInfo);
      setUser(nextInfo);
      setInitialState(nextInfo);
    },
    [setInitialState],
  );

  const loadProfile = React.useCallback(async () => {
    setProfileLoading(true);

    try {
      const response = await getMe();

      if (!response.data) {
        return;
      }

      syncInfo(response.data);
    } catch {
      return;
    } finally {
      setProfileLoading(false);
    }
  }, [syncInfo]);

  const loadNotifications = React.useCallback(async () => {
    setNoticeLoading(true);

    try {
      const response = await queryNotice({
        page: noticePage,
        size: NOTICE_SIZE,
      });
      const data = response.data;

      setNotifications(data?.list ?? []);
      setNoticeTotal(data?.total ?? 0);
    } catch {
      return;
    } finally {
      setNoticeLoading(false);
    }
  }, [noticePage]);

  const loadUnread = React.useCallback(async () => {
    try {
      const response = await queryNoticeUnread();
      dispatch(setUnreadCount(response.data?.unread_count ?? 0));
    } catch {
      return;
    }
  }, [dispatch]);

  React.useEffect(() => {
    const nextInfo = toCurrentInfo(initialState);

    if (nextInfo) {
      setProfile(nextInfo);
    }
  }, [initialState]);

  React.useEffect(() => {
    void loadProfile();
    void loadNotifications();
  }, [loadNotifications, loadProfile]);

  React.useEffect(() => {
    const action = new URLSearchParams(location.search).get('action');

    if (action === 'password') {
      setPasswordOpen(true);
      history.replace('/center');
    }
  }, [location.search]);

  React.useEffect(() => {
    setNoticeOpen(false);
  }, [noticePage, notifications.length]);

  const uploadAvatar = React.useCallback<
    NonNullable<UploadProps['customRequest']>
  >(
    async (options) => {
      const file = options.file as File;

      const toDataUrl = () =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();

          reader.onload = () => {
            if (typeof reader.result === 'string') {
              resolve(reader.result);
              return;
            }

            reject(new Error('图片读取失败'));
          };

          reader.onerror = () => {
            reject(new Error('图片读取失败'));
          };

          reader.readAsDataURL(file);
        });

      try {
        setAvatarSaving(true);
        const avatar = await toDataUrl();
        const response = await updateAvatar({ avatar });

        if (!response.data) {
          return;
        }

        syncInfo(response.data);
        message.success(response.message || '头像更新成功');
        options.onSuccess?.(response.data);
      } catch (error) {
        options.onError?.(error as Error);
      } finally {
        setAvatarSaving(false);
      }
    },
    [syncInfo],
  );

  const submitName = React.useCallback(
    async (values: NameBody) => {
      setUsernameSaving(true);

      try {
        const response = await updateName(values);

        if (!response.data) {
          return;
        }

        syncInfo(response.data);
        message.success(response.message || '用户账号更新成功');
        setProfileOpen(false);
      } catch {
        return;
      } finally {
        setUsernameSaving(false);
      }
    },
    [syncInfo],
  );

  const submitPwd = React.useCallback(
    async (values: PwdBody) => {
      setPasswordSaving(true);

      try {
        const response = await updatePassword(values);
        message.success(response.message || '密码修改成功');
        setPasswordOpen(false);
        void loadNotifications();
        void loadUnread();
      } catch {
        return;
      } finally {
        setPasswordSaving(false);
      }
    },
    [loadNotifications, loadUnread],
  );

  const readAll = React.useCallback(async () => {
    setReadAllLoading(true);

    try {
      const response = await readAllNotice();
      message.success(response.message || '已全部标记为已读');
      void loadNotifications();
      void loadUnread();
    } catch {
      return;
    } finally {
      setReadAllLoading(false);
    }
  }, [loadNotifications, loadUnread]);

  const readOne = React.useCallback(
    async (item: NoticeItem) => {
      setNoticeAct(item.id);

      try {
        const response = await readNotice(item.id);
        message.success(response.message || '已标记为已读');
        await Promise.all([loadNotifications(), loadUnread()]);
      } catch {
        return;
      } finally {
        setNoticeAct(undefined);
      }
    },
    [loadNotifications, loadUnread],
  );

  const deleteOne = React.useCallback(
    (item: NoticeItem) => {
      modal.confirm({
        title: '确认删除该消息吗？',
        content: '消息删除后将无法恢复。',
        okText: '确认',
        cancelText: '取消',
        okButtonProps: {
          danger: true,
        },
        onOk: async () => {
          setNoticeAct(item.id);

          try {
            const response = await deleteNotice(item.id);
            message.success(response.message || '消息删除成功');
            await loadUnread();

            if (notifications.length === 1 && noticePage > 1) {
              setNoticePage(noticePage - 1);
            } else {
              await loadNotifications();
            }
          } catch {
            return;
          } finally {
            setNoticeAct(undefined);
          }
        },
      });
    },
    [loadNotifications, loadUnread, modal, noticePage, notifications.length],
  );

  const confirmClear = React.useCallback(() => {
    modal.confirm({
      title: '确认清空所有消息吗？',
      content: '所有消息将被永久删除，且无法恢复。',
      okText: '确认清空',
      cancelText: '取消',
      okButtonProps: {
        danger: true,
      },
      onOk: async () => {
        setClearLoading(true);

        try {
          const response = await clearNotice();
          message.success(response.message || '已清空所有消息');
          dispatch(setUnreadCount(0));
          setNotifications([]);
          setNoticeTotal(0);
          setNoticePage(1);
        } catch {
          return;
        } finally {
          setClearLoading(false);
        }
      },
    });
  }, [dispatch, modal]);

  const visibleNotifications = noticeOpen
    ? notifications
    : notifications.slice(0, NOTICE_PREVIEW);

  return (
    <PageContainer ghost breadcrumbRender={false}>
      <Spin spinning={profileLoading}>
        <div className={styles.page}>
          <div className={styles.leftColumn}>
            <Card className={styles.card} variant="borderless">
              <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>
                  <UserOutlined />
                  个人信息
                </span>
              </div>

              <div className={styles.profileIntro}>
                <div className={styles.avatarWrap}>
                  <button
                    type="button"
                    className={styles.avatarPreview}
                    onClick={() => {
                      if (profile?.avatar) {
                        setAvatarPreviewOpen(true);
                      }
                    }}
                    aria-label={profile?.avatar ? '预览头像' : '头像预览不可用'}
                  >
                    <div
                      className={`${styles.avatarFrame} ${
                        profile?.avatar ? styles.avatarFrameActive : ''
                      }`}
                    >
                      <Avatar
                        size={114}
                        src={profile?.avatar || undefined}
                        className={styles.avatar}
                      >
                        {(profile?.username || 'U').slice(0, 1).toUpperCase()}
                      </Avatar>
                    </div>
                  </button>
                  {profile?.avatar ? (
                    <Image
                      width={0}
                      height={0}
                      src={profile.avatar}
                      preview={{
                        visible: avatarPreviewOpen,
                        onVisibleChange: setAvatarPreviewOpen,
                      }}
                    />
                  ) : null}
                  <Upload
                    accept="image/*"
                    showUploadList={false}
                    customRequest={uploadAvatar}
                    beforeUpload={(file) => {
                      const oversize = file.size / 1024 / 1024 > 5;

                      if (oversize) {
                        message.warning('图片大小不能超过5MB');
                        return Upload.LIST_IGNORE;
                      }

                      return true;
                    }}
                    disabled={avatarSaving}
                  >
                    <button
                      type="button"
                      className={styles.avatarAction}
                      aria-label="修改头像"
                    >
                      <CameraOutlined />
                    </button>
                  </Upload>
                </div>
                <div className={styles.profileMeta}>
                  <div className={styles.nameRow}>
                    <Typography.Title level={4} className={styles.name}>
                      {profile?.username || '-'}
                    </Typography.Title>
                    <Button
                      type="link"
                      icon={<EditOutlined />}
                      className={styles.linkButton}
                      onClick={() => {
                        setProfileOpen(true);
                      }}
                    />
                  </div>
                  <Typography.Text type="secondary" className={styles.realName}>
                    {`真实姓名：${profile?.adminname || '-'}`}
                  </Typography.Text>
                  <Space size={8} wrap className={styles.tagGroup}>
                    <Tag color="processing">{profile?.role || '-'}</Tag>
                    <Tag color={profile?.status ? 'success' : 'default'}>
                      {profile?.status ? '正常' : '禁用'}
                    </Tag>
                  </Space>
                </div>
              </div>

              <Divider className={styles.sectionDivider} />

              <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>
                  <SafetyCertificateOutlined />
                  安全设置
                </span>
              </div>

              <div className={styles.securityList}>
                <div className={styles.securityItem}>
                  <div className={styles.securityMain}>
                    <LockOutlined className={styles.securityIcon} />
                    <div>
                      <div className={styles.securityTitle}>登录密码</div>
                      <Typography.Paragraph className={styles.securityDesc}>
                        为了您的账号安全，建议定期修改密码。
                      </Typography.Paragraph>
                    </div>
                  </div>
                  <Button
                    type="link"
                    className={styles.linkButton}
                    onClick={() => {
                      setPasswordOpen(true);
                    }}
                  >
                    修改密码
                  </Button>
                </div>

                <div className={styles.securityItem}>
                  <div className={styles.securityMain}>
                    <BellOutlined className={styles.securityIcon} />
                    <div>
                      <div className={styles.securityTitle}>登录提醒</div>
                      <Typography.Paragraph className={styles.securityDesc}>
                        当前已开启异常登录提醒，发现异常消息请及时处理。
                      </Typography.Paragraph>
                    </div>
                  </div>
                  <Tag color="processing">已开启</Tag>
                </div>
              </div>
            </Card>
          </div>

          <div className={styles.rightColumn}>
            <Card className={styles.card} variant="borderless">
              <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>
                  <Badge count={unreadCount} size="small">
                    <BellOutlined className={styles.noticeBell} />
                  </Badge>
                  消息通知
                </span>

                <div className={styles.notifyActions}>
                  <Button
                    type="link"
                    className={styles.linkButton}
                    onClick={() => {
                      void readAll();
                    }}
                    loading={readAllLoading}
                    disabled={
                      noticeLoading ||
                      clearLoading ||
                      notifications.length === 0
                    }
                  >
                    全部已读
                  </Button>
                  <Button
                    danger
                    type="link"
                    className={styles.linkButton}
                    onClick={() => {
                      confirmClear();
                    }}
                    loading={clearLoading}
                    disabled={
                      noticeLoading ||
                      readAllLoading ||
                      notifications.length === 0
                    }
                  >
                    清空所有消息
                  </Button>
                </div>
              </div>

              <Spin spinning={noticeLoading}>
                {notifications.length ? (
                  <div className={styles.notifyList}>
                    {visibleNotifications.map((item) => (
                      <div key={item.id} className={styles.notifyItem}>
                        <span className={styles.notifyIcon}>
                          {noticeMap[item.type].icon}
                        </span>
                        <div className={styles.notifyBody}>
                          <div className={styles.notifyTop}>
                            <span className={styles.notifyTitle}>
                              {noticeMap[item.type].title}
                              {item.is_read === 0 ? (
                                <span className={styles.unreadDot} />
                              ) : null}
                            </span>
                            <span className={styles.notifyTime}>
                              {formatNoticeTime(item.created_at)}
                            </span>
                          </div>
                          <Typography.Paragraph className={styles.notifyDesc}>
                            {item.content}
                          </Typography.Paragraph>
                          <div className={styles.notifyItemActions}>
                            {item.is_read === 0 ? (
                              <Button
                                type="link"
                                size="small"
                                icon={<CheckOutlined />}
                                loading={noticeAct === item.id}
                                disabled={noticeAct !== undefined}
                                onClick={() => {
                                  void readOne(item);
                                }}
                              >
                                标记已读
                              </Button>
                            ) : null}
                            <Button
                              danger
                              type="link"
                              size="small"
                              icon={<DeleteOutlined />}
                              disabled={noticeAct !== undefined}
                              onClick={() => {
                                deleteOne(item);
                              }}
                            >
                              删除
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="暂无消息"
                  />
                )}
              </Spin>
              {notifications.length > NOTICE_PREVIEW && !noticeOpen ? (
                <div className={styles.noticeMore}>
                  <Button
                    type="link"
                    className={styles.linkButton}
                    onClick={() => {
                      setNoticeOpen(true);
                    }}
                  >
                    查看更多
                  </Button>
                </div>
              ) : null}
              {noticeTotal > 0 ? (
                <div className={styles.notifyPager}>
                  <Pagination
                    current={noticePage}
                    pageSize={NOTICE_SIZE}
                    total={noticeTotal}
                    showSizeChanger={false}
                    showTotal={(total) => `共 ${total} 条`}
                    onChange={(page) => {
                      setNoticePage(page);
                    }}
                  />
                </div>
              ) : null}
            </Card>
          </div>
        </div>
        <EditProfileModal
          open={profileOpen}
          saving={usernameSaving}
          values={{
            username: profile?.username || '',
          }}
          onCancel={() => {
            setProfileOpen(false);
          }}
          onSubmit={(values) => {
            void submitName(values);
          }}
        />

        <ChangePasswordModal
          open={passwordOpen}
          saving={passwordSaving}
          onCancel={() => {
            setPasswordOpen(false);
          }}
          onSubmit={(values) => {
            void submitPwd(values);
          }}
        />
      </Spin>
    </PageContainer>
  );
};

export default CenterPage;
