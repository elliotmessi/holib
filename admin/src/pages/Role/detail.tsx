import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import React from 'react';
import { Button } from 'antd';
import { useNavigate, useParams } from '@umijs/max';
import { useModel } from '@umijs/max';

const RoleDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { useRoleDetail } = useModel('role');
  const { roleDetail, loading } = useRoleDetail(id ? Number(id) : undefined);

  return (
    <PageContainer title="角色详情">
      <div style={{ marginBottom: 16 }}>
        <Button onClick={() => navigate('/role')}>返回</Button>
      </div>
      <ProDescriptions column={2} title="角色信息" loading={loading}>
        <ProDescriptions.Item label="角色名称">{roleDetail?.name}</ProDescriptions.Item>
        <ProDescriptions.Item label="角色编码">{roleDetail?.code}</ProDescriptions.Item>
        <ProDescriptions.Item label="描述">{roleDetail?.description}</ProDescriptions.Item>
        <ProDescriptions.Item label="状态">{roleDetail?.status === 1 ? '启用' : '禁用'}</ProDescriptions.Item>
        <ProDescriptions.Item label="创建时间">{roleDetail?.createdAt}</ProDescriptions.Item>
        <ProDescriptions.Item label="更新时间">{roleDetail?.updatedAt}</ProDescriptions.Item>
      </ProDescriptions>
    </PageContainer>
  );
};

export default RoleDetail;
