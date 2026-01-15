import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Modal, message } from 'antd';
import React, { useState } from 'react';
import { useModel } from '@umijs/max';
import { history } from '@@/core/history';

const DoctorList: React.FC = () => {
  const { useDoctorList, useDeleteDoctor, useBatchDeleteDoctor } = useModel('doctor');
  
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  
  // 获取医生列表
  const { doctorList, total, loading, pagination, refresh } = useDoctorList();
  
  // 删除医生
  const { submitDelete, loading: deleteLoading } = useDeleteDoctor({
    success: refresh
  });
  
  // 批量删除医生
  const { submitBatchDelete, loading: batchDeleteLoading } = useBatchDeleteDoctor({
    success: refresh
  });
  
  // 列配置
  const columns = [
    {
      title: '医生姓名',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: '医生编码',
      dataIndex: 'code',
      key: 'code',
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
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
      ellipsis: true,
    },
    {
      title: '所属科室',
      dataIndex: 'departmentName',
      key: 'departmentName',
      ellipsis: true,
    },
    {
      title: '职称',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: '专长',
      dataIndex: 'specialty',
      key: 'specialty',
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
          onClick={() => history.push(`/doctor/detail/${record.id}`)}
        >
          详情
        </Button>,
        <Button
          key="edit"
          type="link"
          onClick={() => history.push(`/doctor/edit/${record.id}`)}
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
              content: `确定要删除医生「${record.name}」吗？`,
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
        label: '医生姓名',
        valueType: 'text',
      },
      {
        name: 'code',
        label: '医生编码',
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
          1: { text: '启用', status: 'Success' },
          0: { text: '禁用', status: 'Error' },
        },
      },
    ],
  };
  
  return (
    <PageContainer title="医生管理">
      <ProTable
        rowKey="id"
        columns={columns}
        dataSource={doctorList}
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
            onClick={() => history.push('/doctor/create')}
          >
            新建医生
          </Button>,
          selectedRows.length > 0 && (
            <Button
              type="default"
              danger
              key="batchDelete"
              onClick={() => {
                Modal.confirm({
                  title: '确认批量删除',
                  content: `确定要删除选中的 ${selectedRows.length} 个医生吗？`,
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

export default DoctorList;