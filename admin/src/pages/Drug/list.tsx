import { PageContainer, ProTable, ProColumns } from '@ant-design/pro-components';
import React from 'react';
import { Button, Modal } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from '@umijs/max';
import { Access, useAccess, useModel } from '@umijs/max';
import { Drug } from '@/services/drug';

const DrugList: React.FC = () => {
  const navigate = useNavigate();
  const access = useAccess();
  const { useDrugList, useDeleteDrug, useBatchDeleteDrug } = useModel('drug');
  const { data: drugList, loading, total, page, pageSize, refresh } = useDrugList();
  const { submitDelete, loading: deleteLoading } = useDeleteDrug({
    success: () => refresh(),
  });
  const { submitBatchDelete, loading: batchDeleteLoading } = useBatchDeleteDrug({
    success: () => refresh(),
  });

  const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该药品吗？此操作不可恢复。',
      onOk: () => submitDelete(id),
    });
  };

  const handleBatchDelete = () => {
    Modal.confirm({
      title: '确认批量删除',
      content: `确定要删除选中的 ${selectedRowKeys.length} 个药品吗？此操作不可恢复。`,
      onOk: () => submitBatchDelete(selectedRowKeys as number[]),
    });
  };

  const columns: ProColumns<Drug>[] = [
    {
      title: '药品名称',
      dataIndex: 'genericName',
      key: 'genericName',
    },
    {
      title: '商品名',
      dataIndex: 'tradeName',
      key: 'tradeName',
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
      title: '剂型',
      dataIndex: 'dosageForm',
      key: 'dosageForm',
    },
    {
      title: '生产厂家',
      dataIndex: 'manufacturer',
      key: 'manufacturer',
    },
    {
      title: '零售价',
      dataIndex: 'retailPrice',
      key: 'retailPrice',
      valueType: 'money',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      valueEnum: {
        normal: { text: '正常', status: 'Success' },
        stopped: { text: '停用', status: 'Error' },
        out_of_stock: { text: '缺货', status: 'Warning' },
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
      render: (_: any, record: Drug) => (
        <div>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/drug/detail/${record.id}`)}
          >
            详情
          </Button>
          <Access accessible={access.hasPermission('drug:drug:update')}>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => navigate(`/drug/edit/${record.id}`)}
            >
              编辑
            </Button>
          </Access>
          <Access accessible={access.hasPermission('drug:drug:delete')}>
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
        title: '药品管理',
        extra: [
          <Access key="create" accessible={access.hasPermission('drug:drug:create')}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/drug/create')}
            >
              新建药品
            </Button>
          </Access>,
        ],
      }}
    >
      <ProTable
        columns={columns}
        dataSource={drugList}
        rowKey="drugId"
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

export default DrugList;
