import { PageContainer, ProTable, ProColumns } from '@ant-design/pro-components';
import React from 'react';
import { Button, Modal } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from '@umijs/max';
import { useModel } from '@umijs/max';
import { useState } from 'react';

const ParamConfigList: React.FC = () => {
  const navigate = useNavigate();
  const { useSystemParamList, useDeleteSystemParam, useBatchDeleteSystemParam } = useModel('system');
  const result = useSystemParamList();
  const { data: paramConfigList, loading, refresh } = result;
  const { submitDelete, loading: deleteLoading } = useDeleteSystemParam({ success: () => refresh() });
  const { submitBatchDelete, loading: batchDeleteLoading } = useBatchDeleteSystemParam({ success: () => refresh() });

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该参数配置吗？',
      onOk: () => submitDelete(id),
    });
  };

  const handleBatchDelete = () => {
    Modal.confirm({
      title: '确认批量删除',
      content: `确定要删除选中的 ${selectedRowKeys.length} 个参数配置吗？`,
      onOk: () => submitBatchDelete(selectedRowKeys as number[]),
    });
  };

  const columns: ProColumns[] = [
    { title: '参数名称', dataIndex: 'paramName', key: 'paramName' },
    { title: '参数键', dataIndex: 'paramKey', key: 'paramKey' },
    { title: '参数值', dataIndex: 'paramValue', key: 'paramValue' },
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
          <Button type="text" icon={<EyeOutlined />} onClick={() => navigate(`/system/paramConfig/detail/${record.id}`)}>详情</Button>
          <Button type="text" icon={<EditOutlined />} onClick={() => navigate(`/system/paramConfig/edit/${record.id}`)}>编辑</Button>
          <Button type="text" danger icon={<DeleteOutlined />} loading={deleteLoading} onClick={() => handleDelete(record.id)}>删除</Button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer ghost header={{ title: '参数配置管理', extra: [<Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/system/paramConfig/create')}>新建参数配置</Button>] }}>
      <ProTable columns={columns} dataSource={paramConfigList} rowKey="id" loading={loading} rowSelection={{ selectedRowKeys, onChange: (keys) => setSelectedRowKeys(keys) }} toolBarRender={() => [selectedRowKeys.length > 0 && <Button key="batchDelete" danger onClick={handleBatchDelete} loading={batchDeleteLoading}>批量删除</Button>]} />
    </PageContainer>
  );
};

export default ParamConfigList;
