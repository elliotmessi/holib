import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Modal, Form, Input, Select, message } from 'antd';
import React, { useState } from 'react';
import { useModel } from '@umijs/max';
import { Department } from '@/services/department';

const DepartmentList: React.FC = () => {
  const { useDepartmentList, useCreateDepartment, useUpdateDepartment, useDeleteDepartment, useBatchDeleteDepartment } = useModel('department');
  
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [selectedRow, setSelectedRow] = useState<Department | null>(null);
  const [selectedRows, setSelectedRows] = useState<Department[]>([]);
  
  // 获取科室列表
  const { departmentList, total, loading, pagination, refresh } = useDepartmentList();
  
  // 创建科室
  const { submitCreate, loading: createLoading } = useCreateDepartment({
    success: () => {
      setCreateModalVisible(false);
      form.resetFields();
      refresh();
    }
  });
  
  // 更新科室
  const { submitUpdate, loading: updateLoading } = useUpdateDepartment({
    success: () => {
      setUpdateModalVisible(false);
      updateForm.resetFields();
      setSelectedRow(null);
      refresh();
    }
  });
  
  // 删除科室
  const { submitDelete, loading: deleteLoading } = useDeleteDepartment({
    success: refresh
  });
  
  // 批量删除科室
  const { submitBatchDelete, loading: batchDeleteLoading } = useBatchDeleteDepartment({
    success: refresh
  });
  
  // 列配置
  const columns = [
    {
      title: '科室名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: '科室编码',
      dataIndex: 'code',
      key: 'code',
      ellipsis: true,
    },
    {
      title: '医院',
      dataIndex: 'hospitalName',
      key: 'hospitalName',
      ellipsis: true,
    },
    {
      title: '科室类型',
      dataIndex: 'type',
      key: 'type',
      valueEnum: {
        0: { text: '门诊', status: 'default' },
        1: { text: '住院', status: 'processing' },
        2: { text: '急诊', status: 'error' },
      },
    },
    {
      title: '联系人',
      dataIndex: 'contact',
      key: 'contact',
      ellipsis: true,
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
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
      render: (_: any, record: Department) => [
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
              content: `确定要删除科室「${record.name}」吗？`,
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
        label: '科室名称',
        valueType: 'text',
      },
      {
        name: 'code',
        label: '科室编码',
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
    <PageContainer title="科室管理">
      <ProTable
        rowKey="id"
        columns={columns}
        dataSource={departmentList}
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
            新建科室
          </Button>,
          selectedRows.length > 0 && (
            <Button
              type="default"
              danger
              key="batchDelete"
              onClick={() => {
                Modal.confirm({
                  title: '确认批量删除',
                  content: `确定要删除选中的 ${selectedRows.length} 个科室吗？`,
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
      
      {/* 创建科室弹窗 */}
      <Modal
        title="新建科室"
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
            name="name"
            label="科室名称"
            rules={[{ required: true, message: '请输入科室名称' }]}
          >
            <Input placeholder="请输入科室名称" />
          </Form.Item>
          <Form.Item
            name="code"
            label="科室编码"
            rules={[{ required: true, message: '请输入科室编码' }]}
          >
            <Input placeholder="请输入科室编码" />
          </Form.Item>
          <Form.Item
            name="hospitalId"
            label="所属医院"
            rules={[{ required: true, message: '请选择所属医院' }]}
          >
            <Select placeholder="请选择所属医院">
              {/* 这里需要从医院列表中获取医院数据，暂时使用静态数据 */}
              <Select.Option value="1">医院A</Select.Option>
              <Select.Option value="2">医院B</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="type"
            label="科室类型"
            initialValue={0}
            rules={[{ required: true, message: '请选择科室类型' }]}
          >
            <Select
              options={[
                { value: 0, label: '门诊' },
                { value: 1, label: '住院' },
                { value: 2, label: '急诊' },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="contact"
            label="联系人"
            rules={[{ required: true, message: '请输入联系人' }]}
          >
            <Input placeholder="请输入联系人" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="联系电话"
            rules={[{ required: true, message: '请输入联系电话' }]}
          >
            <Input placeholder="请输入联系电话" />
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
      
      {/* 更新科室弹窗 */}
      <Modal
        title="编辑科室"
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
            label="科室名称"
            rules={[{ required: true, message: '请输入科室名称' }]}
          >
            <Input placeholder="请输入科室名称" />
          </Form.Item>
          <Form.Item
            name="code"
            label="科室编码"
            rules={[{ required: true, message: '请输入科室编码' }]}
          >
            <Input placeholder="请输入科室编码" />
          </Form.Item>
          <Form.Item
            name="hospitalId"
            label="所属医院"
            rules={[{ required: true, message: '请选择所属医院' }]}
          >
            <Select placeholder="请选择所属医院">
              {/* 这里需要从医院列表中获取医院数据，暂时使用静态数据 */}
              <Select.Option value="1">医院A</Select.Option>
              <Select.Option value="2">医院B</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="type"
            label="科室类型"
            rules={[{ required: true, message: '请选择科室类型' }]}
          >
            <Select
              options={[
                { value: 0, label: '门诊' },
                { value: 1, label: '住院' },
                { value: 2, label: '急诊' },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="contact"
            label="联系人"
            rules={[{ required: true, message: '请输入联系人' }]}
          >
            <Input placeholder="请输入联系人" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="联系电话"
            rules={[{ required: true, message: '请输入联系电话' }]}
          >
            <Input placeholder="请输入联系电话" />
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

export default DepartmentList;
