import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Modal, message } from 'antd';
import React, { useState } from 'react';
import { useModel } from '@umijs/max';
import { history } from '@@/core/history';

const PatientList: React.FC = () => {
  const { usePatientList, useDeletePatient, useBatchDeletePatient } = useModel('patient');
  
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  
  // 获取患者列表
  const { patientList, total, loading, pagination, refresh } = usePatientList();
  
  // 删除患者
  const { submitDelete, loading: deleteLoading } = useDeletePatient({
    success: refresh
  });
  
  // 批量删除患者
  const { submitBatchDelete, loading: batchDeleteLoading } = useBatchDeletePatient({
    success: refresh
  });
  
  // 列配置
  const columns = [
    {
      title: '患者姓名',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: '病历号',
      dataIndex: 'medicalRecordNumber',
      key: 'medicalRecordNumber',
      ellipsis: true,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      valueEnum: {
        1: { text: '男', status: 'Default' },
        2: { text: '女', status: 'Default' },
      },
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
      ellipsis: true,
    },
    {
      title: '身份证号',
      dataIndex: 'idCard',
      key: 'idCard',
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
          onClick={() => history.push(`/patient/detail/${record.id}`)}
        >
          详情
        </Button>,
        <Button
          key="edit"
          type="link"
          onClick={() => history.push(`/patient/edit/${record.id}`)}
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
              content: `确定要删除患者「${record.name}」吗？`,
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
        label: '患者姓名',
        valueType: 'text',
      },
      {
        name: 'medicalRecordNumber',
        label: '病历号',
        valueType: 'text',
      },
      {
        name: 'phone',
        label: '联系电话',
        valueType: 'text',
      },
      {
        name: 'idCard',
        label: '身份证号',
        valueType: 'text',
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
    <PageContainer title="患者管理">
      <ProTable
        rowKey="id"
        columns={columns}
        dataSource={patientList}
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
            onClick={() => history.push('/patient/create')}
          >
            新建患者
          </Button>,
          selectedRows.length > 0 && (
            <Button
              type="default"
              danger
              key="batchDelete"
              onClick={() => {
                Modal.confirm({
                  title: '确认批量删除',
                  content: `确定要删除选中的 ${selectedRows.length} 个患者吗？`,
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

export default PatientList;