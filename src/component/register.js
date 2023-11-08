import React, { BaseSyntheticEvent, useState } from 'react';
import ReactDOM from 'react-dom';
import "../index.css";
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import { base_url } from '../baseUrl';
import setLocalStorage from '../helpers/setLocalStorage';
import { useNavigate } from '@tanstack/react-router';
import toast, { Toaster } from 'react-hot-toast';
import api from '../utils/api';


export const Register = () => {

    const [loading, setLoading] = useState(false)

    const navigate = useNavigate({ from: '/register' })

    const onFinish = async (values) => {
        try {
            setLoading(true)
            const { data } = await axios.post(`/user_create`, values);
            setLoading(false)
            if (data) {
                setLocalStorage("user", JSON.stringify(data))
                toast.success("Register Successful")
                navigate({ to: '/home' })
            }
        }
        catch (err) {
            setLoading(false)
        }
    }

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
                    name="user"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Name!',
                        },
                    ]}
                >
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="text"
                        placeholder="Name"
                    />
                </Form.Item>
                <Form.Item
                    name="phone"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your phone!',
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
                    <Button
                        loading={loading}
                        disabled={loading}
                        type="primary"
                        htmlType="submit"
                        className="user-form-button">
                        Register
                    </Button>
                </Form.Item>
            </Form>
            <Toaster />
        </div>
    );
};
