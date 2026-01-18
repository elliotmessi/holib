import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import React from 'react';
import { Button } from 'antd';
import { useNavigate, useParams } from '@umijs/max';
import { useModel } from '@umijs/max';

const ParamConfigDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { useSystemParamDetail } = useModel('system') as any;
  const detailHook = useSystemParamDetail ? useSystemParamDetail(id ? Number(id) : undefined) : { systemParamDetail: null, loading: false };
  const { systemParamDetail, loading } = detailHook;

  return (
    <PageContainer title="参数配置详情">
      <div style={{ marginBottom: 16 }}>
        <Button onClick={() => navigate('/system/paramConfig')}>返回</Button>
      </div>
      <ProDescriptions column={2} title="参数配置信息" loading={loading}>
        <ProDescriptions.Item label="参数名称">{systemParamDetail?.paramName}</ProDescriptions.Item>
        <ProDescriptions.Item label="参数键">{systemParamDetail?.paramKey}</ProDescriptions.Item>
        <ProDescriptions.Item label="参数值">{systemParamDetail?.paramValue}</ProDescriptions.Item>
        <ProDescriptions.Item label="状态">{systemParamDetail?.status === 1 ? '启用' : '禁用'}</ProDescriptions.Item>
        <ProDescriptions.Item label="创建时间">{systemParamDetail?.createdAt}</ProDescriptions.Item>
      </ProDescriptions>
    </PageContainer>
  );
};

export default ParamConfigDetail;
