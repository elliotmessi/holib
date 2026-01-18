import { PageContainer, ProTable, ProColumns } from '@ant-design/pro-components';
import React from 'react';
import { Button, Modal } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from '@umijs/max';
import { Access, useAccess, useModel } from '@umijs/max';
import { Doctor } from '@/services/doctor';

const DoctorList: React.FC = () => {
  const navigate = useNavigate();
  const access = useAccess();
  const { useDoctorList, useDeleteDoctor, useBatchDeleteDoctor } = useModel('doctor');
  const { data: doctorList, loading, total, page, pageSize, refresh } = useDoctorList();
  const { submitDelete, loading: deleteLoading } = useDeleteDoctor({
    success: () => refresh(),
  });
  const { submitBatchDelete, loading: batchDeleteLoading } = useBatchDeleteDoctor({
    success: () => refresh(),
  });

  const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该医生吗？此操作不可恢复。',
      onOk: () => submitDelete(id),
    });
  };

  const handleBatchDelete = () => {
    Modal.confirm({
      title: '确认批量删除',
      content: `确定要删除选中的 ${selectedRowKeys.length} 个医生吗？此操作不可恢复。`,
      onOk: () => submitBatchDelete(selectedRowKeys as number[]),
    });
  };

  const columns: ProColumns<Doctor>[] = [
    {
      title: '医生姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '医生编码',
      dataIndex: 'code',
      key: 'code',
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
    },
    {
      title: '所属科室',
      dataIndex: 'departmentName',
      key: 'departmentName',
    },
    {
      title: '职称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '专长',
      dataIndex: 'specialty',
      key: 'specialty',
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
      render: (_: any, record: Doctor) => (
        <div>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/doctor/detail/${record.id}`)}
          >
            详情
          </Button>
          <Access accessible={access.hasPermission('hospital:doctor:update')}>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => navigate(`/doctor/edit/${record.id}`)}
            >
              编辑
            </Button>
          </Access>
          <Access accessible={access.hasPermission('hospital:doctor:delete')}>
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
        title: '医生管理',
        extra: [
          <Access key="create" accessible={access.hasPermission('hospital:doctor:create')}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/doctor/create')}
            >
              新建医生
            </Button>
          </Access>,
        ],
      }}
    >
      <ProTable
        columns={columns}
        dataSource={doctorList}
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

export default DoctorList;
