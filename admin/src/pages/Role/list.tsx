import { PageContainer, ProTable } from '@ant-design/pro-components';
import React from 'react';
import { Button, message } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'umi';

const RoleList: React.FC = () => {
  const navigate = useNavigate();

  // 模拟数据
  const dataSource = [
    {
      id: '1',
      roleName: '管理员',
      roleKey: 'admin',
      status: '1',
      createBy: 'system',
      createTime: '2026-01-01 10:00:00',
      remark: '系统管理员角色',
    },
    {
      id: '2',
      roleName: '医生',
      roleKey: 'doctor',
      status: '1',
      createBy: 'admin',
      createTime: '2026-01-02 11:00:00',
      remark: '医生角色',
    },
  ];

  const columns = [
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName',
    },
    {
      title: '角色标识',
      dataIndex: 'roleKey',
      key: 'roleKey',
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
            onClick={() => navigate(`/role/detail/${record.id}`)}
          >
            详情
          </Button>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => navigate(`/role/edit/${record.id}`)}
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
        title: '角色管理',
        extra: [
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/role/create')}
          >
            新建角色
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

export default RoleList;