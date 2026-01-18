import { PageContainer, ProTable, ProColumns } from '@ant-design/pro-components';
import React from 'react';
import { Button, Modal } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from '@umijs/max';
import { useModel } from '@umijs/max';
import { useState } from 'react';

const DictTypeList: React.FC = () => {
  const navigate = useNavigate();
  const { useDictTypeList, useDeleteDictType, useBatchDeleteDictType } = useModel('system');
  const result = useDictTypeList();
  const { data: dictTypeList, loading, refresh } = result;
  const { submitDelete, loading: deleteLoading } = useDeleteDictType({ success: () => refresh() });
  const { submitBatchDelete, loading: batchDeleteLoading } = useBatchDeleteDictType({ success: () => refresh() });

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该字典类型吗？',
      onOk: () => submitDelete(id),
    });
  };

  const handleBatchDelete = () => {
    Modal.confirm({
      title: '确认批量删除',
      content: `确定要删除选中的 ${selectedRowKeys.length} 个字典类型吗？`,
      onOk: () => submitBatchDelete(selectedRowKeys as number[]),
    });
  };

  const columns: ProColumns[] = [
    {
      title: '字典名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '字典类型',
      dataIndex: 'code',
      key: 'code',
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
          <Button type="text" icon={<EyeOutlined />} onClick={() => navigate(`/system/dictType/detail/${record.id}`)}>详情</Button>
          <Button type="text" icon={<EditOutlined />} onClick={() => navigate(`/system/dictType/edit/${record.id}`)}>编辑</Button>
          <Button type="text" danger icon={<DeleteOutlined />} loading={deleteLoading} onClick={() => handleDelete(record.id)}>删除</Button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer ghost header={{ title: '字典类型管理', extra: [<Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/system/dictType/create')}>新建字典类型</Button>] }}>
      <ProTable
        columns={columns}
        dataSource={dictTypeList}
        rowKey="id"
        loading={loading}
        rowSelection={{ selectedRowKeys, onChange: (keys) => setSelectedRowKeys(keys) }}
        toolBarRender={() => [selectedRowKeys.length > 0 && <Button key="batchDelete" danger onClick={handleBatchDelete} loading={batchDeleteLoading}>批量删除</Button>]}
      />
    </PageContainer>
  );
};

export default DictTypeList;
