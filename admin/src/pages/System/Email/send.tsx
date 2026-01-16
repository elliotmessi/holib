import { PageContainer, ProForm, ProFormText, ProFormSelect, ProFormTextArea } from '@ant-design/pro-components';
import React from 'react';
import { Button, message } from 'antd';
import { useNavigate } from '@umijs/max';

const EmailSend: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (values: any) => {
    console.log('提交数据:', values);
    message.success('邮件发送成功');
  };

  return (
    <PageContainer
      ghost
      header={{
        title: '发送邮件',
      }}
    >
      <ProForm
        onFinish={handleSubmit}
        layout="vertical"
      >
        <ProFormText
          name="to"
          label="收件人"
          rules={[{ required: true, message: '请输入收件人邮箱' }]}
        />
        <ProFormText
          name="subject"
          label="主题"
          rules={[{ required: true, message: '请输入邮件主题' }]}
        />
        <ProFormTextArea
          name="content"
          label="邮件内容"
          rows={8}
          rules={[{ required: true, message: '请输入邮件内容' }]}
        />
        <Button type="primary" htmlType="submit">
          发送邮件
        </Button>
      </ProForm>
    </PageContainer>
  );
};

export default EmailSend;