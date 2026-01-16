import { PageContainer, ProForm } from '@ant-design/pro-components';
import React from 'react';
import { Button, message } from 'antd';
import { useNavigate } from 'umi';

const StorageCreate: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (values: any) => {
    console.log('提交数据:', values);
    message.success('创建成功');
    navigate('/system/storage/list');
  };

  return (
    <PageContainer
      ghost
      header={{
        title: '新建存储',
        extra: [
          <Button onClick={() => navigate('/system/storage/list')}>取消</Button>,
        ],
      }}
    >
      <ProForm
        onFinish={handleSubmit}
        layout="vertical"
      >
        <ProForm.Text
          name="storageName"
          label="存储名称"
          rules={[{ required: true, message: '请输入存储名称' }]}
        />
        <ProForm.Select
          name="storageType"
          label="存储类型"
          options={[
            { value: 'local', label: '本地存储' },
            { value: 'cloud', label: '云存储' },
          ]}
          initialValue="local"
          rules={[{ required: true, message: '请选择存储类型' }]}
        />
        <ProForm.Text
          name="storagePath"
          label="存储路径"
          rules={[{ required: true, message: '请输入存储路径' }]}
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

export default StorageCreate;