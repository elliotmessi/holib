import { PageContainer, ProTable, ProColumns } from '@ant-design/pro-components';
import React from 'react';
import { Button, Modal } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from '@umijs/max';
import { useModel } from '@umijs/max';
import { useState } from 'react';

const DictItemList: React.FC = () => {
  const navigate = useNavigate();
  const { useDictItemList, useDeleteDictItem, useBatchDeleteDictItem } = useModel('system');
  const result = useDictItemList();
  const { data: dictItemList, loading, refresh } = result;
  const { submitDelete, loading: deleteLoading } = useDeleteDictItem({ success: () => refresh() });
  const { submitBatchDelete, loading: batchDeleteLoading } = useBatchDeleteDictItem({ success: () => refresh() });

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该字典项吗？',
      onOk: () => submitDelete(id),
    });
  };

  const handleBatchDelete = () => {
    Modal.confirm({
      title: '确认批量删除',
      content: `确定要删除选中的 ${selectedRowKeys.length} 个字典项吗？`,
      onOk: () => submitBatchDelete(selectedRowKeys as number[]),
    });
  };

  const columns: ProColumns[] = [
    {
      title: '字典类型',
      dataIndex: 'typeCode',
      key: 'typeCode',
    },
    {
      title: '字典项名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '字典项值',
      dataIndex: 'value',
      key: 'value',
    },
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
          <Button type="text" icon={<EyeOutlined />} onClick={() => navigate(`/system/dictItem/detail/${record.id}`)}>详情</Button>
          <Button type="text" icon={<EditOutlined />} onClick={() => navigate(`/system/dictItem/edit/${record.id}`)}>编辑</Button>
          <Button type="text" danger icon={<DeleteOutlined />} loading={deleteLoading} onClick={() => handleDelete(record.id)}>删除</Button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer ghost header={{ title: '字典数据管理', extra: [<Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/system/dictItem/create')}>新建字典项</Button>] }}>
      <ProTable
        columns={columns}
        dataSource={dictItemList}
        rowKey="id"
        loading={loading}
        rowSelection={{ selectedRowKeys, onChange: (keys) => setSelectedRowKeys(keys) }}
        toolBarRender={() => [selectedRowKeys.length > 0 && <Button key="batchDelete" danger onClick={handleBatchDelete} loading={batchDeleteLoading}>批量删除</Button>]}
      />
    </PageContainer>
  );
};

export default DictItemList;
