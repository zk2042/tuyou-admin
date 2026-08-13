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
import { uploadImages } from '@/services/upload';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setUnreadCount } from '@/store/slices/noticeSlice';
import { setUser } from '@/utils/auth';
import { message } from '@/utils/message';
import {
  BellOutlined,
  CameraOutlined,
  CheckOutlined,
  ClearOutlined,
  DeleteOutlined,
  EditOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { history, useAccess, useLocation, useModel } from '@umijs/max';
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
  Tooltip,
  Typography,
  Upload,
} from 'antd';
import React from 'react';

import ChangePasswordModal from './components/ChangePasswordModal';
import EditProfileModal from './components/EditProfileModal';
import styles from './index.less';

const NOTICE_SIZE = 5;

type UserState = {
  id: string;
  username: string;
  role: string;
  avatar: string;
  adminname?: string;
  status?: string;
  menu_tree?: CurrentInfo['menu_tree'];
  perm_keys?: string[];
};

function toCurrentInfo(profile?: UserState): CurrentInfo | undefined {
  return Boolean(profile?.id) &&
    typeof profile?.adminname === 'string' &&
    typeof profile?.status === 'string' &&
    Array.isArray(profile.menu_tree) &&
    Array.isArray(profile.perm_keys)
    ? {
        id: profile.id,
        username: profile.username,
        adminname: profile.adminname,
        role: profile.role,
        avatar: profile.avatar,
        status: profile.status,
        menu_tree: profile.menu_tree,
        perm_keys: profile.perm_keys,
      }
    : undefined;
}

const noticeMap = {
  0: {
    title: '系统通知',
    icon: <SafetyCertificateOutlined />,
  },
  1: {
    title: '安全设置提醒',
    icon: <LockOutlined />,
  },
  2: {
    title: '设备登录提醒',
    icon: <BellOutlined />,
  },
} as const;

const CenterPage: React.FC = () => {
  const { modal } = App.useApp();
  const location = useLocation();
  const { initialState, setInitialState } = useModel('@@initialState');
  const dispatch = useAppDispatch();
  const unreadCount = useAppSelector((state) => state.notice.unreadCount);
  const { hasPerm } = useAccess();
  const canUpdateProfile = hasPerm('center:profile');
  const canUpdateAvatar = hasPerm('center:avatar');
  const canViewNotification = hasPerm('center:notification:list');
  const canViewUnread = hasPerm('center:notification:unread');
  const canReadAll = hasPerm('center:notification:read-all');
  const canReadOne = hasPerm('center:notification:read');
  const canDeleteNotice = hasPerm('center:notification:delete');
  const canClearNotice = hasPerm('center:notification:clear');
  const canUpdatePassword = hasPerm('auth:password');
  const canUploadImage = hasPerm('upload:image:batch');
  const [noticeLoading, setNoticeLoading] = React.useState(false);
  const [noticeAct, setNoticeAct] = React.useState<string>();
  const [readAllLoading, setReadAllLoading] = React.useState(false);
  const [clearLoading, setClearLoading] = React.useState(false);
  const [usernameSaving, setUsernameSaving] = React.useState(false);
  const [avatarSaving, setAvatarSaving] = React.useState(false);
  const [passwordSaving, setPasswordSaving] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [passwordOpen, setPasswordOpen] = React.useState(false);
  const [avatarPreviewOpen, setAvatarPreviewOpen] = React.useState(false);
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
    try {
      const response = await getMe();

      if (!response.data) {
        return;
      }

      syncInfo(response.data);
    } catch {
      return;
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
    if (!canViewNotification) {
      setNotifications([]);
      setNoticeTotal(0);
    }

    if (!canViewUnread) {
      dispatch(setUnreadCount(0));
    }

    if (!canViewNotification && !canViewUnread) {
      return;
    }

    if (canViewNotification) {
      void loadNotifications();
    }

    if (canViewUnread) {
      void loadUnread();
    }
  }, [
    canViewNotification,
    canViewUnread,
    dispatch,
    loadNotifications,
    loadUnread,
  ]);

  React.useEffect(() => {
    const action = new URLSearchParams(location.search).get('action');

    if (action === 'password' && canUpdatePassword) {
      setPasswordOpen(true);
      history.replace('/center');
    }
  }, [canUpdatePassword, location.search]);

  const uploadAvatar = React.useCallback<
    NonNullable<UploadProps['customRequest']>
  >(
    async (options) => {
      const file = options.file as File;

      try {
        setAvatarSaving(true);
        const uploadResponse = await uploadImages([file]);
        const avatar = uploadResponse.data?.urls[0];

        if (!avatar) {
          throw new Error('上传头像失败');
        }

        const response = await updateAvatar({ avatar });

        message.success(response.message || '头像更新成功');
        await loadProfile();
        options.onSuccess?.(response);
      } catch (error) {
        options.onError?.(error as Error);
      } finally {
        setAvatarSaving(false);
      }
    },
    [loadProfile],
  );

  const submitName = React.useCallback(
    async (values: NameBody) => {
      setUsernameSaving(true);

      try {
        const response = await updateName(values);

        message.success(response.message || '用户账号更新成功');
        await loadProfile();
        setProfileOpen(false);
      } catch {
        return;
      } finally {
        setUsernameSaving(false);
      }
    },
    [loadProfile],
  );

  const submitPwd = React.useCallback(
    async (values: PwdBody) => {
      setPasswordSaving(true);

      try {
        const response = await updatePassword(values);
        message.success(response.message || '密码修改成功');
        setPasswordOpen(false);
        if (canViewNotification) {
          void loadNotifications();
        }

        if (canViewUnread) {
          void loadUnread();
        }
      } catch {
        return;
      } finally {
        setPasswordSaving(false);
      }
    },
    [canViewNotification, canViewUnread, loadNotifications, loadUnread],
  );

  const readAll = React.useCallback(async () => {
    setReadAllLoading(true);

    try {
      const response = await readAllNotice();
      message.success(response.message || '已全部标记为已读');
      if (canViewNotification) {
        void loadNotifications();
      }

      if (canViewUnread) {
        void loadUnread();
      }
    } catch {
      return;
    } finally {
      setReadAllLoading(false);
    }
  }, [canViewNotification, canViewUnread, loadNotifications, loadUnread]);

  const readOne = React.useCallback(
    async (item: NoticeItem) => {
      if (item.is_read === 1 || !canReadOne || noticeAct !== undefined) {
        return;
      }

      setNoticeAct(item.id);

      try {
        const response = await readNotice(item.id);
        message.success(response.message || '已标记为已读');
        await Promise.all([
          canViewNotification ? loadNotifications() : Promise.resolve(),
          canViewUnread ? loadUnread() : Promise.resolve(),
        ]);
      } catch {
        return;
      } finally {
        setNoticeAct(undefined);
      }
    },
    [
      canReadOne,
      canViewNotification,
      canViewUnread,
      loadNotifications,
      loadUnread,
      noticeAct,
    ],
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
            if (canViewUnread) {
              await loadUnread();
            }

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
    [
      canViewUnread,
      loadNotifications,
      loadUnread,
      modal,
      noticePage,
      notifications.length,
    ],
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

  return (
    <PageContainer ghost breadcrumbRender={false}>
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
                {canUpdateAvatar && canUploadImage ? (
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
                ) : null}
              </div>
              <div className={styles.profileMeta}>
                <div className={styles.nameRow}>
                  <Typography.Title level={4} className={styles.name}>
                    {profile?.username || '-'}
                  </Typography.Title>
                  {canUpdateProfile ? (
                    <Button
                      type="link"
                      icon={<EditOutlined />}
                      className={styles.linkButton}
                      onClick={() => {
                        setProfileOpen(true);
                      }}
                    />
                  ) : null}
                </div>
                <Typography.Text type="secondary" className={styles.realName}>
                  {`真实姓名：${profile?.adminname || '-'}`}
                </Typography.Text>
                <Space size={8} wrap className={styles.tagGroup}>
                  <Tag color="processing">{profile?.role || '-'}</Tag>
                  <Tag
                    color={profile?.status === '启用' ? 'success' : 'default'}
                  >
                    {profile?.status || '-'}
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
              {canUpdatePassword ? (
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
              ) : null}

              {canViewNotification ? (
                <div className={styles.securityMain}>
                  <BellOutlined className={styles.securityIcon} />
                  <div>
                    <div className={styles.securityTitle}>登录提醒</div>
                    <Typography.Paragraph className={styles.securityDesc}>
                      当前系统登录后发送登录提醒，如发现异常登录信息请及时修改账号或密码。
                    </Typography.Paragraph>
                  </div>
                </div>
              ) : null}
            </div>
          </Card>
        </div>

        {canViewNotification ? (
          <div className={styles.rightColumn}>
            <Card className={styles.card} variant="borderless">
              <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>
                  <Badge count={unreadCount} size="small">
                    <BellOutlined className={styles.noticeBell} />
                  </Badge>
                  消息通知
                </span>

                {canReadAll || canClearNotice ? (
                  <div className={styles.notifyActions}>
                    {canReadAll ? (
                      <Tooltip title="全部已读">
                        <Button
                          type="text"
                          className={styles.notifyActionButton}
                          aria-label="全部已读"
                          icon={<CheckOutlined />}
                          onClick={() => {
                            void readAll();
                          }}
                          loading={readAllLoading}
                          disabled={
                            noticeLoading ||
                            clearLoading ||
                            notifications.length === 0
                          }
                        />
                      </Tooltip>
                    ) : null}
                    {canClearNotice ? (
                      <Tooltip title="清空所有消息">
                        <Button
                          danger
                          type="text"
                          className={styles.notifyActionButton}
                          aria-label="清空所有消息"
                          icon={<ClearOutlined />}
                          onClick={() => {
                            confirmClear();
                          }}
                          loading={clearLoading}
                          disabled={
                            noticeLoading ||
                            readAllLoading ||
                            notifications.length === 0
                          }
                        />
                      </Tooltip>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <Spin spinning={noticeLoading}>
                {notifications.length ? (
                  <div className={styles.notifyList}>
                    {notifications.map((item) => (
                      <div
                        key={item.id}
                        className={`${styles.notifyItem} ${
                          item.is_read === 0
                            ? styles.notifyUnread
                            : styles.notifyRead
                        }`}
                        role={
                          item.is_read === 0 && canReadOne
                            ? 'button'
                            : undefined
                        }
                        tabIndex={
                          item.is_read === 0 && canReadOne ? 0 : undefined
                        }
                        onClick={() => {
                          void readOne(item);
                        }}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            void readOne(item);
                          }
                        }}
                      >
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
                              {formatNoticeTime(item.send_time)}
                            </span>
                          </div>
                          <div className={styles.notifyContentRow}>
                            <Typography.Paragraph className={styles.notifyDesc}>
                              {item.content}
                            </Typography.Paragraph>
                            {canDeleteNotice ? (
                              <Tooltip title="删除消息">
                                <Button
                                  danger
                                  type="text"
                                  size="small"
                                  className={styles.notifyDelete}
                                  aria-label="删除消息"
                                  icon={<DeleteOutlined />}
                                  disabled={noticeAct !== undefined}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    deleteOne(item);
                                  }}
                                  onKeyDown={(event) => {
                                    event.stopPropagation();
                                  }}
                                >
                                  删除
                                </Button>
                              </Tooltip>
                            ) : null}
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
              {noticeTotal > 0 ? (
                <div className={styles.notifyPager}>
                  <Pagination
                    current={noticePage}
                    pageSize={NOTICE_SIZE}
                    total={noticeTotal}
                    showSizeChanger={true}
                    showTotal={(total) => `共 ${total} 条`}
                    size="small"
                    align="end"
                    onChange={(page) => {
                      setNoticePage(page);
                    }}
                  />
                </div>
              ) : null}
            </Card>
          </div>
        ) : null}
      </div>
      <EditProfileModal
        open={canUpdateProfile && profileOpen}
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
        open={canUpdatePassword && passwordOpen}
        saving={passwordSaving}
        onCancel={() => {
          setPasswordOpen(false);
        }}
        onSubmit={(values) => {
          void submitPwd(values);
        }}
      />
    </PageContainer>
  );
};

export default CenterPage;
