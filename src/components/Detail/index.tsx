import type { DescriptionsProps } from 'antd';
import type { ReactNode } from 'react';

import { Descriptions, Drawer, theme } from 'antd';

interface UserDetailProps {
  title: ReactNode;
  open: boolean;
  onClose: () => void;
  width?: number;
  loading?: boolean;
  header?: ReactNode;
  items: DescriptionsProps['items'];
  extra?: ReactNode;
}

const Detail = ({
  title,
  open,
  onClose,
  width = 580,
  loading = false,
  header,
  items,
  extra,
}: UserDetailProps) => {
  const { token } = theme.useToken();

  return (
    <Drawer
      title={title}
      width={width}
      open={open}
      loading={loading}
      onClose={onClose}
      destroyOnHidden
      extra={extra}
    >
      {header}
      <Descriptions
        bordered
        column={1}
        items={items}
        styles={{
          label: {
            width: 116,
            background: token.colorFillAlter,
          },
          content: {
            background: token.colorBgContainer,
          },
        }}
      />
    </Drawer>
  );
};

export default Detail;
