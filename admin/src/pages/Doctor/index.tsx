import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Modal, Form, Input, Select, message, Radio } from 'antd';
import React, { useState, useEffect } from 'react';
import { useModel } from '@umijs/max';

const DoctorList: React.FC = () => {
  const { useDoctorList, useCreateDoctor, useUpdateDoctor, useDeleteDoctor, useBatchDeleteDoctor } = useModel('doctor');
  const { useDepartmentList } = useModel('department');
  
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [departmentList, setDepartmentList] = useState<any[]>([]);
  
  // 获取科室列表
  const { departmentList: depts, loading: deptLoading } = useDepartmentList();
  
  // 初始化科室列表
  useEffect(() => {
    setDepartmentList(depts || []);
  }, [depts]);
  
  // 获取医生列表
  const { doctorList, total, loading, pagination, refresh } = useDoctorList();
  
  // 创建医生
  const { submitCreate, loading: createLoading } = useCreateDoctor({
    success: () => {
      setCreateModalVisible(false);
      form.resetFields();
      refresh();
    }
  });
  
  // 更新医生
  const { submitUpdate, loading: updateLoading } = useUpdateDoctor({
    success: () => {
      setUpdateModalVisible(false);
      updateForm.resetFields();
      setSelectedRow(null);
      refresh();
    }
  });
  
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
        valueEnum: departmentList.map(dept => ({
          text: dept.name,
          value: dept.id,
        })),
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
            onClick={() => setCreateModalVisible(true)}
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
      
      {/* 创建医生弹窗 */}
      <Modal
        title="新建医生"
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
            label="医生姓名"
            rules={[{ required: true, message: '请输入医生姓名' }]}
          >
            <Input placeholder="请输入医生姓名" />
          </Form.Item>
          <Form.Item
            name="code"
            label="医生编码"
            rules={[{ required: true, message: '请输入医生编码' }]}
          >
            <Input placeholder="请输入医生编码" />
          </Form.Item>
          <Form.Item
            name="gender"
            label="性别"
            initialValue={1}
            rules={[{ required: true, message: '请选择性别' }]}
          >
            <Radio.Group>
              <Radio value={1}>男</Radio>
              <Radio value={2}>女</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="phone"
            label="联系电话"
            rules={[{ required: true, message: '请输入联系电话' }]}
          >
            <Input placeholder="请输入联系电话" />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item
            name="departmentId"
            label="所属科室"
            rules={[{ required: true, message: '请选择所属科室' }]}
          >
            <Select
              placeholder="请选择所属科室"
              options={departmentList.map(dept => ({
                value: dept.id,
                label: dept.name,
              }))}
              loading={deptLoading}
            />
          </Form.Item>
          <Form.Item
            name="title"
            label="职称"
            rules={[{ required: true, message: '请输入职称' }]}
          >
            <Input placeholder="请输入职称" />
          </Form.Item>
          <Form.Item
            name="specialty"
            label="专长"
            rules={[{ required: true, message: '请输入专长' }]}
          >
            <Input placeholder="请输入专长" />
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
      
      {/* 更新医生弹窗 */}
      <Modal
        title="编辑医生"
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
            label="医生姓名"
            rules={[{ required: true, message: '请输入医生姓名' }]}
          >
            <Input placeholder="请输入医生姓名" />
          </Form.Item>
          <Form.Item
            name="code"
            label="医生编码"
            rules={[{ required: true, message: '请输入医生编码' }]}
          >
            <Input placeholder="请输入医生编码" />
          </Form.Item>
          <Form.Item
            name="gender"
            label="性别"
            rules={[{ required: true, message: '请选择性别' }]}
          >
            <Radio.Group>
              <Radio value={1}>男</Radio>
              <Radio value={2}>女</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="phone"
            label="联系电话"
            rules={[{ required: true, message: '请输入联系电话' }]}
          >
            <Input placeholder="请输入联系电话" />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item
            name="departmentId"
            label="所属科室"
            rules={[{ required: true, message: '请选择所属科室' }]}
          >
            <Select
              placeholder="请选择所属科室"
              options={departmentList.map(dept => ({
                value: dept.id,
                label: dept.name,
              }))}
              loading={deptLoading}
            />
          </Form.Item>
          <Form.Item
            name="title"
            label="职称"
            rules={[{ required: true, message: '请输入职称' }]}
          >
            <Input placeholder="请输入职称" />
          </Form.Item>
          <Form.Item
            name="specialty"
            label="专长"
            rules={[{ required: true, message: '请输入专长' }]}
          >
            <Input placeholder="请输入专长" />
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

export default DoctorList;