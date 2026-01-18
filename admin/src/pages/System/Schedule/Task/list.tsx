import { PageContainer, ProTable, ProColumns } from '@ant-design/pro-components';
import React from 'react';
import { Button, Modal } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from '@umijs/max';
import { useModel } from '@umijs/max';
import { useState } from 'react';

const TaskList: React.FC = () => {
  const navigate = useNavigate();
  const { useTaskList, useDeleteTask, useBatchDeleteTask } = useModel('system') as any;
  const result = useTaskList ? useTaskList() : { data: [], loading: false, refresh: () => {} };
  
  const { data: taskList = [], loading = false, refresh } = result;
  const deleteHook = useDeleteTask ? useDeleteTask({ success: () => refresh() }) : { submitDelete: () => {}, loading: false };
  const batchDeleteHook = useBatchDeleteTask ? useBatchDeleteTask({ success: () => refresh() }) : { submitBatchDelete: () => {}, loading: false };

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该定时任务吗？',
      onOk: () => deleteHook.submitDelete(id),
    });
  };

  const handleBatchDelete = () => {
    Modal.confirm({
      title: '确认批量删除',
      content: `确定要删除选中的 ${selectedRowKeys.length} 个定时任务吗？`,
      onOk: () => batchDeleteHook.submitBatchDelete(selectedRowKeys as string[]),
    });
  };

  const columns: ProColumns[] = [
    { title: '任务名称', dataIndex: 'taskName', key: 'taskName' },
    { title: '任务分组', dataIndex: 'taskGroup', key: 'taskGroup' },
    { title: 'cron表达式', dataIndex: 'taskCron', key: 'taskCron' },
    { title: '任务类名', dataIndex: 'taskClass', key: 'taskClass' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (_: any, record: any) => (record.status === 1 ? '启用' : '禁用'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <div>
          <Button type="text" icon={<EyeOutlined />} onClick={() => navigate(`/system/task/detail/${record.id}`)}>详情</Button>
          <Button type="text" icon={<EditOutlined />} onClick={() => navigate(`/system/task/edit/${record.id}`)}>编辑</Button>
          <Button type="text" danger icon={<DeleteOutlined />} loading={deleteHook.loading} onClick={() => handleDelete(record.id)}>删除</Button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer ghost header={{ title: '定时任务管理', extra: [<Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/system/task/create')}>新建定时任务</Button>] }}>
      <ProTable columns={columns} dataSource={taskList} rowKey="id" loading={loading} rowSelection={{ selectedRowKeys, onChange: (keys) => setSelectedRowKeys(keys) }} toolBarRender={() => [selectedRowKeys.length > 0 && <Button key="batchDelete" danger onClick={handleBatchDelete} loading={batchDeleteHook.loading}>批量删除</Button>]} />
    </PageContainer>
  );
};

export default TaskList;
