import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import React from 'react';
import { Button } from 'antd';
import { useNavigate, useParams } from '@umijs/max';
import { useModel } from '@umijs/max';

const StorageDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { useStorageDetail } = useModel('system') as any;
  const detailHook = useStorageDetail ? useStorageDetail(id ? id : undefined) : { storageDetail: null, loading: false };
  const { storageDetail, loading } = detailHook;

  return (
    <PageContainer title="存储配置详情">
      <div style={{ marginBottom: 16 }}>
        <Button onClick={() => navigate('/system/storage')}>返回</Button>
      </div>
      <ProDescriptions column={2} title="存储配置信息" loading={loading}>
        <ProDescriptions.Item label="存储名称">{storageDetail?.storageName}</ProDescriptions.Item>
        <ProDescriptions.Item label="存储类型">{storageDetail?.storageType === 'local' ? '本地存储' : '云存储'}</ProDescriptions.Item>
        <ProDescriptions.Item label="存储路径">{storageDetail?.storagePath}</ProDescriptions.Item>
        <ProDescriptions.Item label="状态">{storageDetail?.status === 1 ? '启用' : '禁用'}</ProDescriptions.Item>
        <ProDescriptions.Item label="创建时间">{storageDetail?.createdAt}</ProDescriptions.Item>
      </ProDescriptions>
    </PageContainer>
  );
};

export default StorageDetail;
