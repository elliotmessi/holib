import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Modal, Form, Input, Select, message, Radio, DatePicker, InputNumber } from 'antd';
import React, { useState } from 'react';
import { useModel } from '@umijs/max';

const { TextArea } = Input;

const PatientList: React.FC = () => {
  const { usePatientList, useCreatePatient, useUpdatePatient, useDeletePatient, useBatchDeletePatient } = useModel('patient');
  
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  
  // 获取患者列表
  const { patientList, total, loading, pagination, refresh } = usePatientList();
  
  // 创建患者
  const { submitCreate, loading: createLoading } = useCreatePatient({
    success: () => {
      setCreateModalVisible(false);
      form.resetFields();
      refresh();
    }
  });
  
  // 更新患者
  const { submitUpdate, loading: updateLoading } = useUpdatePatient({
    success: () => {
      setUpdateModalVisible(false);
      updateForm.resetFields();
      setSelectedRow(null);
      refresh();
    }
  });
  
  // 删除患者
  const { submitDelete, loading: deleteLoading } = useDeletePatient({
    success: refresh
  });
  
  // 批量删除患者
  const { submitBatchDelete, loading: batchDeleteLoading } = useBatchDeletePatient({
    success: refresh
  });
  
  // 列配置
  const columns = [
    {
      title: '患者姓名',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: '患者编码',
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
      title: '出生日期',
      dataIndex: 'birthDate',
      key: 'birthDate',
      valueType: 'date',
    },
    {
      title: '身份证号',
      dataIndex: 'idCard',
      key: 'idCard',
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
              content: `确定要删除患者「${record.name}」吗？`,
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
        label: '患者姓名',
        valueType: 'text',
      },
      {
        name: 'code',
        label: '患者编码',
        valueType: 'text',
      },
      {
        name: 'idCard',
        label: '身份证号',
        valueType: 'text',
      },
      {
        name: 'phone',
        label: '联系电话',
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
    <PageContainer title="患者管理">
      <ProTable
        rowKey="id"
        columns={columns}
        dataSource={patientList}
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
            新建患者
          </Button>,
          selectedRows.length > 0 && (
            <Button
              type="default"
              danger
              key="batchDelete"
              onClick={() => {
                Modal.confirm({
                  title: '确认批量删除',
                  content: `确定要删除选中的 ${selectedRows.length} 个患者吗？`,
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
      
      {/* 创建患者弹窗 */}
      <Modal
        title="新建患者"
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
            label="患者姓名"
            rules={[{ required: true, message: '请输入患者姓名' }]}
          >
            <Input placeholder="请输入患者姓名" />
          </Form.Item>
          <Form.Item
            name="code"
            label="患者编码"
            rules={[{ required: true, message: '请输入患者编码' }]}
          >
            <Input placeholder="请输入患者编码" />
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
            name="birthDate"
            label="出生日期"
            rules={[{ required: true, message: '请选择出生日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="idCard"
            label="身份证号"
            rules={[{ required: true, message: '请输入身份证号' }]}
          >
            <Input placeholder="请输入身份证号" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="联系电话"
            rules={[{ required: true, message: '请输入联系电话' }]}
          >
            <Input placeholder="请输入联系电话" />
          </Form.Item>
          <Form.Item
            name="address"
            label="地址"
          >
            <Input placeholder="请输入地址" />
          </Form.Item>
          <Form.Item
            name="emergencyContact"
            label="紧急联系人"
          >
            <Input placeholder="请输入紧急联系人" />
          </Form.Item>
          <Form.Item
            name="emergencyPhone"
            label="紧急联系电话"
          >
            <Input placeholder="请输入紧急联系电话" />
          </Form.Item>
          <Form.Item
            name="medicalHistory"
            label="病史"
          >
            <TextArea placeholder="请输入病史" rows={3} />
          </Form.Item>
          <Form.Item
            name="allergyHistory"
            label="过敏史"
          >
            <TextArea placeholder="请输入过敏史" rows={3} />
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
      
      {/* 更新患者弹窗 */}
      <Modal
        title="编辑患者"
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
            label="患者姓名"
            rules={[{ required: true, message: '请输入患者姓名' }]}
          >
            <Input placeholder="请输入患者姓名" />
          </Form.Item>
          <Form.Item
            name="code"
            label="患者编码"
            rules={[{ required: true, message: '请输入患者编码' }]}
          >
            <Input placeholder="请输入患者编码" />
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
            name="birthDate"
            label="出生日期"
            rules={[{ required: true, message: '请选择出生日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="idCard"
            label="身份证号"
            rules={[{ required: true, message: '请输入身份证号' }]}
          >
            <Input placeholder="请输入身份证号" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="联系电话"
            rules={[{ required: true, message: '请输入联系电话' }]}
          >
            <Input placeholder="请输入联系电话" />
          </Form.Item>
          <Form.Item
            name="address"
            label="地址"
          >
            <Input placeholder="请输入地址" />
          </Form.Item>
          <Form.Item
            name="emergencyContact"
            label="紧急联系人"
          >
            <Input placeholder="请输入紧急联系人" />
          </Form.Item>
          <Form.Item
            name="emergencyPhone"
            label="紧急联系电话"
          >
            <Input placeholder="请输入紧急联系电话" />
          </Form.Item>
          <Form.Item
            name="medicalHistory"
            label="病史"
          >
            <TextArea placeholder="请输入病史" rows={3} />
          </Form.Item>
          <Form.Item
            name="allergyHistory"
            label="过敏史"
          >
            <TextArea placeholder="请输入过敏史" rows={3} />
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

export default PatientList;