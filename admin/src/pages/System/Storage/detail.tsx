import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { useNavigate, useParams } from 'umi';

const StorageDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [detailData, setDetailData] = useState<any>({});

  // 模拟获取数据
  useEffect(() => {
    setDetailData({
      storageName: '本地存储',
      storageType: 'local',
      storagePath: '/data/storage',
      status: '1',
      createBy: 'admin',
      createTime: '2026-01-01 10:00:00',
      remark: '本地文件存储',
    });
  }, [id]);

  return (
    <PageContainer
      ghost
      header={{
        title: '存储详情',
        extra: [
          <Button onClick={() => navigate('/system/storage/list')}>返回列表</Button>,
        ],
      }}
    >
      <ProDescriptions column={2} title="存储信息">
        <ProDescriptions.Item label="存储名称">{detailData.storageName}</ProDescriptions.Item>
        <ProDescriptions.Item label="存储类型">{detailData.storageType === 'local' ? '本地存储' : '云存储'}</ProDescriptions.Item>
        <ProDescriptions.Item label="存储路径">{detailData.storagePath}</ProDescriptions.Item>
        <ProDescriptions.Item label="状态">{detailData.status === '1' ? '启用' : '禁用'}</ProDescriptions.Item>
        <ProDescriptions.Item label="创建人">{detailData.createBy}</ProDescriptions.Item>
        <ProDescriptions.Item label="创建时间">{detailData.createTime}</ProDescriptions.Item>
        <ProDescriptions.Item label="备注">{detailData.remark}</ProDescriptions.Item>
      </ProDescriptions>
    </PageContainer>
  );
};

export default StorageDetail;