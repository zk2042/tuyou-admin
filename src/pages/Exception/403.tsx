import { getMe } from '@/services/auth';
import { clearAuth, setUser } from '@/utils/auth';
import { history, useModel } from '@umijs/max';
import { App, Button, Result } from 'antd';
import { useState } from 'react';

export default function Forbidden() {
  const { message } = App.useApp();
  const { setInitialState } = useModel('@@initialState');
  const [refreshing, setRefreshing] = useState(false);

  const handleBackHome = async () => {
    setRefreshing(true);

    try {
      const meResponse = await getMe();

      if (meResponse.data) {
        setUser(meResponse.data);
        await setInitialState(meResponse.data);
      } else {
        clearAuth();
        message.error('权限信息获取失败，请重新登录');
        history.replace({
          pathname: '/login',
          search: `redirect=${encodeURIComponent('/')}`,
        });
        return;
      }
    } catch {
      clearAuth();
      message.error('权限信息获取失败，请重新登录');
      history.replace({
        pathname: '/login',
        search: `redirect=${encodeURIComponent('/')}`,
      });
      return;
    } finally {
      setRefreshing(false);
    }

    history.replace('/');
  };

  return (
    <Result
      status="403"
      title="403"
      subTitle="抱歉，您没有权限访问此页面"
      extra={
        <Button type="primary" loading={refreshing} onClick={handleBackHome}>
          返回首页
        </Button>
      }
    />
  );
}
