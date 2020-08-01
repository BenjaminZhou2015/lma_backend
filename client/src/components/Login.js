import React from "react";
import { Form, Button, Input, notification } from 'antd';
import request from 'umi-request';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import '../styles/Login.css';
import { API_ROOT } from '../constants';

const Login = props => {
    const { setUser } = props;
    const onSubmit = values => {
        request(`${API_ROOT}/admin/login` ,{
            method: 'POST',
            data: {
                ...values
            }
        }).then(
            response => {
                if (response.isSuccess === "true") {
                    const { token, msg } = response;
                    setUser({
                        token,
                        ...values
                    });
                    notification.success({
                        description: "Redirecting...",
                        duration: 1.5,
                        message: msg
                    })
                } else {
                    const { msg } = response;
                    notification.error({
                        description: "Login failed",
                        message: msg
                    })
                }
            }
        ).catch(err => {
            notification.error({
                description: "Login error",
                message: err
            });
        });
    }
    return (
        <Form className="login-form" onFinish={onSubmit}>
            <p className= "login-title">Admin Login
            </p>
            <Form.Item
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
            >
                <Input
                    prefix={<UserOutlined />}
                    placeholder="Username"
                />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
            >
                <Input
                    prefix={<LockOutlined />}
                    type="password"
                    placeholder="Password"
                />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                    Log in
                </Button>
            </Form.Item>
        </Form>
    );
};

export default Login;
