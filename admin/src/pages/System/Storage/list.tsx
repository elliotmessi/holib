import { PageContainer, ProTable } from '@ant-design/pro-components';
import React from 'react';
import { Button, message } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'umi';

const StorageList: React.FC = () => {
  const navigate = useNavigate();

  // 模拟数据
  const dataSource = [
    {
      id: '1',
      storageName: '本地存储',
      storageType: 'local',
      storagePath: '/data/storage',
      status: '1',
      createBy: 'admin',
      createTime: '2026-01-01 10:00:00',
      remark: '本地文件存储',
    },
    {
      id: '2',
      storageName: '云存储',
      storageType: 'cloud',
      storagePath: 'https://cloud.storage.com',
      status: '1',
      createBy: 'admin',
      createTime: '2026-01-02 11:00:00',
      remark: '云存储服务',
    },
  ];

  const columns = [
    {
      title: '存储名称',
      dataIndex: 'storageName',
      key: 'storageName',
    },
    {
      title: '存储类型',
      dataIndex: 'storageType',
      key: 'storageType',
      render: (type: string) => (type === 'local' ? '本地存储' : '云存储'),
    },
    {
      title: '存储路径',
      dataIndex: 'storagePath',
      key: 'storagePath',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (status === '1' ? '启用' : '禁用'),
    },
    {
      title: '创建人',
      dataIndex: 'createBy',
      key: 'createBy',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <div>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/system/storage/detail/${record.id}`)}
          >
            详情
          </Button>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => navigate(`/system/storage/edit/${record.id}`)}
          >
            编辑
          </Button>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => message.success('删除成功')}
          >
            删除
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer
      ghost
      header={{
        title: '存储管理',
        extra: [
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/system/storage/create')}
          >
            新建存储
          </Button>,
        ],
      }}
    >
      <ProTable
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        pagination={{
          pageSize: 10,
        }}
      />
    </PageContainer>
  );
};

export default StorageList;