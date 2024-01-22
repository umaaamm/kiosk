import React, { useState, useEffect } from "react";
import './index.scss';
import { useNavigate } from "react-router-dom";
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Row, Col, Typography, Form, Input, Spin, Button, Space, message, Flex, Image } from "antd";
import axios from "axios";
import Logo from "../../../Assets/images/logo.png";
import Constant from "../../../config/constans";


const { Title } = Typography;
const { Footer, Content, Header } = Layout;

const Login = () => {
    const [loadingLogin, setLoadingLogin] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const login = (payload) => {
      const URL =
        Constant.URL_MASTER_PATH_DEV + Constant.URL_POST_AUTH_LOGIN;
      axios
        .post(URL, payload)
        .then((response) => {
          if (response.status === 200 && response.data.code === 200) {
            localStorage.setItem('token', response.data.data.token);
            messageApi.open({
              type: 'success',
              content: 'Success Login',
              duration: 4,
            });
            setTimeout(() => {
              setLoadingLogin(false)
              form.resetFields();
              navigate("/dashboard");
            },1000)
          } else {
            setLoadingLogin(false)
            messageApi.open({
              type: 'error',
              content: response.data.Message,
              duration: 4,
            });
          }
        })
        .catch((error) => {
          console.log(error, 'error');
          setTimeout(() => {
            setLoadingLogin(false)
            messageApi.open({
              type: 'error',
              content: error.message,
              duration: 4,
            });
            form.resetFields();
          },1000)
        });
    };

    const onFinish = (values) => {
        setLoadingLogin(true)
        login(values)
    };
    return (
      <Spin spinning={loadingLogin} tip="Loading...">
        {contextHolder}
        <Layout className="dashboard-login">
            <Header className="dashboard-login-header">
              <Flex justify="center" align="center">
                <Image
                  width={100}
                  src={Logo}
                  preview={false}
                />
              </Flex>
            </Header>
            <Content>
              <Row gutter={[16]}>
                <Col xs={{ span: 24 }} className="dashboard-login-form">
                  <Flex className="dashboard-form" vertical justify="center" align="center">
                    <Title level={3}>LOGIN</Title>
                    <Form form={form} onFinish={onFinish} layout="vertical" style={{width: '50%'}}>
                      <Row gutter={16}>
                        <Col xs={24}>
                          <Form.Item
                              label="Username"
                              name="username"
                              rules={[
                                {
                                  type: 'username',
                                  message: 'The input is not valid Username!',
                                },
                                {
                                  required: true,
                                  message: "Please input your Username!",
                                },
                              ]}
                          >
                              <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" style={{ backgroundColor: 'unset' }} />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col xs={24}>
                          <Form.Item
                              label="Password"
                              name="password"
                              rules={[
                                  {
                                      required: true,
                                      message: "Please input your password!",
                                  },
                              ]}
                          >
                              <Input.Password
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="Password"
                              />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col xs={24}>
                          <Form.Item>
                            <Button htmlType="submit" style={{ width: "100%" }} className="dashboard-form-login-button">
                                LOGIN
                            </Button>
                          </Form.Item>
                        </Col>
                      </Row>
                    </Form>
                  </Flex>
                </Col>
              </Row>
            </Content>
        </Layout>
      </Spin>

    );
};

export default Login;
