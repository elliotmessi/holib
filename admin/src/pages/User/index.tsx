import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Modal, Form, Input, Select, message } from 'antd';
import React, { useState } from 'react';
import { useModel } from '@umijs/max';
import { User } from '@/services/user';

const UserList: React.FC = () => {
  const { useUserList, useCreateUser, useUpdateUser, useDeleteUser, useBatchDeleteUser, useUpdateUserPassword } = useModel('user');
  
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [selectedRow, setSelectedRow] = useState<User | null>(null);
  const [selectedRows, setSelectedRows] = useState<User[]>([]);
  
  // 获取用户列表
  const { userList, total, loading, pagination, refresh } = useUserList();
  
  // 创建用户
  const { submitCreate, loading: createLoading } = useCreateUser({
    success: () => {
      setCreateModalVisible(false);
      form.resetFields();
      refresh();
    }
  });
  
  // 更新用户
  const { submitUpdate, loading: updateLoading } = useUpdateUser({
    success: () => {
      setUpdateModalVisible(false);
      updateForm.resetFields();
      setSelectedRow(null);
      refresh();
    }
  });
  
  // 删除用户
  const { submitDelete, loading: deleteLoading } = useDeleteUser({
    success: refresh
  });
  
  // 批量删除用户
  const { submitBatchDelete, loading: batchDeleteLoading } = useBatchDeleteUser({
    success: refresh
  });
  
  // 更新用户密码
  const { submitUpdatePassword, loading: passwordLoading } = useUpdateUserPassword({
    success: () => {
      setPasswordModalVisible(false);
      passwordForm.resetFields();
      setSelectedRow(null);
    }
  });
  
  // 列配置
  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      ellipsis: true,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: '昵称',
      dataIndex: 'nickName',
      key: 'nickName',
      ellipsis: true,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      ellipsis: true,
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
      ellipsis: true,
    },
    {
      title: '角色',
      dataIndex: 'roleName',
      key: 'roleName',
      ellipsis: true,
    },
    {
      title: '科室',
      dataIndex: 'departmentName',
      key: 'departmentName',
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
      render: (_: any, record: User) => [
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
          key="password"
          type="link"
          onClick={() => {
            setSelectedRow(record);
            setPasswordModalVisible(true);
          }}
        >
          修改密码
        </Button>,
        <Button
          key="delete"
          type="link"
          danger
          onClick={() => {
            Modal.confirm({
              title: '确认删除',
              content: `确定要删除用户「${record.name}」吗？`,
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
        name: 'username',
        label: '用户名',
        valueType: 'text',
      },
      {
        name: 'name',
        label: '姓名',
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
    <PageContainer title="用户管理">
      <ProTable
        rowKey="id"
        columns={columns}
        dataSource={userList}
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
            新建用户
          </Button>,
          selectedRows.length > 0 && (
            <Button
              type="default"
              danger
              key="batchDelete"
              onClick={() => {
                Modal.confirm({
                  title: '确认批量删除',
                  content: `确定要删除选中的 ${selectedRows.length} 个用户吗？`,
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
      
      {/* 创建用户弹窗 */}
      <Modal
        title="新建用户"
        open={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            submitCreate(values);
          }}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item
            name="nickName"
            label="昵称"
          >
            <Input placeholder="请输入昵称" />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[{ type: 'email', message: '请输入正确的邮箱格式' }]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="电话"
          >
            <Input placeholder="请输入电话" />
          </Form.Item>
          <Form.Item
            name="roleId"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="请选择角色">
              {/* 这里需要从角色列表中获取角色数据，暂时使用静态数据 */}
              <Select.Option value="1">管理员</Select.Option>
              <Select.Option value="2">医生</Select.Option>
              <Select.Option value="3">药房工作人员</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="departmentId"
            label="科室"
            rules={[{ required: true, message: '请选择科室' }]}
          >
            <Select placeholder="请选择科室">
              {/* 这里需要从科室列表中获取科室数据，暂时使用静态数据 */}
              <Select.Option value="1">内科</Select.Option>
              <Select.Option value="2">外科</Select.Option>
              <Select.Option value="3">儿科</Select.Option>
            </Select>
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
      
      {/* 更新用户弹窗 */}
      <Modal
        title="编辑用户"
        open={updateModalVisible}
        onCancel={() => {
          setUpdateModalVisible(false);
          updateForm.resetFields();
          setSelectedRow(null);
        }}
        footer={null}
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
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item
            name="nickName"
            label="昵称"
          >
            <Input placeholder="请输入昵称" />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[{ type: 'email', message: '请输入正确的邮箱格式' }]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="电话"
          >
            <Input placeholder="请输入电话" />
          </Form.Item>
          <Form.Item
            name="roleId"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="请选择角色">
              {/* 这里需要从角色列表中获取角色数据，暂时使用静态数据 */}
              <Select.Option value="1">管理员</Select.Option>
              <Select.Option value="2">医生</Select.Option>
              <Select.Option value="3">药房工作人员</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="departmentId"
            label="科室"
            rules={[{ required: true, message: '请选择科室' }]}
          >
            <Select placeholder="请选择科室">
              {/* 这里需要从科室列表中获取科室数据，暂时使用静态数据 */}
              <Select.Option value="1">内科</Select.Option>
              <Select.Option value="2">外科</Select.Option>
              <Select.Option value="3">儿科</Select.Option>
            </Select>
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
      
      {/* 修改密码弹窗 */}
      <Modal
        title="修改密码"
        open={passwordModalVisible}
        onCancel={() => {
          setPasswordModalVisible(false);
          passwordForm.resetFields();
          setSelectedRow(null);
        }}
        footer={null}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={(values) => {
            if (selectedRow) {
              submitUpdatePassword(selectedRow.id, values);
            }
          }}
        >
          <Form.Item
            name="password"
            label="新密码"
            rules={[{ required: true, message: '请输入新密码' }]}
          >
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={passwordLoading}>
              确定
            </Button>
            <Button
              style={{ marginLeft: 8 }}
              onClick={() => {
                setPasswordModalVisible(false);
                passwordForm.resetFields();
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

export default UserList;