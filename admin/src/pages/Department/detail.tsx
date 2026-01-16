import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import React from 'react';
import { Button } from 'antd';
import { useNavigate, useParams } from '@umijs/max';
import { useModel } from '@umijs/max';

const DepartmentDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { useDepartmentDetail } = useModel('department');
  const { departmentDetail, loading } = useDepartmentDetail(Number(id));

  return (
    <PageContainer
      ghost
      header={{
        title: '科室详情',
        extra: [
          <Button onClick={() => navigate('/department/list')}>返回列表</Button>,
        ],
      }}
    >
      <ProDescriptions column={2} title="科室信息" loading={loading}>
        <ProDescriptions.Item label="科室名称">{departmentDetail?.name}</ProDescriptions.Item>
        <ProDescriptions.Item label="科室编码">{departmentDetail?.code}</ProDescriptions.Item>
        <ProDescriptions.Item label="类型">{departmentDetail?.type === 1 ? '临床' : '非临床'}</ProDescriptions.Item>
        <ProDescriptions.Item label="联系人">{departmentDetail?.contact}</ProDescriptions.Item>
        <ProDescriptions.Item label="电话">{departmentDetail?.phone}</ProDescriptions.Item>
        <ProDescriptions.Item label="状态">{departmentDetail?.status === 1 ? '启用' : '禁用'}</ProDescriptions.Item>
        <ProDescriptions.Item label="创建时间">{departmentDetail?.createdAt}</ProDescriptions.Item>
        <ProDescriptions.Item label="更新时间">{departmentDetail?.updatedAt}</ProDescriptions.Item>
      </ProDescriptions>
    </PageContainer>
  );
};

export default DepartmentDetail;