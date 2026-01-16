import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Modal, Form, Input, Select, message, InputNumber, DatePicker, Tag, Descriptions, Tabs } from 'antd';
import React, { useState, useEffect } from 'react';
import { useModel } from '@umijs/max';

const { TextArea } = Input;

const InventoryList: React.FC = () => {
  const { useInventoryList, useLowStockInventory, useExpiringInventory, useInventoryDetail, useUpdateInventory, useInventoryInbound, useInventoryOutbound } = useModel('inventory');
  const { useDrugList } = useModel('drug');
  const { usePharmacyList } = useModel('pharmacy');
  
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [inboundModalVisible, setInboundModalVisible] = useState(false);
  const [outboundModalVisible, setOutboundModalVisible] = useState(false);
  const [updateForm] = Form.useForm();
  const [inboundForm] = Form.useForm();
  const [outboundForm] = Form.useForm();
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [activeTabKey, setActiveTabKey] = useState('all');
  const [drugList, setDrugList] = useState<any[]>([]);
  const [pharmacyList, setPharmacyList] = useState<any[]>([]);
  
  // 获取药品列表
  const { drugList: drugs, loading: drugLoading } = useDrugList();
  
  // 获取药房列表
  const { pharmacyList: pharmacies, loading: pharmacyLoading } = usePharmacyList();
  
  // 初始化药品和药房列表
  useEffect(() => {
    setDrugList(drugs || []);
  }, [drugs]);
  
  useEffect(() => {
    setPharmacyList(pharmacies || []);
  }, [pharmacies]);
  
  // 获取库存列表
  const { inventoryList, total, loading, pagination, refresh } = useInventoryList();
  
  // 获取低库存列表
  const { lowStockList, total: lowStockTotal, loading: lowStockLoading, pagination: lowStockPagination, refresh: lowStockRefresh } = useLowStockInventory();
  
  // 获取近效期列表
  const { expiringList, total: expiringTotal, loading: expiringLoading, pagination: expiringPagination, refresh: expiringRefresh } = useExpiringInventory({ days: 30 });
  
  // 获取库存详情
  const { inventoryDetail, loading: detailLoading, fetchDetail } = useInventoryDetail();
  
  // 更新库存
  const { submitUpdate, loading: updateLoading } = useUpdateInventory({
    success: () => {
      setUpdateModalVisible(false);
      updateForm.resetFields();
      setSelectedRow(null);
      refresh();
    }
  });
  
  // 库存入库
  const { submitInbound, loading: inboundLoading } = useInventoryInbound({
    success: () => {
      setInboundModalVisible(false);
      inboundForm.resetFields();
      refresh();
    }
  });
  
  // 库存出库
  const { submitOutbound, loading: outboundLoading } = useInventoryOutbound({
    success: () => {
      setOutboundModalVisible(false);
      outboundForm.resetFields();
      refresh();
    }
  });
  
  // 查看详情
  const handleViewDetail = (record: any) => {
    setSelectedRow(record);
    fetchDetail(record.id);
    setDetailModalVisible(true);
  };
  
  // 编辑库存
  const handleUpdate = (record: any) => {
    setSelectedRow(record);
    updateForm.setFieldsValue({
      minQuantity: record.minQuantity,
      price: record.price,
      status: record.status
    });
    setUpdateModalVisible(true);
  };
  
  // 库存入库
  const handleInbound = () => {
    inboundForm.resetFields();
    setInboundModalVisible(true);
  };
  
  // 库存出库
  const handleOutbound = () => {
    outboundForm.resetFields();
    setOutboundModalVisible(true);
  };
  
  // 列配置
  const columns = [
    {
      title: '药品名称',
      dataIndex: 'drugName',
      key: 'drugName',
      ellipsis: true,
    },
    {
      title: '药品编码',
      dataIndex: 'drugCode',
      key: 'drugCode',
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
      title: '所属药房',
      dataIndex: 'pharmacyName',
      key: 'pharmacyName',
      ellipsis: true,
    },
    {
      title: '批次号',
      dataIndex: 'batchNo',
      key: 'batchNo',
      ellipsis: true,
    },
    {
      title: '有效期',
      dataIndex: 'expirationDate',
      key: 'expirationDate',
      valueType: 'date',
    },
    {
      title: '库存数量',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (dom: any, record: any) => (
        <span>
          {dom}
          {record.quantity < record.minQuantity && (
            <Tag color="red" style={{ marginLeft: 8 }}>
              低库存
            </Tag>
          )}
        </span>
      ),
    },
    {
      title: '最低库存',
      dataIndex: 'minQuantity',
      key: 'minQuantity',
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
        1: { text: '正常', status: 'Success' },
        0: { text: '禁用', status: 'Error' },
      },
    },
    {
      title: '操作',
      key: 'action',
      valueType: 'option',
      render: (_: any, record: any) => [
        <Button
          key="detail"
          type="link"
          onClick={() => handleViewDetail(record)}
        >
          详情
        </Button>,
        <Button
          key="update"
          type="link"
          onClick={() => handleUpdate(record)}
        >
          编辑
        </Button>,
      ],
    },
  ];
  
  // 搜索表单配置
  const searchConfig = {
    labelWidth: 120,
    columns: [
      {
        name: 'drugName',
        label: '药品名称',
        valueType: 'text',
      },
      {
        name: 'drugCode',
        label: '药品编码',
        valueType: 'text',
      },
      {
        name: 'pharmacyId',
        label: '所属药房',
        valueType: 'select',
        valueEnum: pharmacyList.map(pharmacy => ({
          text: pharmacy.name,
          value: pharmacy.id,
          key: pharmacy.id,
        })),
      },
      {
        name: 'batchNo',
        label: '批次号',
        valueType: 'text',
      },
      {
        name: 'status',
        label: '状态',
        valueType: 'select',
        valueEnum: {
          1: { text: '正常', status: 'Success' },
          0: { text: '禁用', status: 'Error' },
        },
      },
    ],
  };
  
  return (
    <PageContainer title="库存管理">
      <Tabs
        activeKey={activeTabKey}
        onChange={setActiveTabKey}
        items={[
          {
            key: 'all',
            label: `全部库存 (共 ${total} 条)`,
            children: (
              <>
                <ProTable
                  rowKey="id"
                  columns={columns}
                  dataSource={inventoryList}
                  pagination={pagination}
                  loading={loading}
                  rowSelection={{
                    onChange: (_, rows) => setSelectedRows(rows),
                  }}
                  search={searchConfig}
                  toolBarRender={() => [
                    <Button
                      type="primary"
                      key="inbound"
                      onClick={handleInbound}
                    >
                      入库
                    </Button>,
                    <Button
                      type="default"
                      key="outbound"
                      onClick={handleOutbound}
                    >
                      出库
                    </Button>,
                  ]}
                />
              </>
            ),
          },
          {
            key: 'low',
            label: `低库存预警 (共 ${lowStockTotal} 条)`,
            children: (
              <ProTable
                rowKey="id"
                columns={columns}
                dataSource={lowStockList}
                pagination={lowStockPagination}
                loading={lowStockLoading}
                search={searchConfig}
                toolBarRender={() => [
                  <Button
                    type="primary"
                    key="inbound"
                    onClick={handleInbound}
                  >
                    入库
                  </Button>,
                ]}
              />
            ),
          },
          {
            key: 'expiring',
            label: `近效期预警 (共 ${expiringTotal} 条)`,
            children: (
              <ProTable
                rowKey="id"
                columns={columns}
                dataSource={expiringList}
                pagination={expiringPagination}
                loading={expiringLoading}
                search={searchConfig}
              />
            ),
          },
        ]}
      />
      
      {/* 库存详情弹窗 */}
      <Modal
        title="库存详情"
        open={detailModalVisible}
        onCancel={() => {
          setDetailModalVisible(false);
          setSelectedRow(null);
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setDetailModalVisible(false);
              setSelectedRow(null);
            }}
          >
            关闭
          </Button>,
        ]}
        width={800}
      >
        {selectedRow && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="药品名称">{selectedRow.drugName}</Descriptions.Item>
            <Descriptions.Item label="药品编码">{selectedRow.drugCode}</Descriptions.Item>
            <Descriptions.Item label="规格">{selectedRow.specification}</Descriptions.Item>
            <Descriptions.Item label="单位">{selectedRow.unit}</Descriptions.Item>
            <Descriptions.Item label="所属药房">{selectedRow.pharmacyName}</Descriptions.Item>
            <Descriptions.Item label="批次号">{selectedRow.batchNo}</Descriptions.Item>
            <Descriptions.Item label="有效期">{selectedRow.expirationDate}</Descriptions.Item>
            <Descriptions.Item label="库存数量">{selectedRow.quantity}</Descriptions.Item>
            <Descriptions.Item label="最低库存">{selectedRow.minQuantity}</Descriptions.Item>
            <Descriptions.Item label="价格">¥{selectedRow.price.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={selectedRow.status === 1 ? 'green' : 'red'}>
                {selectedRow.status === 1 ? '正常' : '禁用'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">{selectedRow.createdAt}</Descriptions.Item>
            <Descriptions.Item label="更新时间">{selectedRow.updatedAt}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
      
      {/* 更新库存弹窗 */}
      <Modal
        title="编辑库存"
        open={updateModalVisible}
        onCancel={() => {
          setUpdateModalVisible(false);
          updateForm.resetFields();
          setSelectedRow(null);
        }}
        footer={null}
        width={600}
      >
        {selectedRow && (
          <Form
            form={updateForm}
            layout="vertical"
            onFinish={(values) => {
              submitUpdate(selectedRow.id, values);
            }}
          >
            <Descriptions column={2} title="库存信息" style={{ marginBottom: 20 }}>
              <Descriptions.Item label="药品名称">{selectedRow.drugName}</Descriptions.Item>
              <Descriptions.Item label="批次号">{selectedRow.batchNo}</Descriptions.Item>
            </Descriptions>
            
            <Form.Item
              name="minQuantity"
              label="最低库存"
              rules={[{ required: true, message: '请输入最低库存' }]}
            >
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
            
            <Form.Item
              name="price"
              label="价格"
              rules={[{ required: true, message: '请输入价格' }]}
            >
              <InputNumber style={{ width: '100%' }} min={0} step={0.01} />
            </Form.Item>
            
            <Form.Item
              name="status"
              label="状态"
            >
              <Select
                options={[
                  { value: 1, label: '正常' },
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
        )}
      </Modal>
      
      {/* 库存入库弹窗 */}
      <Modal
        title="库存入库"
        open={inboundModalVisible}
        onCancel={() => {
          setInboundModalVisible(false);
          inboundForm.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form
          form={inboundForm}
          layout="vertical"
          onFinish={(values) => {
            submitInbound(values);
          }}
        >
          <Form.Item
            name="drugId"
            label="药品"
            rules={[{ required: true, message: '请选择药品' }]}
          >
            <Select
              placeholder="请选择药品"
              options={drugList.map(drug => ({
                value: drug.id,
                label: `${drug.name} (${drug.specification})`,
                key: drug.id,
              }))}
              loading={drugLoading}
            />
          </Form.Item>
          
          <Form.Item
            name="pharmacyId"
            label="药房"
            rules={[{ required: true, message: '请选择药房' }]}
          >
            <Select
              placeholder="请选择药房"
              options={pharmacyList.map(pharmacy => ({
                value: pharmacy.id,
                label: pharmacy.name,
                key: pharmacy.id,
              }))}
              loading={pharmacyLoading}
            />
          </Form.Item>
          
          <Form.Item
            name="batchNo"
            label="批次号"
            rules={[{ required: true, message: '请输入批次号' }]}
          >
            <Input placeholder="请输入批次号" />
          </Form.Item>
          
          <Form.Item
            name="expirationDate"
            label="有效期"
            rules={[{ required: true, message: '请选择有效期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="quantity"
            label="入库数量"
            rules={[{ required: true, message: '请输入入库数量' }]}
          >
            <InputNumber style={{ width: '100%' }} min={1} />
          </Form.Item>
          
          <Form.Item
            name="price"
            label="入库价格"
            rules={[{ required: true, message: '请输入入库价格' }]}
          >
            <InputNumber style={{ width: '100%' }} min={0} step={0.01} />
          </Form.Item>
          
          <Form.Item
            name="supplier"
            label="供应商"
          >
            <Input placeholder="请输入供应商" />
          </Form.Item>
          
          <Form.Item
            name="remark"
            label="备注"
          >
            <TextArea placeholder="请输入备注" rows={3} />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={inboundLoading}>
              确认入库
            </Button>
            <Button
              style={{ marginLeft: 8 }}
              onClick={() => {
                setInboundModalVisible(false);
                inboundForm.resetFields();
              }}
            >
              取消
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      
      {/* 库存出库弹窗 */}
      <Modal
        title="库存出库"
        open={outboundModalVisible}
        onCancel={() => {
          setOutboundModalVisible(false);
          outboundForm.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form
          form={outboundForm}
          layout="vertical"
          onFinish={(values) => {
            submitOutbound(values);
          }}
        >
          <Form.Item
            name="drugId"
            label="药品"
            rules={[{ required: true, message: '请选择药品' }]}
          >
            <Select
              placeholder="请选择药品"
              options={drugList.map(drug => ({
                value: drug.id,
                label: `${drug.name} (${drug.specification})`,
                key: drug.id,
              }))}
              loading={drugLoading}
            />
          </Form.Item>
          
          <Form.Item
            name="pharmacyId"
            label="药房"
            rules={[{ required: true, message: '请选择药房' }]}
          >
            <Select
              placeholder="请选择药房"
              options={pharmacyList.map(pharmacy => ({
                value: pharmacy.id,
                label: pharmacy.name,
                key: pharmacy.id,
              }))}
              loading={pharmacyLoading}
            />
          </Form.Item>
          
          <Form.Item
            name="batchNo"
            label="批次号"
            rules={[{ required: true, message: '请输入批次号' }]}
          >
            <Input placeholder="请输入批次号" />
          </Form.Item>
          
          <Form.Item
            name="quantity"
            label="出库数量"
            rules={[{ required: true, message: '请输入出库数量' }]}
          >
            <InputNumber style={{ width: '100%' }} min={1} />
          </Form.Item>
          
          <Form.Item
            name="prescriptionId"
            label="处方编号"
          >
            <Input placeholder="请输入处方编号" />
          </Form.Item>
          
          <Form.Item
            name="remark"
            label="备注"
          >
            <TextArea placeholder="请输入备注" rows={3} />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={outboundLoading}>
              确认出库
            </Button>
            <Button
              style={{ marginLeft: 8 }}
              onClick={() => {
                setOutboundModalVisible(false);
                outboundForm.resetFields();
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

export default InventoryList;