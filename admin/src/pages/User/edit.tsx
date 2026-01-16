import { PageContainer, ProForm, ProFormText, ProFormSelect, ProFormTextArea } from '@ant-design/pro-components';
import React, { useState, useEffect } from 'react';
import { Button, message } from 'antd';
import { useNavigate, useParams } from '@umijs/max';

const UserEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<any>({});

  // 模拟获取数据
  useEffect(() => {
    setFormData({
      username: 'admin',
      realName: '管理员',
      phone: '13800138000',
      email: 'admin@example.com',
      status: '1',
      remark: '系统管理员',
    });
  }, [id]);

  const handleSubmit = (values: any) => {
    console.log('提交数据:', values);
    message.success('编辑成功');
    navigate('/user/list');
  };

  return (
    <PageContainer
      ghost
      header={{
        title: '编辑用户',
        extra: [
          <Button onClick={() => navigate('/user/list')}>取消</Button>,
        ],
      }}
    >
      <ProForm
        onFinish={handleSubmit}
        layout="vertical"
        initialValues={formData}
      >
        <ProFormText
          name="username"
          label="用户名"
          rules={[{ required: true, message: '请输入用户名' }]}
        />
        <ProFormText
          name="realName"
          label="真实姓名"
          rules={[{ required: true, message: '请输入真实姓名' }]}
        />
        <ProFormText.Password
          name="password"
          label="密码"
          placeholder="不修改请留空"
        />
        <ProFormText
          name="phone"
          label="电话"
          rules={[{ required: true, message: '请输入电话' }]}
        />
        <ProFormText
          name="email"
          label="邮箱"
          rules={[{ required: true, message: '请输入邮箱' }]}
        />
        <ProFormSelect
          name="status"
          label="状态"
          options={[
            { value: '1', label: '启用' },
            { value: '0', label: '禁用' },
          ]}
          rules={[{ required: true, message: '请选择状态' }]}
        />
        <ProFormTextArea
          name="remark"
          label="备注"
          rows={4}
        />
        <Button type="primary" htmlType="submit">
          保存
        </Button>
      </ProForm>
    </PageContainer>
  );
};

export default UserEdit;