import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Modal, Form, Input, Select, message, TreeSelect } from 'antd';
import React, { useState } from 'react';
import { useModel } from '@umijs/max';

const RoleList: React.FC = () => {
  const { useRoleList, useCreateRole, useUpdateRole, useDeleteRole, useBatchDeleteRole } = useModel('role');
  
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  
  // 获取角色列表
  const { roleList, total, loading, pagination, refresh } = useRoleList();
  
  // 创建角色
  const { submitCreate, loading: createLoading } = useCreateRole({
    success: () => {
      setCreateModalVisible(false);
      form.resetFields();
      refresh();
    }
  });
  
  // 更新角色
  const { submitUpdate, loading: updateLoading } = useUpdateRole({
    success: () => {
      setUpdateModalVisible(false);
      updateForm.resetFields();
      setSelectedRow(null);
      refresh();
    }
  });
  
  // 删除角色
  const { submitDelete, loading: deleteLoading } = useDeleteRole({
    success: refresh
  });
  
  // 批量删除角色
  const { submitBatchDelete, loading: batchDeleteLoading } = useBatchDeleteRole({
    success: refresh
  });
  
  // 列配置
  const columns = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: '角色编码',
      dataIndex: 'code',
      key: 'code',
      ellipsis: true,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
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
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      valueType: 'dateTime',
    },
    {
      title: '操作',
      key: 'action',
      valueType: 'option',
      render: (_: any, record: any) => [
        <Button
          key="update"
          type="link"
          onClick={() => {
            setSelectedRow(record);
            updateForm.setFieldsValue(record);
            setUpdateModalVisible(true);
          }}
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
              content: `确定要删除角色「${record.name}」吗？`,
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
        label: '角色名称',
        valueType: 'text',
      },
      {
        name: 'code',
        label: '角色编码',
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
    <PageContainer title="角色管理">
      <ProTable
        rowKey="id"
        columns={columns}
        dataSource={roleList}
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
            onClick={() => setCreateModalVisible(true)}
          >
            新建角色
          </Button>,
          selectedRows.length > 0 && (
            <Button
              type="default"
              danger
              key="batchDelete"
              onClick={() => {
                Modal.confirm({
                  title: '确认批量删除',
                  content: `确定要删除选中的 ${selectedRows.length} 个角色吗？`,
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
      
      {/* 创建角色弹窗 */}
      <Modal
        title="新建角色"
        open={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            submitCreate(values);
          }}
        >
          <Form.Item
            name="name"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item
            name="code"
            label="角色编码"
            rules={[{ required: true, message: '请输入角色编码' }]}
          >
            <Input placeholder="请输入角色编码" />
          </Form.Item>
          <Form.Item
            name="description"
            label="描述"
          >
            <Input.TextArea placeholder="请输入角色描述" rows={4} />
          </Form.Item>
          <Form.Item
            name="permissions"
            label="权限"
            rules={[{ required: true, message: '请选择权限' }]}
          >
            <TreeSelect
              placeholder="请选择权限"
              treeData={[
                {
                  title: '系统管理',
                  value: 'system',
                  children: [
                    { title: '用户管理', value: 'system:user' },
                    { title: '角色管理', value: 'system:role' },
                    { title: '菜单管理', value: 'system:menu' },
                  ],
                },
                {
                  title: '医院管理',
                  value: 'hospital',
                  children: [
                    { title: '医院信息', value: 'hospital:hospital' },
                    { title: '科室管理', value: 'hospital:department' },
                    { title: '医生管理', value: 'hospital:doctor' },
                    { title: '患者管理', value: 'hospital:patient' },
                  ],
                },
              ]}
              treeCheckable
              maxTagCount={3}
            />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            initialValue={1}
          >
            <Select
              options={[
                { value: 1, label: '启用' },
                { value: 0, label: '禁用' },
              ]}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={createLoading}>
              确定
            </Button>
            <Button
              style={{ marginLeft: 8 }}
              onClick={() => {
                setCreateModalVisible(false);
                form.resetFields();
              }}
            >
              取消
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      
      {/* 更新角色弹窗 */}
      <Modal
        title="编辑角色"
        open={updateModalVisible}
        onCancel={() => {
          setUpdateModalVisible(false);
          updateForm.resetFields();
          setSelectedRow(null);
        }}
        footer={null}
        width={800}
      >
        <Form
          form={updateForm}
          layout="vertical"
          onFinish={(values) => {
            if (selectedRow) {
              submitUpdate(selectedRow.id, values);
            }
          }}
        >
          <Form.Item
            name="name"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item
            name="code"
            label="角色编码"
            rules={[{ required: true, message: '请输入角色编码' }]}
          >
            <Input placeholder="请输入角色编码" />
          </Form.Item>
          <Form.Item
            name="description"
            label="描述"
          >
            <Input.TextArea placeholder="请输入角色描述" rows={4} />
          </Form.Item>
          <Form.Item
            name="permissions"
            label="权限"
            rules={[{ required: true, message: '请选择权限' }]}
          >
            <TreeSelect
              placeholder="请选择权限"
              treeData={[
                {
                  title: '系统管理',
                  value: 'system',
                  children: [
                    { title: '用户管理', value: 'system:user' },
                    { title: '角色管理', value: 'system:role' },
                    { title: '菜单管理', value: 'system:menu' },
                  ],
                },
                {
                  title: '医院管理',
                  value: 'hospital',
                  children: [
                    { title: '医院信息', value: 'hospital:hospital' },
                    { title: '科室管理', value: 'hospital:department' },
                    { title: '医生管理', value: 'hospital:doctor' },
                    { title: '患者管理', value: 'hospital:patient' },
                  ],
                },
              ]}
              treeCheckable
              maxTagCount={3}
            />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
          >
            <Select
              options={[
                { value: 1, label: '启用' },
                { value: 0, label: '禁用' },
              ]}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={updateLoading}>
              确定
            </Button>
            <Button
              style={{ marginLeft: 8 }}
              onClick={() => {
                setUpdateModalVisible(false);
                updateForm.resetFields();
                setSelectedRow(null);
              }}
            >
              取消
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default RoleList;