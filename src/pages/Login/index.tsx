import logoImg from '@/assets/images/logo.png';
import {
  adminLogin,
  getCaptcha,
  type CaptchaData,
  type LoginForm,
} from '@/services/login';
import { setToken, setUser } from '@/utils/auth';
import {
  LockOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { history, useModel } from '@umijs/max';
import { App, Button, Checkbox, Form, Input } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { carouselImages } from './carouselConfig';
import styles from './index.less';

type FormValue = Omit<LoginForm, 'captchaKey'>;

const LoginPage: React.FC = () => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const { refresh, setInitialState } = useModel('@@initialState');
  const [submitting, setSubmitting] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [codeData, setCodeData] = useState<CaptchaData>();
  const [codeLoad, setCodeLoad] = useState(false);
  const activeSlide = carouselImages[activeIndex];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 3000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const loadCode = useCallback(async () => {
    setCodeLoad(true);

    try {
      const response = await getCaptcha({ skipErrorHandler: true });
      if (!response.data) {
        message.error('验证码加载失败，请稍后重试');
        return;
      }

      setCodeData(response.data);
      form.setFieldValue('captchaCode', undefined);
    } catch {
      message.error('验证码加载失败，请稍后重试');
    } finally {
      setCodeLoad(false);
    }
  }, [form, message]);

  useEffect(() => {
    loadCode();
  }, [loadCode]);

  const handleLogin = async (values: FormValue) => {
    if (!codeData?.captchaKey) {
      message.error('验证码未准备好，请刷新后重试');
      return;
    }

    setSubmitting(true);

    try {
      const response = await adminLogin({
        username: values.username,
        password: values.password,
        captchaCode: values.captchaCode,
        captchaKey: codeData.captchaKey,
        remember: values.remember,
      });

      if (!response.data) {
        message.error('登录失败，请稍后重试');
        return;
      }

      setToken(response.data, values.remember);
      setUser(response.data.admin);
      setInitialState(response.data.admin);

      await refresh();

      message.success('登录成功');

      const redirect =
        new URLSearchParams(window.location.search).get('redirect') || '/';
      history.replace(redirect);
    } catch {
      await loadCode();
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
            <div className={styles.brandHead}>
              <img src={logoImg} alt="途友" className={styles.brandLogo} />
              <h2>途友后台</h2>
            </div>
            <p>请输入账号信息后进入后台系统</p>
          </div>

          <Form
            form={form}
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

            <div className={styles.captchaRow}>
              <Form.Item
                name="captchaCode"
                className={styles.captchaInput}
                rules={[{ required: true, message: '请输入图片验证码' }]}
              >
                <Input
                  prefix={<SafetyCertificateOutlined />}
                  placeholder="请输入图片验证码"
                />
              </Form.Item>
              <button
                type="button"
                className={styles.captchaBox}
                onClick={loadCode}
                aria-label="刷新图片验证码"
                disabled={codeLoad}
              >
                {codeData?.imageUrl ? (
                  <img src={codeData.imageUrl} alt="图片验证码" />
                ) : (
                  <span className={styles.captchaText}>
                    {codeLoad ? '加载中...' : '点击刷新'}
                  </span>
                )}
              </button>
            </div>

            <div className={styles.formOptions}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>记住我</Checkbox>
              </Form.Item>
              <a href="#">忘记密码</a>
            </div>

            <div className={styles.loginHint}>
              还没有账号？请联系系统管理员开通。
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
