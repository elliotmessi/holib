import { useState } from 'react'
import { LockOutlined, UserOutlined, MailOutlined } from '@ant-design/icons'
import { Button, Form, Input, Card, Typography, message } from 'antd'
import { useRequest } from '@umijs/max'
import { Link, useNavigate } from '@umijs/max'
import { register } from '@/services/auth'

const { Title } = Typography

const RegisterPage = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()

  // 注册请求
  const { run: submitRegister, loading } = useRequest(register, {
    manual: true,
    onSuccess: () => {
      message.success('注册成功，请登录')
      navigate('/login')
    },
    onError: (error) => {
      message.error(`注册失败: ${error.message}`)
    },
  })

  // 处理注册表单提交
  const handleRegister = () => {
    form
      .validateFields()
      .then((values) => {
        submitRegister({
          username: values.username,
          password: values.password,
          confirmPassword: values.confirmPassword,
          email: values.email,
        })
      })
      .catch((errorInfo) => {
        console.log('表单验证失败:', errorInfo)
      })
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <Title level={2}>医药后台管理系统</Title>
          <p className="text-gray-500">创建您的账户</p>
        </div>

        <Form
          form={form}
          name="register"
          initialValues={{}}
          onFinish={handleRegister}
          layout="vertical"
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              { required: true, message: '请输入用户名!' },
              { min: 3, max: 20, message: '用户名长度必须在 3 到 20 个字符之间!' },
            ]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="用户名"
              autoComplete="username"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱!' },
              { type: 'email', message: '请输入有效的邮箱地址!' },
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="邮箱"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: true, message: '请输入密码!' },
              { min: 6, max: 20, message: '密码长度必须在 6 到 20 个字符之间!' },
            ]}
            hasFeedback
          >
            <Input
              prefix={<LockOutlined className="text-gray-400" />}
              type="password"
              placeholder="密码"
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="确认密码"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('两次输入密码不一致!'))
                },
              }),
            ]}
            hasFeedback
          >
            <Input
              prefix={<LockOutlined className="text-gray-400" />}
              type="password"
              placeholder="确认密码"
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full h-10" loading={loading}>
              注册
            </Button>
          </Form.Item>

          <Form.Item>
            <div className="text-center">
              已有账户?{' '}
              <Link to="/login" className="text-blue-500 hover:underline">
                登录
              </Link>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default RegisterPage
