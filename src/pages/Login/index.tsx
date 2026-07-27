import { LOCAL_STORAGE_KEY } from '@/constants';
import { adminLogin, type LoginForm } from '@/services/login';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { history, useModel } from '@umijs/max';
import { App, Button, Checkbox, Form, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { carouselImages } from './carouselConfig';
import styles from './index.less';

const LoginPage: React.FC = () => {
  const { message } = App.useApp();
  const { refresh } = useModel('@@initialState');
  const [submitting, setSubmitting] = useState(false);
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

  const handleLogin = async (values: LoginForm & { remember?: boolean }) => {
    setSubmitting(true);

    try {
      const response = await adminLogin({
        username: values.username,
        password: values.password,
      });

      if (!response.data) {
        message.error('登录失败，请稍后重试');
        return;
      }

      localStorage.setItem(LOCAL_STORAGE_KEY.USER_TOKEN, response.data.token);
      localStorage.setItem(
        LOCAL_STORAGE_KEY.USER_INFO,
        JSON.stringify(response.data.admin),
      );

      await refresh();

      message.success('登录成功');

      const redirect =
        new URLSearchParams(window.location.search).get('redirect') || '/';
      history.replace(redirect);
    } finally {
      setSubmitting(false);
    }
  };

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
            onFinish={handleLogin}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入管理员账号' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="请输入管理员账号" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="请输入密码"
              />
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
              loading={submitting}
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
