import { PageContainer, ProForm, ProFormText, ProFormSelect } from '@ant-design/pro-components';
import React from 'react';
import { Button } from 'antd';
import { useNavigate } from '@umijs/max';
import { Access, useAccess } from '@umijs/max';
import { useModel } from '@umijs/max';
import { DepartmentCreateRequest } from '@/services/department';

const DepartmentCreate: React.FC = () => {
  const navigate = useNavigate();
  const access = useAccess();
  const { useCreateDepartment } = useModel('department');
  const { submitCreate, loading } = useCreateDepartment({
    success: () => navigate('/department/list'),
  });

  const handleSubmit = (values: DepartmentCreateRequest) => {
    submitCreate(values);
  };

  return (
    <PageContainer
      ghost
      header={{
        title: '新建科室',
        extra: [
          <Button onClick={() => navigate('/department/list')}>取消</Button>,
        ],
      }}
    >
      <Access accessible={access.hasPermission('hospital:department:create')}>
        <ProForm
          onFinish={handleSubmit}
          layout="vertical"
          loading={loading}
        >
          <ProFormText
            name="name"
            label="科室名称"
            rules={[{ required: true, message: '请输入科室名称' }]}
          />
          <ProFormText
            name="code"
            label="科室编码"
            rules={[{ required: true, message: '请输入科室编码' }]}
          />
          <ProFormSelect
            name="type"
            label="科室类型"
            options={[
              { value: 1, label: '临床' },
              { value: 2, label: '非临床' },
            ]}
            rules={[{ required: true, message: '请选择科室类型' }]}
          />
          <ProFormText
            name="contact"
            label="联系人"
            rules={[{ required: true, message: '请输入联系人' }]}
          />
          <ProFormText
            name="phone"
            label="电话"
            rules={[{ required: true, message: '请输入电话' }]}
          />
          <ProFormSelect
            name="status"
            label="状态"
            options={[
              { value: 1, label: '启用' },
              { value: 0, label: '禁用' },
            ]}
            initialValue={1}
            rules={[{ required: true, message: '请选择状态' }]}
          />
        </ProForm>
      </Access>
    </PageContainer>
  );
};

export default DepartmentCreate;