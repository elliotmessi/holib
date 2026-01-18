import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import React from 'react';
import { Button } from 'antd';
import { useNavigate, useParams } from '@umijs/max';
import { useModel } from '@umijs/max';

const DictItemDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { useDictItemDetail } = useModel('system');
  const { dictItemDetail, loading } = useDictItemDetail(id ? Number(id) : undefined);

  return (
    <PageContainer title="字典项详情">
      <div style={{ marginBottom: 16 }}>
        <Button onClick={() => navigate('/system/dictItem')}>返回</Button>
      </div>
      <ProDescriptions column={2} title="字典项信息" loading={loading}>
        <ProDescriptions.Item label="字典类型">{dictItemDetail?.typeCode}</ProDescriptions.Item>
        <ProDescriptions.Item label="字典项名称">{dictItemDetail?.name}</ProDescriptions.Item>
        <ProDescriptions.Item label="字典项值">{dictItemDetail?.value}</ProDescriptions.Item>
        <ProDescriptions.Item label="状态">{dictItemDetail?.status === 1 ? '启用' : '禁用'}</ProDescriptions.Item>
        <ProDescriptions.Item label="创建时间">{dictItemDetail?.createdAt}</ProDescriptions.Item>
      </ProDescriptions>
    </PageContainer>
  );
};

export default DictItemDetail;
