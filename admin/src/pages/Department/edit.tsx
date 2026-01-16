import { PageContainer, ProForm, ProFormText, ProFormSelect } from '@ant-design/pro-components';
import React from 'react';
import { Button } from 'antd';
import { useNavigate, useParams } from '@umijs/max';
import { Access, useAccess } from '@umijs/max';
import { useModel } from '@umijs/max';
import { DepartmentUpdateRequest } from '@/services/department';

const DepartmentEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const access = useAccess();
  const { useDepartmentDetail, useUpdateDepartment } = useModel('department');
  const { departmentDetail, loading: detailLoading } = useDepartmentDetail(Number(id));
  const { submitUpdate, loading: updateLoading } = useUpdateDepartment({
    success: () => navigate('/department/list'),
  });

  const handleSubmit = (values: DepartmentUpdateRequest) => {
    if (id) {
      submitUpdate(Number(id), values);
    }
  };

  return (
    <PageContainer
      ghost
      header={{
        title: '编辑科室',
        extra: [
          <Button onClick={() => navigate('/department/list')}>取消</Button>,
        ],
      }}
    >
      <Access accessible={access.hasPermission('hospital:department:update')}>
        <ProForm
          onFinish={handleSubmit}
          layout="vertical"
          initialValues={departmentDetail}
          loading={detailLoading || updateLoading}
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
            rules={[{ required: true, message: '请选择状态' }]}
          />
        </ProForm>
      </Access>
    </PageContainer>
  );
};

export default DepartmentEdit;