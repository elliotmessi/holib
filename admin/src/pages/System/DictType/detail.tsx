import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import React from 'react';
import { Button } from 'antd';
import { useNavigate, useParams } from '@umijs/max';
import { useModel } from '@umijs/max';

const DictTypeDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { useDictTypeDetail } = useModel('system');
  const { dictTypeDetail, loading } = useDictTypeDetail(id ? Number(id) : undefined);

  return (
    <PageContainer title="字典类型详情">
      <div style={{ marginBottom: 16 }}>
        <Button onClick={() => navigate('/system/dictType')}>返回</Button>
      </div>
      <ProDescriptions column={2} title="字典类型信息" loading={loading}>
        <ProDescriptions.Item label="字典名称">{dictTypeDetail?.name}</ProDescriptions.Item>
        <ProDescriptions.Item label="字典类型">{dictTypeDetail?.code}</ProDescriptions.Item>
        <ProDescriptions.Item label="描述">{dictTypeDetail?.description}</ProDescriptions.Item>
        <ProDescriptions.Item label="状态">{dictTypeDetail?.status === 1 ? '启用' : '禁用'}</ProDescriptions.Item>
        <ProDescriptions.Item label="创建时间">{dictTypeDetail?.createdAt}</ProDescriptions.Item>
      </ProDescriptions>
    </PageContainer>
  );
};

export default DictTypeDetail;
