import { PageContainer, ProTable } from '@ant-design/pro-components';
import React from 'react';
import { Button, message } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'umi';

const DictTypeList: React.FC = () => {
  const navigate = useNavigate();

  // 模拟数据
  const dataSource = [
    {
      id: '1',
      dictName: '用户状态',
      dictType: 'user_status',
      status: '1',
      createBy: 'admin',
      createTime: '2026-01-01 10:00:00',
      remark: '用户状态字典',
    },
    {
      id: '2',
      dictName: '角色类型',
      dictType: 'role_type',
      status: '1',
      createBy: 'admin',
      createTime: '2026-01-02 11:00:00',
      remark: '角色类型字典',
    },
  ];

  const columns = [
    {
      title: '字典名称',
      dataIndex: 'dictName',
      key: 'dictName',
    },
    {
      title: '字典类型',
      dataIndex: 'dictType',
      key: 'dictType',
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
            onClick={() => navigate(`/system/dict-type/detail/${record.id}`)}
          >
            详情
          </Button>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => navigate(`/system/dict-type/edit/${record.id}`)}
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
        title: '字典管理',
        extra: [
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/system/dict-type/create')}
          >
            新建字典
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

export default DictTypeList;