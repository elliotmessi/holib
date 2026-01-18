import { PageContainer, ProTable, ProColumns } from '@ant-design/pro-components';
import React from 'react';
import { Button, Modal } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from '@umijs/max';
import { Access, useAccess, useModel } from '@umijs/max';
import { Prescription } from '@/services/prescription';

const PrescriptionList: React.FC = () => {
  const navigate = useNavigate();
  const access = useAccess();
  const { usePrescriptionList, useDeletePrescription, useBatchDeletePrescription } = useModel('prescription');
  const { data: prescriptionList, loading, total, page, pageSize, refresh } = usePrescriptionList();
  const { submitDelete, loading: deleteLoading } = useDeletePrescription({
    success: () => refresh(),
  });
  const { submitBatchDelete, loading: batchDeleteLoading } = useBatchDeletePrescription({
    success: () => refresh(),
  });

  const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该处方吗？此操作不可恢复。',
      onOk: () => submitDelete(id),
    });
  };

  const handleBatchDelete = () => {
    Modal.confirm({
      title: '确认批量删除',
      content: `确定要删除选中的 ${selectedRowKeys.length} 个处方吗？此操作不可恢复。`,
      onOk: () => submitBatchDelete(selectedRowKeys as number[]),
    });
  };

  const columns: ProColumns<Prescription>[] = [
    {
      title: '处方编号',
      dataIndex: 'prescriptionNumber',
      key: 'prescriptionNumber',
    },
    {
      title: '患者姓名',
      dataIndex: 'patientName',
      key: 'patientName',
    },
    {
      title: '医生姓名',
      dataIndex: 'doctorName',
      key: 'doctorName',
    },
    {
      title: '所属科室',
      dataIndex: 'departmentName',
      key: 'departmentName',
    },
    {
      title: '诊断',
      dataIndex: 'diagnosis',
      key: 'diagnosis',
    },
    {
      title: '总金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      valueType: 'money',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      valueEnum: {
        pending: { text: '待审核', status: 'Warning' },
        approved: { text: '已审核', status: 'Success' },
        rejected: { text: '已拒绝', status: 'Error' },
        completed: { text: '已完成', status: 'Default' },
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
      render: (_: any, record: Prescription) => (
        <div>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/prescription/detail/${record.id}`)}
          >
            详情
          </Button>
          <Access accessible={access.hasPermission('prescription:prescription:update')}>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => navigate(`/prescription/edit/${record.id}`)}
            >
              编辑
            </Button>
          </Access>
          <Access accessible={access.hasPermission('prescription:prescription:delete')}>
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
        title: '处方管理',
        extra: [
          <Access key="create" accessible={access.hasPermission('prescription:prescription:create')}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/prescription/create')}
            >
              新建处方
            </Button>
          </Access>,
        ],
      }}
    >
      <ProTable
        columns={columns}
        dataSource={prescriptionList}
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

export default PrescriptionList;
