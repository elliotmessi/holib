import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Modal, message } from 'antd';
import React, { useState } from 'react';
import { useModel } from '@umijs/max';
import { history } from '@@/core/history';

const InventoryList: React.FC = () => {
  const { useInventoryList, useDeleteInventory, useBatchDeleteInventory } = useModel('inventory');
  
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  
  // 获取库存列表
  const { inventoryList, total, loading, pagination, refresh } = useInventoryList();
  
  // 删除库存
  const { submitDelete, loading: deleteLoading } = useDeleteInventory({
    success: refresh
  });
  
  // 批量删除库存
  const { submitBatchDelete, loading: batchDeleteLoading } = useBatchDeleteInventory({
    success: refresh
  });
  
  // 列配置
  const columns = [
    {
      title: '药品名称',
      dataIndex: 'drugName',
      key: 'drugName',
      ellipsis: true,
    },
    {
      title: '药品编码',
      dataIndex: 'drugCode',
      key: 'drugCode',
      ellipsis: true,
    },
    {
      title: '规格',
      dataIndex: 'specification',
      key: 'specification',
      ellipsis: true,
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
      ellipsis: true,
    },
    {
      title: '所属药房',
      dataIndex: 'pharmacyName',
      key: 'pharmacyName',
      ellipsis: true,
    },
    {
      title: '批次号',
      dataIndex: 'batchNo',
      key: 'batchNo',
      ellipsis: true,
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
      valueType: 'option',
      render: (_: any, record: any) => [
        <Button
          key="detail"
          type="link"
          onClick={() => history.push(`/inventory/detail/${record.id}`)}
        >
          详情
        </Button>,
        <Button
          key="edit"
          type="link"
          onClick={() => history.push(`/inventory/edit/${record.id}`)}
        >
          编辑
        </Button>,
        <Button
          key="delete"
          type="link"
          danger
          onClick={() => {
            Modal.confirm({
              title: '确认删除',
              content: `确定要删除库存记录吗？`,
              onOk: () => submitDelete(record.id),
            });
          }}
        >
          删除
        </Button>,
      ],
    },
  ];
  
  // 搜索表单配置
  const searchConfig = {
    labelWidth: 120,
    columns: [
      {
        name: 'drugName',
        label: '药品名称',
        valueType: 'text',
      },
      {
        name: 'drugCode',
        label: '药品编码',
        valueType: 'text',
      },
      {
        name: 'pharmacyId',
        label: '所属药房',
        valueType: 'select',
      },
      {
        name: 'batchNo',
        label: '批次号',
        valueType: 'text',
      },
      {
        name: 'status',
        label: '状态',
        valueType: 'select',
        valueEnum: {
          1: { text: '正常', status: 'Success' },
          0: { text: '禁用', status: 'Error' },
        },
      },
    ],
  };
  
  return (
    <PageContainer title="库存管理">
      <ProTable
        rowKey="id"
        columns={columns}
        dataSource={inventoryList}
        pagination={pagination}
        loading={loading}
        rowSelection={{
          onChange: (_, rows) => setSelectedRows(rows),
        }}
        search={searchConfig}
        toolBarRender={() => [
          <Button
            type="primary"
            key="inbound"
            onClick={() => history.push('/inventory/inbound')}
          >
            入库
          </Button>,
          <Button
            type="default"
            key="outbound"
            onClick={() => history.push('/inventory/outbound')}
          >
            出库
          </Button>,
          selectedRows.length > 0 && (
            <Button
              type="default"
              danger
              key="batchDelete"
              onClick={() => {
                Modal.confirm({
                  title: '确认批量删除',
                  content: `确定要删除选中的 ${selectedRows.length} 条库存记录吗？`,
                  onOk: () => submitBatchDelete(selectedRows.map(row => row.id)),
                });
              }}
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