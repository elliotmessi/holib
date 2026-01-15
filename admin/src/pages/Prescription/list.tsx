import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Modal, message } from 'antd';
import React, { useState } from 'react';
import { useModel } from '@umijs/max';
import { history } from '@@/core/history';

const PrescriptionList: React.FC = () => {
  const { usePrescriptionList, useDeletePrescription, useBatchDeletePrescription } = useModel('prescription');
  
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  
  // 获取处方列表
  const { prescriptionList, total, loading, pagination, refresh } = usePrescriptionList();
  
  // 删除处方
  const { submitDelete, loading: deleteLoading } = useDeletePrescription({
    success: refresh
  });
  
  // 批量删除处方
  const { submitBatchDelete, loading: batchDeleteLoading } = useBatchDeletePrescription({
    success: refresh
  });
  
  // 列配置
  const columns = [
    {
      title: '处方编号',
      dataIndex: 'prescriptionNumber',
      key: 'prescriptionNumber',
      ellipsis: true,
    },
    {
      title: '患者姓名',
      dataIndex: 'patientName',
      key: 'patientName',
      ellipsis: true,
    },
    {
      title: '医生姓名',
      dataIndex: 'doctorName',
      key: 'doctorName',
      ellipsis: true,
    },
    {
      title: '所属科室',
      dataIndex: 'departmentName',
      key: 'departmentName',
      ellipsis: true,
    },
    {
      title: '诊断',
      dataIndex: 'diagnosis',
      key: 'diagnosis',
      ellipsis: true,
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
      valueType: 'option',
      render: (_: any, record: any) => [
        <Button
          key="detail"
          type="link"
          onClick={() => history.push(`/prescription/detail/${record.id}`)}
        >
          详情
        </Button>,
        <Button
          key="edit"
          type="link"
          onClick={() => history.push(`/prescription/edit/${record.id}`)}
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
              content: `确定要删除处方「${record.prescriptionNumber}」吗？`,
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
        name: 'prescriptionNumber',
        label: '处方编号',
        valueType: 'text',
      },
      {
        name: 'patientName',
        label: '患者姓名',
        valueType: 'text',
      },
      {
        name: 'doctorName',
        label: '医生姓名',
        valueType: 'text',
      },
      {
        name: 'departmentId',
        label: '所属科室',
        valueType: 'select',
      },
      {
        name: 'status',
        label: '状态',
        valueType: 'select',
        valueEnum: {
          pending: { text: '待审核' },
          approved: { text: '已审核' },
          rejected: { text: '已拒绝' },
          completed: { text: '已完成' },
        },
      },
    ],
  };
  
  return (
    <PageContainer title="处方管理">
      <ProTable
        rowKey="id"
        columns={columns}
        dataSource={prescriptionList}
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
            onClick={() => history.push('/prescription/create')}
          >
            新建处方
          </Button>,
          selectedRows.length > 0 && (
            <Button
              type="default"
              danger
              key="batchDelete"
              onClick={() => {
                Modal.confirm({
                  title: '确认批量删除',
                  content: `确定要删除选中的 ${selectedRows.length} 个处方吗？`,
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

export default PrescriptionList;