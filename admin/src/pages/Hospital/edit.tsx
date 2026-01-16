import { PageContainer, ProForm, ProFormText, ProFormSelect } from '@ant-design/pro-components';
import React from 'react';
import { Button } from 'antd';
import { useNavigate, useParams } from '@umijs/max';
import { Access, useAccess } from '@umijs/max';
import { useModel } from '@umijs/max';
import { HospitalUpdateRequest } from '@/services/hospital';

const HospitalEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const access = useAccess();
  const { useHospitalDetail, useUpdateHospital } = useModel('hospital');
  const { hospitalDetail, loading: detailLoading } = useHospitalDetail(id);
  const { submitUpdate, loading: updateLoading } = useUpdateHospital({
    success: () => navigate('/hospital/list'),
  });

  const handleSubmit = (values: HospitalUpdateRequest) => {
    if (id) {
      submitUpdate(id, values);
    }
  };

  return (
    <PageContainer
      ghost
      header={{
        title: '编辑医院',
        extra: [
          <Button onClick={() => navigate('/hospital/list')}>取消</Button>,
        ],
      }}
    >
      <Access accessible={access.hasPermission('hospital:hospital:update')}>
        <ProForm
          onFinish={handleSubmit}
          layout="vertical"
          initialValues={hospitalDetail}
          loading={detailLoading || updateLoading}
        >
          <ProFormText
            name="name"
            label="医院名称"
            rules={[{ required: true, message: '请输入医院名称' }]}
          />
          <ProFormText
            name="code"
            label="医院编码"
            rules={[{ required: true, message: '请输入医院编码' }]}
          />
          <ProFormText
            name="address"
            label="地址"
            rules={[{ required: true, message: '请输入地址' }]}
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
          <ProFormText
            name="email"
            label="邮箱"
            rules={[{ type: 'email', message: '请输入正确的邮箱格式' }]}
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

export default HospitalEdit;