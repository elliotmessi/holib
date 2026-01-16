import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import React from 'react';
import { Button } from 'antd';
import { useNavigate, useParams } from '@umijs/max';
import { useModel } from '@umijs/max';

const HospitalDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { useHospitalDetail } = useModel('hospital');
  const { hospitalDetail, loading } = useHospitalDetail(Number(id));

  return (
    <PageContainer
      ghost
      header={{
        title: '医院详情',
        extra: [
          <Button onClick={() => navigate('/hospital/list')}>返回列表</Button>,
        ],
      }}
    >
      <ProDescriptions column={2} title="医院信息" loading={loading}>
        <ProDescriptions.Item label="医院名称">{hospitalDetail?.name}</ProDescriptions.Item>
        <ProDescriptions.Item label="医院编码">{hospitalDetail?.code}</ProDescriptions.Item>
        <ProDescriptions.Item label="地址">{hospitalDetail?.address}</ProDescriptions.Item>
        <ProDescriptions.Item label="联系人">{hospitalDetail?.contact}</ProDescriptions.Item>
        <ProDescriptions.Item label="电话">{hospitalDetail?.phone}</ProDescriptions.Item>
        <ProDescriptions.Item label="邮箱">{hospitalDetail?.email}</ProDescriptions.Item>
        <ProDescriptions.Item label="状态">{hospitalDetail?.status === 1 ? '启用' : '禁用'}</ProDescriptions.Item>
        <ProDescriptions.Item label="创建时间">{hospitalDetail?.createdAt}</ProDescriptions.Item>
        <ProDescriptions.Item label="更新时间">{hospitalDetail?.updatedAt}</ProDescriptions.Item>
      </ProDescriptions>
    </PageContainer>
  );
};

export default HospitalDetail;