import { PageContainer, ProTable, ProColumns } from '@ant-design/pro-components';
import React from 'react';
import { Button, Modal } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from '@umijs/max';
import { useModel } from '@umijs/max';
import { useState } from 'react';

const StorageList: React.FC = () => {
  const navigate = useNavigate();
  const { useStorageList, useDeleteStorage, useBatchDeleteStorage } = useModel('system') as any;
  const result = useStorageList ? useStorageList() : { data: [], loading: false, refresh: () => {} };
  
  const { data: storageList = [], loading = false, refresh } = result;
  const deleteHook = useDeleteStorage ? useDeleteStorage({ success: () => refresh() }) : { submitDelete: () => {}, loading: false };
  const batchDeleteHook = useBatchDeleteStorage ? useBatchDeleteStorage({ success: () => refresh() }) : { submitBatchDelete: () => {}, loading: false };

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该存储配置吗？',
      onOk: () => deleteHook.submitDelete(id),
    });
  };

  const handleBatchDelete = () => {
    Modal.confirm({
      title: '确认批量删除',
      content: `确定要删除选中的 ${selectedRowKeys.length} 个存储配置吗？`,
      onOk: () => batchDeleteHook.submitBatchDelete(selectedRowKeys as string[]),
    });
  };

  const columns: ProColumns[] = [
    { title: '存储名称', dataIndex: 'storageName', key: 'storageName' },
    {
      title: '存储类型',
      dataIndex: 'storageType',
      key: 'storageType',
      render: (_: any, record: any) => (record.storageType === 'local' ? '本地存储' : '云存储'),
    },
    { title: '存储路径', dataIndex: 'storagePath', key: 'storagePath' },
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
          <Button type="text" icon={<EyeOutlined />} onClick={() => navigate(`/system/storage/detail/${record.id}`)}>详情</Button>
          <Button type="text" icon={<EditOutlined />} onClick={() => navigate(`/system/storage/edit/${record.id}`)}>编辑</Button>
          <Button type="text" danger icon={<DeleteOutlined />} loading={deleteHook.loading} onClick={() => handleDelete(record.id)}>删除</Button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer ghost header={{ title: '存储配置管理', extra: [<Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/system/storage/create')}>新建存储配置</Button>] }}>
      <ProTable columns={columns} dataSource={storageList} rowKey="id" loading={loading} rowSelection={{ selectedRowKeys, onChange: (keys) => setSelectedRowKeys(keys) }} toolBarRender={() => [selectedRowKeys.length > 0 && <Button key="batchDelete" danger onClick={handleBatchDelete} loading={batchDeleteHook.loading}>批量删除</Button>]} />
    </PageContainer>
  );
};

export default StorageList;
