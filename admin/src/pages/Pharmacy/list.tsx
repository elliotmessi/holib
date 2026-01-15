import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Modal, message } from 'antd';
import React, { useState } from 'react';
import { useModel } from '@umijs/max';
import { history } from '@@/core/history';

const PharmacyList: React.FC = () => {
  const { usePharmacyList, useDeletePharmacy, useBatchDeletePharmacy } = useModel('pharmacy');
  
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  
  // 获取药房列表
  const { pharmacyList, total, loading, pagination, refresh } = usePharmacyList();
  
  // 删除药房
  const { submitDelete, loading: deleteLoading } = useDeletePharmacy({
    success: refresh
  });
  
  // 批量删除药房
  const { submitBatchDelete, loading: batchDeleteLoading } = useBatchDeletePharmacy({
    success: refresh
  });
  
  // 列配置
  const columns = [
    {
      title: '药房名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: '药房编码',
      dataIndex: 'code',
      key: 'code',
      ellipsis: true,
    },
    {
      title: '所属医院',
      dataIndex: 'hospitalName',
      key: 'hospitalName',
      ellipsis: true,
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
    },
    {
      title: '联系人',
      dataIndex: 'contact',
      key: 'contact',
      ellipsis: true,
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      valueEnum: {
        1: { text: '启用', status: 'Success' },
        0: { text: '禁用', status: 'Error' },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      valueType: 'dateTime',
    },
    {
      title: '操作',
      key: 'action',
      valueType: 'option',
      render: (_: any, record: any) => [
        <Button
          key="detail"
          type="link"
          onClick={() => history.push(`/pharmacy/detail/${record.id}`)}
        >
          详情
        </Button>,
        <Button
          key="edit"
          type="link"
          onClick={() => history.push(`/pharmacy/edit/${record.id}`)}
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
              content: `确定要删除药房「${record.name}」吗？`,
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
        name: 'name',
        label: '药房名称',
        valueType: 'text',
      },
      {
        name: 'code',
        label: '药房编码',
        valueType: 'text',
      },
      {
        name: 'hospitalId',
        label: '所属医院',
        valueType: 'select',
      },
      {
        name: 'status',
        label: '状态',
        valueType: 'select',
        valueEnum: {
          1: { text: '启用', status: 'Success' },
          0: { text: '禁用', status: 'Error' },
        },
      },
    ],
  };
  
  return (
    <PageContainer title="药房管理">
      <ProTable
        rowKey="id"
        columns={columns}
        dataSource={pharmacyList}
        pagination={pagination}
        loading={loading}
        rowSelection={{
          onChange: (_, rows) => setSelectedRows(rows),
        }}
        search={searchConfig}
        toolBarRender={() => [
          <Button
            type="primary"
            key="add"
            onClick={() => history.push('/pharmacy/create')}
          >
            新建药房
          </Button>,
          selectedRows.length > 0 && (
            <Button
              type="default"
              danger
              key="batchDelete"
              onClick={() => {
                Modal.confirm({
                  title: '确认批量删除',
                  content: `确定要删除选中的 ${selectedRows.length} 个药房吗？`,
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

export default PharmacyList;