import { PageContainer, ProTable, ProColumns } from '@ant-design/pro-components';
import React from 'react';
import { Button, Modal } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from '@umijs/max';
import { Access, useAccess } from '@umijs/max';
import { useModel } from '@umijs/max';
import { Hospital } from '@/services/hospital';

const HospitalList: React.FC = () => {
  const navigate = useNavigate();
  const access = useAccess();
  const { useHospitalList, useDeleteHospital } = useModel('hospital');
  const { data: hospitalList, loading, pagination, refresh } = useHospitalList();
  const { submitDelete, loading: deleteLoading } = useDeleteHospital({
    success: () => refresh(),
  });

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该医院吗？此操作不可恢复。',
      onOk: () => submitDelete(id),
    });
  };

  const columns: ProColumns<Hospital>[] = [
    {
      title: '医院名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '医院编码',
      dataIndex: 'hospitalCode',
      key: 'hospitalCode',
    },
    {
      title: '地址',
      dataIndex: 'address',
    },
    {
      title: '联系人',
      dataIndex: 'contactPerson',
    },
    {
      title: '电话',
      dataIndex: 'phone',
    },
    {
      title: '医院等级',
      dataIndex: 'level',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Hospital) => (
        <div>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/hospital/detail/${record.id}`)}
          >
            详情
          </Button>
          <Access accessible={access.hasPermission('hospital:hospital:update')}>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => navigate(`/hospital/edit/${record.id}`)}
            >
              编辑
            </Button>
          </Access>
          <Access accessible={access.hasPermission('hospital:hospital:delete')}>
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
        title: '医院管理',
        extra: [
          <Access key="create" accessible={access.hasPermission('hospital:hospital:create')}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/hospital/create')}
            >
              新建医院
            </Button>
          </Access>,
        ],
      }}
    >
      <ProTable
        columns={columns}
        dataSource={hospitalList}
        rowKey="id"
        loading={loading}
        pagination={pagination}
      />
    </PageContainer>
  );
};

export default HospitalList;