import { PageContainer, ProForm } from '@ant-design/pro-components';
import React from 'react';
import { Button, message } from 'antd';
import { useNavigate } from 'umi';

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
        <ProForm.Text
          name="to"
          label="收件人"
          rules={[{ required: true, message: '请输入收件人邮箱' }]}
        />
        <ProForm.Text
          name="subject"
          label="主题"
          rules={[{ required: true, message: '请输入邮件主题' }]}
        />
        <ProForm.TextArea
          name="content"
          label="邮件内容"
          rows={8}
          rules={[{ required: true, message: '请输入邮件内容' }]}
        />
        <ProForm.Submit>
          发送邮件
        </ProForm.Submit>
      </ProForm>
    </PageContainer>
  );
};

export default EmailSend;