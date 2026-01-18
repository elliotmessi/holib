import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import React from 'react';
import { Button } from 'antd';
import { useNavigate, useParams } from '@umijs/max';
import { useModel } from '@umijs/max';

const TaskDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { useTaskDetail } = useModel('system') as any;
  const detailHook = useTaskDetail ? useTaskDetail(id ? id : undefined) : { taskDetail: null, loading: false };
  const { taskDetail, loading } = detailHook;

  return (
    <PageContainer title="定时任务详情">
      <div style={{ marginBottom: 16 }}>
        <Button onClick={() => navigate('/system/task')}>返回</Button>
      </div>
      <ProDescriptions column={2} title="定时任务信息" loading={loading}>
        <ProDescriptions.Item label="任务名称">{taskDetail?.taskName}</ProDescriptions.Item>
        <ProDescriptions.Item label="任务分组">{taskDetail?.taskGroup}</ProDescriptions.Item>
        <ProDescriptions.Item label="cron表达式">{taskDetail?.taskCron}</ProDescriptions.Item>
        <ProDescriptions.Item label="任务类名">{taskDetail?.taskClass}</ProDescriptions.Item>
        <ProDescriptions.Item label="状态">{taskDetail?.status === 1 ? '启用' : '禁用'}</ProDescriptions.Item>
        <ProDescriptions.Item label="创建时间">{taskDetail?.createdAt}</ProDescriptions.Item>
      </ProDescriptions>
    </PageContainer>
  );
};

export default TaskDetail;
