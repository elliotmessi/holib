import { PageContainer, ProForm, ProFormText, ProFormSelect, ProFormTextArea } from '@ant-design/pro-components';
import React from 'react';
import { Button, message } from 'antd';
import { useNavigate } from '@umijs/max';

const RoleCreate: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (values: any) => {
    console.log('提交数据:', values);
    message.success('创建成功');
    navigate('/role/list');
  };

  return (
    <PageContainer
      ghost
      header={{
        title: '新建角色',
        extra: [
          <Button onClick={() => navigate('/role/list')}>取消</Button>,
        ],
      }}
    >
      <ProForm
        onFinish={handleSubmit}
        layout="vertical"
      >
        <ProFormText
          name="roleName"
          label="角色名称"
          rules={[{ required: true, message: '请输入角色名称' }]}
        />
        <ProFormText
          name="roleKey"
          label="角色标识"
          rules={[{ required: true, message: '请输入角色标识' }]}
        />
        <ProFormSelect
          name="status"
          label="状态"
          options={[
            { value: '1', label: '启用' },
            { value: '0', label: '禁用' },
          ]}
          initialValue="1"
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

export default RoleCreate;