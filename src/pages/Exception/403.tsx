import { history } from '@umijs/max';
import { Button, Result } from 'antd';

export default function Forbidden() {
  return (
    <Result
      status="403"
      title="403"
      subTitle="抱歉，您没有权限访问此页面"
      extra={
        <Button type="primary" onClick={() => history.replace('/')}>
          返回首页
        </Button>
      }
    />
  );
}
