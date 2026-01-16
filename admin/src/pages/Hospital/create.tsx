import { PageContainer, ProForm, ProFormText, ProFormSelect } from '@ant-design/pro-components';
import React from 'react';
import { Button } from 'antd';
import { useNavigate } from '@umijs/max';
import { Access, useAccess } from '@umijs/max';
import { HospitalCreateRequest } from '@/services/hospital';
import useHospitalModel from '@/models/hospital';

const HospitalCreate: React.FC = () => {
  const navigate = useNavigate();
  const hospitalModel = useHospitalModel();
  const { useCreateHospital } = hospitalModel;
  const { submitCreate, loading } = useCreateHospital({
    success: () => navigate('/hospital/list'),
  });

  const handleSubmit = (values: HospitalCreateRequest) => {
    submitCreate(values);
  };

  return (
    <PageContainer
      ghost
      header={{
        title: '新建医院',
        extra: [
          <Button onClick={() => navigate('/hospital/list')}>取消</Button>,
        ],
      }}
    >
        <ProForm
          onFinish={handleSubmit}
          layout="vertical"
          loading={loading}
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
            initialValue={1}
            rules={[{ required: true, message: '请选择状态' }]}
          />
        </ProForm>
    </PageContainer>
  );
};

export default HospitalCreate;