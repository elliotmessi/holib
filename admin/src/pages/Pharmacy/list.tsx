import { PageContainer, ProTable, ProColumns } from '@ant-design/pro-components';
import React from 'react';
import { Button, Modal } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from '@umijs/max';
import { Access, useAccess, useModel } from '@umijs/max';
import { Pharmacy } from '@/services/pharmacy';

const PharmacyList: React.FC = () => {
  const navigate = useNavigate();
  const access = useAccess();
  const { usePharmacyList, useDeletePharmacy, useBatchDeletePharmacy } = useModel('pharmacy');
  const { data: pharmacyList, loading, total, page, pageSize, refresh } = usePharmacyList();
  const { submitDelete, loading: deleteLoading } = useDeletePharmacy({
    success: () => refresh(),
  });
  const { submitBatchDelete, loading: batchDeleteLoading } = useBatchDeletePharmacy({
    success: () => refresh(),
  });

  const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该药房吗？此操作不可恢复。',
      onOk: () => submitDelete(id),
    });
  };

  const handleBatchDelete = () => {
    Modal.confirm({
      title: '确认批量删除',
      content: `确定要删除选中的 ${selectedRowKeys.length} 个药房吗？此操作不可恢复。`,
      onOk: () => submitBatchDelete(selectedRowKeys as number[]),
    });
  };

  const columns: ProColumns<Pharmacy>[] = [
    {
      title: '药房名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '药房编码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '所属医院',
      dataIndex: 'hospitalName',
      key: 'hospitalName',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '联系人',
      dataIndex: 'contact',
      key: 'contact',
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
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
      render: (_: any, record: Pharmacy) => (
        <div>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/pharmacy/detail/${record.id}`)}
          >
            详情
          </Button>
          <Access accessible={access.hasPermission('hospital:pharmacy:update')}>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => navigate(`/pharmacy/edit/${record.id}`)}
            >
              编辑
            </Button>
          </Access>
          <Access accessible={access.hasPermission('hospital:pharmacy:delete')}>
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
        title: '药房管理',
        extra: [
          <Access key="create" accessible={access.hasPermission('hospital:pharmacy:create')}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/pharmacy/create')}
            >
              新建药房
            </Button>
          </Access>,
        ],
      }}
    >
      <ProTable
        columns={columns}
        dataSource={pharmacyList}
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

export default PharmacyList;
