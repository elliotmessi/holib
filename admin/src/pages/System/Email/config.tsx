import { PageContainer, ProForm } from '@ant-design/pro-components';
import React from 'react';
import { Button, message } from 'antd';
import { useNavigate } from 'umi';

const EmailConfig: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (values: any) => {
    console.log('提交数据:', values);
    message.success('配置保存成功');
  };

  return (
    <PageContainer
      ghost
      header={{
        title: '邮件配置',
      }}
    >
      <ProForm
        onFinish={handleSubmit}
        layout="vertical"
        initialValues={{
          host: 'smtp.example.com',
          port: '587',
          username: 'admin@example.com',
          password: 'password',
          from: 'admin@example.com',
        }}
      >
        <ProForm.Text
          name="host"
          label="SMTP服务器"
          rules={[{ required: true, message: '请输入SMTP服务器' }]}
        />
        <ProForm.Text
          name="port"
          label="端口"
          rules={[{ required: true, message: '请输入端口' }]}
        />
        <ProForm.Text
          name="username"
          label="用户名"
          rules={[{ required: true, message: '请输入用户名' }]}
        />
        <ProForm.Password
          name="password"
          label="密码"
          rules={[{ required: true, message: '请输入密码' }]}
        />
        <ProForm.Text
          name="from"
          label="发件人邮箱"
          rules={[{ required: true, message: '请输入发件人邮箱' }]}
        />
        <ProForm.Submit>
          保存配置
        </ProForm.Submit>
      </ProForm>
    </PageContainer>
  );
};

export default EmailConfig;