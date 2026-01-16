import { PageContainer, ProForm, ProFormText } from '@ant-design/pro-components';
import React, { useState, useEffect } from 'react';
import { Button, message } from 'antd';
import { useNavigate } from '@umijs/max';

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
        <ProFormText
          name="host"
          label="SMTP服务器"
          rules={[{ required: true, message: '请输入SMTP服务器' }]}
        />
        <ProFormText
          name="port"
          label="端口"
          rules={[{ required: true, message: '请输入端口' }]}
        />
        <ProFormText
          name="username"
          label="用户名"
          rules={[{ required: true, message: '请输入用户名' }]}
        />
        <ProFormText.Password
          name="password"
          label="密码"
          rules={[{ required: true, message: '请输入密码' }]}
        />
        <ProFormText
          name="from"
          label="发件人邮箱"
          rules={[{ required: true, message: '请输入发件人邮箱' }]}
        />
        <Button type="primary" htmlType="submit">
          保存配置
        </Button>
      </ProForm>
    </PageContainer>
  );
};

export default EmailConfig;