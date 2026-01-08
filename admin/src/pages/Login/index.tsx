import { useState, useEffect } from 'react'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Input, Card, Typography, message } from 'antd'
import { Link, useNavigate } from '@umijs/max'
import { getCaptcha } from '@/services/auth'
import { login, logout } from '@/api/login'
import { setUserInfo } from '@/utils/auth'

const { Title } = Typography

const LoginPage = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [captchaId, setCaptchaId] = useState('')
  const [captchaImg, setCaptchaImg] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchCaptcha = async () => {
    try {
      const res = await getCaptcha()
      if (res.code === 200 && res.data) {
        setCaptchaId(res.data.id)
        setCaptchaImg(res.data.img)
      }
    } catch (error) {
      message.error(`获取验证码失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  useEffect(() => {
    fetchCaptcha()
  }, [])

  const handleLogin = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      const success = await login({
        username: values.username,
        password: values.password,
        captchaId,
        verifyCode: values.verifyCode,
      })

      if (success) {
        message.success('登录成功')
        navigate('/')
      }
    } catch (error) {
      message.error(`登录失败: ${error instanceof Error ? error.message : '未知错误'}`)
      fetchCaptcha()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <Title level={2}>医药后台管理系统</Title>
          <p className="text-gray-500">登录您的账户</p>
        </div>

        <Form
          form={form}
          name="login"
          initialValues={{ remember: true }}
          onFinish={handleLogin}
          layout="vertical"
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="用户名"
              autoComplete="username"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input
              prefix={<LockOutlined className="text-gray-400" />}
              type="password"
              placeholder="密码"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item
            name="verifyCode"
            label="验证码"
            rules={[{ required: true, message: '请输入验证码!' }]}
          >
            <div className="flex gap-2">
              <Input placeholder="验证码" style={{ flex: 1 }} />
              <div
                dangerouslySetInnerHTML={{ __html: captchaImg }}
                onClick={fetchCaptcha}
                className="cursor-pointer border rounded bg-white flex items-center justify-center"
                style={{ width: 120, height: 40 }}
              />
            </div>
          </Form.Item>

          <Form.Item>
            <div className="flex justify-between items-center">
              <Checkbox name="remember">记住我</Checkbox>
              <Link to="/register" className="text-blue-500 hover:underline">
                注册新账户
              </Link>
            </div>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full h-10" loading={loading}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default LoginPage
