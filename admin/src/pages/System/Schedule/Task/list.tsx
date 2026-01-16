import { PageContainer, ProTable } from '@ant-design/pro-components';
import React from 'react';
import { Button, message } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'umi';

const TaskList: React.FC = () => {
  const navigate = useNavigate();

  // 模拟数据
  const dataSource = [
    {
      id: '1',
      taskName: '系统备份',
      taskGroup: 'system',
      taskCron: '0 0 * * *',
      taskClass: 'com.hospital.system.task.BackupTask',
      status: '1',
      createBy: 'admin',
      createTime: '2026-01-01 10:00:00',
      remark: '每日系统备份',
    },
    {
      id: '2',
      taskName: '数据清理',
      taskGroup: 'system',
      taskCron: '0 1 * * *',
      taskClass: 'com.hospital.system.task.CleanTask',
      status: '1',
      createBy: 'admin',
      createTime: '2026-01-02 11:00:00',
      remark: '每日数据清理',
    },
  ];

  const columns = [
    {
      title: '任务名称',
      dataIndex: 'taskName',
      key: 'taskName',
    },
    {
      title: '任务组',
      dataIndex: 'taskGroup',
      key: 'taskGroup',
    },
    {
      title: 'Cron表达式',
      dataIndex: 'taskCron',
      key: 'taskCron',
    },
    {
      title: '任务类',
      dataIndex: 'taskClass',
      key: 'taskClass',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (status === '1' ? '启用' : '禁用'),
    },
    {
      title: '创建人',
      dataIndex: 'createBy',
      key: 'createBy',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <div>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/system/schedule/task/detail/${record.id}`)}
          >
            详情
          </Button>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => navigate(`/system/schedule/task/edit/${record.id}`)}
          >
            编辑
          </Button>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => message.success('删除成功')}
          >
            删除
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer
      ghost
      header={{
        title: '任务管理',
        extra: [
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/system/schedule/task/create')}
          >
            新建任务
          </Button>,
        ],
      }}
    >
      <ProTable
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        pagination={{
          pageSize: 10,
        }}
      />
    </PageContainer>
  );
};

export default TaskList;