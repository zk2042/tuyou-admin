import {
  LockOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { carouselImages } from './carouselConfig';
import styles from './index.less';

const LoginPage: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = carouselImages[activeIndex];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 3000);

    return () => {
      window.clearInterval(timer);
    };
  }, [activeIndex]);

  return (
    <div className={styles.loginWrap}>
      <div className={styles.visualPanel}>
        <img
          src={activeSlide.image}
          alt={activeSlide.title}
          className={styles.visualImage}
        />
        <div className={styles.visualOverlay} />
        <div className={styles.visualContent}>
          <div className={styles.visualFooter}>
            <h2>{activeSlide.title}</h2>
            <p>{activeSlide.description}</p>
            <div className={styles.carouselDots}>
              {carouselImages.map((item, index) => (
                <span
                  key={item.id}
                  className={`${styles.dot} ${
                    index === activeIndex ? styles.activeDot : ''
                  }`}
                  onClick={() => setActiveIndex(index)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      setActiveIndex(index);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`切换到第 ${index + 1} 张轮播图`}
                  aria-pressed={index === activeIndex}
                >
                  <span className={styles.dotFill} />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.formPanel}>
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <h2>途友后台</h2>
            <p>请输入账号信息后进入后台系统</p>
          </div>

          <Form
            layout="vertical"
            size="large"
            initialValues={{ remember: true }}
          >
            <Form.Item name="username">
              <Input prefix={<UserOutlined />} placeholder="请输入管理员账号" />
            </Form.Item>

            <Form.Item name="password">
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="请输入密码"
              />
            </Form.Item>

            <Form.Item name="captcha">
              <div className={styles.captchaRow}>
                <Input
                  prefix={<SafetyCertificateOutlined />}
                  placeholder="请输入验证码"
                  className={styles.captchaInput}
                />
                <div className={styles.captchaBox} aria-label="图形验证码">
                  <span>T8K9</span>
                </div>
              </div>
            </Form.Item>

            <div className={styles.formOptions}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>记住我</Checkbox>
              </Form.Item>
              <a href="#">忘记密码</a>
            </div>

            <Button
              type="primary"
              htmlType="submit"
              className={styles.loginButton}
              block
            >
              登录
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
