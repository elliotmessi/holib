import { PageContainer, ProForm } from '@ant-design/pro-components';
import React from 'react';
import { Button, message } from 'antd';
import { useNavigate } from 'umi';

const UserCreate: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (values: any) => {
    console.log('提交数据:', values);
    message.success('创建成功');
    navigate('/user/list');
  };

  return (
    <PageContainer
      ghost
      header={{
        title: '新建用户',
        extra: [
          <Button onClick={() => navigate('/user/list')}>取消</Button>,
        ],
      }}
    >
      <ProForm
        onFinish={handleSubmit}
        layout="vertical"
      >
        <ProForm.Text
          name="username"
          label="用户名"
          rules={[{ required: true, message: '请输入用户名' }]}
        />
        <ProForm.Text
          name="realName"
          label="真实姓名"
          rules={[{ required: true, message: '请输入真实姓名' }]}
        />
        <ProForm.Password
          name="password"
          label="密码"
          rules={[{ required: true, message: '请输入密码' }]}
        />
        <ProForm.Text
          name="phone"
          label="电话"
          rules={[{ required: true, message: '请输入电话' }]}
        />
        <ProForm.Text
          name="email"
          label="邮箱"
          rules={[{ required: true, message: '请输入邮箱' }]}
        />
        <ProForm.Select
          name="status"
          label="状态"
          options={[
            { value: '1', label: '启用' },
            { value: '0', label: '禁用' },
          ]}
          initialValue="1"
          rules={[{ required: true, message: '请选择状态' }]}
        />
        <ProForm.TextArea
          name="remark"
          label="备注"
          rows={4}
        />
        <ProForm.Submit>
          保存
        </ProForm.Submit>
      </ProForm>
    </PageContainer>
  );
};

export default UserCreate;