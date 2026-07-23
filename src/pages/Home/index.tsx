import Guide from '@/components/Guide';
import { apiRequest } from '@/lib/apiRequest';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button } from 'antd';
import styles from './index.less';

const HomePage: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const name = initialState?.username || '';

  const handleTest = async () => {
    const response = await apiRequest({
      url: '/v1/health',
      method: 'GET',
    });
    console.log('测试响应：', response);
  };

  return (
    <PageContainer ghost>
      <div className={styles.container}>
        <Guide name={name} />
        <div className={styles.test}>
          <Button type="primary" onClick={handleTest}>
            测试请求
          </Button>
        </div>
      </div>
    </PageContainer>
  );
};

export default HomePage;
