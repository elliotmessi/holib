import { PageContainer, ProTable } from '@ant-design/pro-components';
import React from 'react';
import { Button, message } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'umi';

const ParamConfigList: React.FC = () => {
  const navigate = useNavigate();

  // 模拟数据
  const dataSource = [
    {
      id: '1',
      paramName: '系统名称',
      paramKey: 'system.name',
      paramValue: '医院管理系统',
      status: '1',
      createBy: 'admin',
      createTime: '2026-01-01 10:00:00',
      remark: '系统显示名称',
    },
    {
      id: '2',
      paramName: '系统版本',
      paramKey: 'system.version',
      paramValue: '1.0.0',
      status: '1',
      createBy: 'admin',
      createTime: '2026-01-02 11:00:00',
      remark: '系统版本号',
    },
  ];

  const columns = [
    {
      title: '参数名称',
      dataIndex: 'paramName',
      key: 'paramName',
    },
    {
      title: '参数键',
      dataIndex: 'paramKey',
      key: 'paramKey',
    },
    {
      title: '参数值',
      dataIndex: 'paramValue',
      key: 'paramValue',
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
            onClick={() => navigate(`/system/param-config/detail/${record.id}`)}
          >
            详情
          </Button>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => navigate(`/system/param-config/edit/${record.id}`)}
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
        title: '参数配置',
        extra: [
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/system/param-config/create')}
          >
            新建参数
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

export default ParamConfigList;