import { PageContainer, ProTable, ProColumns } from '@ant-design/pro-components';
import React from 'react';
import { Button, Modal } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, EyeOutlined, ImportOutlined, ExportOutlined } from '@ant-design/icons';
import { useNavigate } from '@umijs/max';
import { Access, useAccess, useModel } from '@umijs/max';
import { Inventory } from '@/services/inventory';

const InventoryList: React.FC = () => {
  const navigate = useNavigate();
  const access = useAccess();
  const { useInventoryList, useDeleteInventory, useBatchDeleteInventory } = useModel('inventory');
  const { data: inventoryList, loading, total, page, pageSize, refresh } = useInventoryList();
  const { submitDelete, loading: deleteLoading } = useDeleteInventory({
    success: () => refresh(),
  });
  const { submitBatchDelete, loading: batchDeleteLoading } = useBatchDeleteInventory({
    success: () => refresh(),
  });

  const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该库存记录吗？此操作不可恢复。',
      onOk: () => submitDelete(id),
    });
  };

  const handleBatchDelete = () => {
    Modal.confirm({
      title: '确认批量删除',
      content: `确定要删除选中的 ${selectedRowKeys.length} 条库存记录吗？此操作不可恢复。`,
      onOk: () => submitBatchDelete(selectedRowKeys as number[]),
    });
  };

  const columns: ProColumns<Inventory>[] = [
    {
      title: '药品名称',
      dataIndex: 'drugName',
      key: 'drugName',
    },
    {
      title: '药品编码',
      dataIndex: 'drugCode',
      key: 'drugCode',
    },
    {
      title: '规格',
      dataIndex: 'specification',
      key: 'specification',
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
    },
    {
      title: '所属药房',
      dataIndex: 'pharmacyName',
      key: 'pharmacyName',
    },
    {
      title: '批次号',
      dataIndex: 'batchNo',
      key: 'batchNo',
    },
    {
      title: '有效期',
      dataIndex: 'expirationDate',
      key: 'expirationDate',
      valueType: 'date',
    },
    {
      title: '库存数量',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: '最低库存',
      dataIndex: 'minQuantity',
      key: 'minQuantity',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      valueType: 'money',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      valueEnum: {
        1: { text: '正常', status: 'Success' },
        0: { text: '禁用', status: 'Error' },
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Inventory) => (
        <div>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/inventory/detail/${record.id}`)}
          >
            详情
          </Button>
          <Access accessible={access.hasPermission('inventory:inventory:update')}>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => navigate(`/inventory/edit/${record.id}`)}
            >
              编辑
            </Button>
          </Access>
          <Access accessible={access.hasPermission('inventory:inventory:delete')}>
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              loading={deleteLoading}
              onClick={() => handleDelete(record.id)}
            >
              删除
            </Button>
          </Access>
        </div>
      ),
    },
  ];

  return (
    <PageContainer
      ghost
      header={{
        title: '库存管理',
        extra: [
          <Access key="inbound" accessible={access.hasPermission('inventory:inventory:inbound')}>
            <Button
              icon={<ImportOutlined />}
              onClick={() => navigate('/inventory/inbound')}
            >
              入库
            </Button>
          </Access>,
          <Access key="outbound" accessible={access.hasPermission('inventory:inventory:outbound')}>
            <Button
              icon={<ExportOutlined />}
              onClick={() => navigate('/inventory/outbound')}
            >
              出库
            </Button>
          </Access>,
          <Access key="create" accessible={access.hasPermission('inventory:inventory:create')}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/inventory/create')}
            >
              新建库存
            </Button>
          </Access>,
        ],
      }}
    >
      <ProTable
        columns={columns}
        dataSource={inventoryList}
        rowKey="id"
        loading={loading}
        pagination={{ total, current: page, pageSize }}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys),
        }}
        toolBarRender={() => [
          selectedRowKeys.length > 0 && (
            <Button
              key="batchDelete"
              danger
              onClick={handleBatchDelete}
              loading={batchDeleteLoading}
            >
              批量删除
            </Button>
          ),
        ]}
      />
    </PageContainer>
  );
};

export default InventoryList;
