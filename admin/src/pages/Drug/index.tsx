import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Modal, Form, Input, Select, message, InputNumber } from 'antd';
import React, { useState } from 'react';
import { useModel } from '@umijs/max';

const DrugList: React.FC = () => {
  const { useDrugList, useCreateDrug, useUpdateDrug, useDeleteDrug, useBatchDeleteDrug } = useModel('drug');
  
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  
  // 获取药品列表
  const { drugList, total, loading, pagination, refresh } = useDrugList();
  
  // 创建药品
  const { submitCreate, loading: createLoading } = useCreateDrug({
    success: () => {
      setCreateModalVisible(false);
      form.resetFields();
      refresh();
    }
  });
  
  // 更新药品
  const { submitUpdate, loading: updateLoading } = useUpdateDrug({
    success: () => {
      setUpdateModalVisible(false);
      updateForm.resetFields();
      setSelectedRow(null);
      refresh();
    }
  });
  
  // 删除药品
  const { submitDelete, loading: deleteLoading } = useDeleteDrug({
    success: refresh
  });
  
  // 批量删除药品
  const { submitBatchDelete, loading: batchDeleteLoading } = useBatchDeleteDrug({
    success: refresh
  });
  
  // 列配置
  const columns = [
    {
      title: '药品名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: '药品编码',
      dataIndex: 'code',
      key: 'code',
      ellipsis: true,
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      ellipsis: true,
    },
    {
      title: '规格',
      dataIndex: 'specification',
      key: 'specification',
      ellipsis: true,
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
      ellipsis: true,
    },
    {
      title: '生产厂家',
      dataIndex: 'manufacturer',
      key: 'manufacturer',
      ellipsis: true,
    },
    {
      title: '剂型',
      dataIndex: 'dosageForm',
      key: 'dosageForm',
      ellipsis: true,
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      valueType: 'money',
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
              content: `确定要删除药品「${record.name}」吗？`,
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
        label: '药品名称',
        valueType: 'text',
      },
      {
        name: 'code',
        label: '药品编码',
        valueType: 'text',
      },
      {
        name: 'category',
        label: '分类',
        valueType: 'text',
      },
      {
        name: 'manufacturer',
        label: '生产厂家',
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
    <PageContainer title="药品管理">
      <ProTable
        rowKey="id"
        columns={columns}
        dataSource={drugList}
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
            新建药品
          </Button>,
          selectedRows.length > 0 && (
            <Button
              type="default"
              danger
              key="batchDelete"
              onClick={() => {
                Modal.confirm({
                  title: '确认批量删除',
                  content: `确定要删除选中的 ${selectedRows.length} 个药品吗？`,
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
      
      {/* 创建药品弹窗 */}
      <Modal
        title="新建药品"
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
            label="药品名称"
            rules={[{ required: true, message: '请输入药品名称' }]}
          >
            <Input placeholder="请输入药品名称" />
          </Form.Item>
          <Form.Item
            name="code"
            label="药品编码"
            rules={[{ required: true, message: '请输入药品编码' }]}
          >
            <Input placeholder="请输入药品编码" />
          </Form.Item>
          <Form.Item
            name="category"
            label="分类"
            rules={[{ required: true, message: '请输入药品分类' }]}
          >
            <Input placeholder="请输入药品分类" />
          </Form.Item>
          <Form.Item
            name="specification"
            label="规格"
            rules={[{ required: true, message: '请输入药品规格' }]}
          >
            <Input placeholder="请输入药品规格" />
          </Form.Item>
          <Form.Item
            name="unit"
            label="单位"
            rules={[{ required: true, message: '请输入单位' }]}
          >
            <Input placeholder="请输入单位" />
          </Form.Item>
          <Form.Item
            name="manufacturer"
            label="生产厂家"
            rules={[{ required: true, message: '请输入生产厂家' }]}
          >
            <Input placeholder="请输入生产厂家" />
          </Form.Item>
          <Form.Item
            name="dosageForm"
            label="剂型"
            rules={[{ required: true, message: '请输入剂型' }]}
          >
            <Input placeholder="请输入剂型" />
          </Form.Item>
          <Form.Item
            name="price"
            label="价格"
            rules={[{ required: true, message: '请输入价格' }]}
          >
            <InputNumber 
              placeholder="请输入价格" 
              style={{ width: '100%' }}
              min={0}
              step={0.01}
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
      
      {/* 更新药品弹窗 */}
      <Modal
        title="编辑药品"
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
            label="药品名称"
            rules={[{ required: true, message: '请输入药品名称' }]}
          >
            <Input placeholder="请输入药品名称" />
          </Form.Item>
          <Form.Item
            name="code"
            label="药品编码"
            rules={[{ required: true, message: '请输入药品编码' }]}
          >
            <Input placeholder="请输入药品编码" />
          </Form.Item>
          <Form.Item
            name="category"
            label="分类"
            rules={[{ required: true, message: '请输入药品分类' }]}
          >
            <Input placeholder="请输入药品分类" />
          </Form.Item>
          <Form.Item
            name="specification"
            label="规格"
            rules={[{ required: true, message: '请输入药品规格' }]}
          >
            <Input placeholder="请输入药品规格" />
          </Form.Item>
          <Form.Item
            name="unit"
            label="单位"
            rules={[{ required: true, message: '请输入单位' }]}
          >
            <Input placeholder="请输入单位" />
          </Form.Item>
          <Form.Item
            name="manufacturer"
            label="生产厂家"
            rules={[{ required: true, message: '请输入生产厂家' }]}
          >
            <Input placeholder="请输入生产厂家" />
          </Form.Item>
          <Form.Item
            name="dosageForm"
            label="剂型"
            rules={[{ required: true, message: '请输入剂型' }]}
          >
            <Input placeholder="请输入剂型" />
          </Form.Item>
          <Form.Item
            name="price"
            label="价格"
            rules={[{ required: true, message: '请输入价格' }]}
          >
            <InputNumber 
              placeholder="请输入价格" 
              style={{ width: '100%' }}
              min={0}
              step={0.01}
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

export default DrugList;