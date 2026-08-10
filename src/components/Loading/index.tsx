import { theme } from 'antd';
import type { CSSProperties } from 'react';

import styles from './index.less';

interface LoadingProps {
  fullscreen?: boolean;
  tip?: string;
}

function LoadingIndicator() {
  const { token } = theme.useToken();
  const style = {
    '--loading-color': token.colorPrimary,
  } as CSSProperties;

  return <span className={styles.indicator} style={style} aria-hidden />;
}

const Loading = ({ fullscreen = true, tip = '加载中...' }: LoadingProps) => {
  const classNames = [styles.loading, fullscreen && styles.fullscreen]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames} role="status" aria-live="polite">
      <LoadingIndicator />
      {tip && <span className={styles.tip}>{tip}</span>}
    </div>
  );
};

export default Loading;
