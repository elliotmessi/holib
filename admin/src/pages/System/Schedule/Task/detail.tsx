import { PageContainer, Descriptions } from '@ant-design/pro-components';
import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { useNavigate, useParams } from 'umi';

const TaskDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [detailData, setDetailData] = useState<any>({});

  // 模拟获取数据
  useEffect(() => {
    setDetailData({
      taskName: '系统备份',
      taskGroup: 'system',
      taskCron: '0 0 * * *',
      taskClass: 'com.hospital.system.task.BackupTask',
      status: '1',
      createBy: 'admin',
      createTime: '2026-01-01 10:00:00',
      remark: '每日系统备份',
    });
  }, [id]);

  return (
    <PageContainer
      ghost
      header={{
        title: '任务详情',
        extra: [
          <Button onClick={() => navigate('/system/schedule/task/list')}>返回列表</Button>,
        ],
      }}
    >
      <Descriptions column={2} title="任务信息">
        <Descriptions.Item label="任务名称">{detailData.taskName}</Descriptions.Item>
        <Descriptions.Item label="任务组">{detailData.taskGroup}</Descriptions.Item>
        <Descriptions.Item label="Cron表达式">{detailData.taskCron}</Descriptions.Item>
        <Descriptions.Item label="任务类">{detailData.taskClass}</Descriptions.Item>
        <Descriptions.Item label="状态">{detailData.status === '1' ? '启用' : '禁用'}</Descriptions.Item>
        <Descriptions.Item label="创建人">{detailData.createBy}</Descriptions.Item>
        <Descriptions.Item label="创建时间">{detailData.createTime}</Descriptions.Item>
        <Descriptions.Item label="备注">{detailData.remark}</Descriptions.Item>
      </Descriptions>
    </PageContainer>
  );
};

export default TaskDetail;