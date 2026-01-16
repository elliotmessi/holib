import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Modal, Form, Input, Select, message } from 'antd';
import React, { useState, useEffect } from 'react';
import { useModel } from '@umijs/max';

const PharmacyList: React.FC = () => {
  const { usePharmacyList, useCreatePharmacy, useUpdatePharmacy, useDeletePharmacy, useBatchDeletePharmacy } = useModel('pharmacy');
  const { useHospitalList } = useModel('hospital');
  
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [hospitalList, setHospitalList] = useState<any[]>([]);
  
  // 获取医院列表
  const { hospitalList: hospitals, loading: hospitalLoading } = useHospitalList();
  
  // 初始化医院列表
  useEffect(() => {
    setHospitalList(hospitals || []);
  }, [hospitals]);
  
  // 获取药房列表
  const { pharmacyList, total, loading, pagination, refresh } = usePharmacyList();
  
  // 创建药房
  const { submitCreate, loading: createLoading } = useCreatePharmacy({
    success: () => {
      setCreateModalVisible(false);
      form.resetFields();
      refresh();
    }
  });
  
  // 更新药房
  const { submitUpdate, loading: updateLoading } = useUpdatePharmacy({
    success: () => {
      setUpdateModalVisible(false);
      updateForm.resetFields();
      setSelectedRow(null);
      refresh();
    }
  });
  
  // 删除药房
  const { submitDelete, loading: deleteLoading } = useDeletePharmacy({
    success: refresh
  });
  
  // 批量删除药房
  const { submitBatchDelete, loading: batchDeleteLoading } = useBatchDeletePharmacy({
    success: refresh
  });
  
  // 列配置
  const columns = [
    {
      title: '药房名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: '药房编码',
      dataIndex: 'code',
      key: 'code',
      ellipsis: true,
    },
    {
      title: '所属医院',
      dataIndex: 'hospitalName',
      key: 'hospitalName',
      ellipsis: true,
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
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
              content: `确定要删除药房「${record.name}」吗？`,
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
        label: '药房名称',
        valueType: 'text',
      },
      {
        name: 'code',
        label: '药房编码',
        valueType: 'text',
      },
      {
        name: 'hospitalId',
        label: '所属医院',
        valueType: 'select',
        valueEnum: hospitalList.map(hospital => ({
          text: hospital.name,
          value: hospital.id,
          key: hospital.id,
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
    <PageContainer title="药房管理">
      <ProTable
        rowKey="id"
        columns={columns}
        dataSource={pharmacyList}
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
            新建药房
          </Button>,
          selectedRows.length > 0 && (
            <Button
              type="default"
              danger
              key="batchDelete"
              onClick={() => {
                Modal.confirm({
                  title: '确认批量删除',
                  content: `确定要删除选中的 ${selectedRows.length} 个药房吗？`,
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
      
      {/* 创建药房弹窗 */}
      <Modal
        title="新建药房"
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
            label="药房名称"
            rules={[{ required: true, message: '请输入药房名称' }]}
          >
            <Input placeholder="请输入药房名称" />
          </Form.Item>
          <Form.Item
            name="code"
            label="药房编码"
            rules={[{ required: true, message: '请输入药房编码' }]}
          >
            <Input placeholder="请输入药房编码" />
          </Form.Item>
          <Form.Item
            name="hospitalId"
            label="所属医院"
            rules={[{ required: true, message: '请选择所属医院' }]}
          >
            <Select
              placeholder="请选择所属医院"
              options={hospitalList.map(hospital => ({
                value: hospital.id,
                label: hospital.name,
                key: hospital.id,
              }))}
              loading={hospitalLoading}
            />
          </Form.Item>
          <Form.Item
            name="address"
            label="地址"
            rules={[{ required: true, message: '请输入地址' }]}
          >
            <Input placeholder="请输入地址" />
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
      
      {/* 更新药房弹窗 */}
      <Modal
        title="编辑药房"
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
            label="药房名称"
            rules={[{ required: true, message: '请输入药房名称' }]}
          >
            <Input placeholder="请输入药房名称" />
          </Form.Item>
          <Form.Item
            name="code"
            label="药房编码"
            rules={[{ required: true, message: '请输入药房编码' }]}
          >
            <Input placeholder="请输入药房编码" />
          </Form.Item>
          <Form.Item
            name="hospitalId"
            label="所属医院"
            rules={[{ required: true, message: '请选择所属医院' }]}
          >
            <Select
              placeholder="请选择所属医院"
              options={hospitalList.map(hospital => ({
                value: hospital.id,
                label: hospital.name,
                key: hospital.id,
              }))}
              loading={hospitalLoading}
            />
          </Form.Item>
          <Form.Item
            name="address"
            label="地址"
            rules={[{ required: true, message: '请输入地址' }]}
          >
            <Input placeholder="请输入地址" />
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

export default PharmacyList;