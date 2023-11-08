import React, { BaseSyntheticEvent } from 'react';
import ReactDOM from 'react-dom';
import "../index.css";
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import { base_url } from '../baseUrl';
import setLocalStorage from '../helpers/setLocalStorage';
import { Outlet, useNavigate } from '@tanstack/react-router';
import toast, { Toaster } from 'react-hot-toast';
import api from '../utils/api';


export const Login = () => {

    const [loading, setLoading] = React.useState(false)

    const navigate = useNavigate({ from: '/' })

    const onFinish = async (values) => {
        try {
            setLoading(true)
            const { data } = await axios.post(`login`, values);
            setLoading(false)
            if (data) {
                setLocalStorage("user", JSON.stringify(data))
                toast.success("Login Successful")
                window.location.href = "/home"
                // navigate({ to: '/home' })
            }
        }
        catch (err) {
            setLoading(false)
        }
    };

    return (
        <div className='user-form-wrapper'>
            <Form
                size='large'
                name="normal_login"
                className="user-form"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
            >
                <Form.Item
                    name="phone"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Phone!',
                        },
                    ]}
                >
                    <Input
                        maxLength={10}
                        onInput={(e) => e.target.value = e.target.value.slice(0, 10)}
                        prefix={<UserOutlined className="site-form-item-icon" />}
                        placeholder="Phone"
                        type='number' />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Password!',
                        },
                    ]}
                >
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Password"
                    />
                </Form.Item>
                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <a className="user-form-forgot" href="">
                        Forgot password
                    </a>
                </Form.Item>
                <Form.Item>
                    <Button
                        loading={loading}
                        disabled={loading}
                        type="primary"
                        htmlType="submit"
                        className="user-form-button">
                        Log in
                    </Button>
                    Or <a href="/register">register now!</a>
                </Form.Item>
            </Form>
            <Toaster />
        </div>
    );
};
