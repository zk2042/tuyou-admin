import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

import styles from './index.less';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      className={styles.footer}
      style={{
        background: 'none',
      }}
      copyright={`2026${
        new Date().getFullYear() > 2026 ? `-${new Date().getFullYear()}` : ''
      } 途友管理后台`}
      links={
        [
          // {
          //   key: 'Ant Design Pro',
          //   title: 'Ant Design Pro',
          //   href: 'https://pro.ant.design',
          //   blankTarget: true,
          // },
          // {
          //   key: 'github',
          //   title: <GithubOutlined />,
          //   href: 'https://github.com/ant-design/ant-design-pro',
          //   blankTarget: true,
          // },
          // {
          //   key: 'Ant Design',
          //   title: 'Ant Design',
          //   href: 'https://ant.design',
          //   blankTarget: true,
          // },
        ]
      }
    />
  );
};

export default Footer;
