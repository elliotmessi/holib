import { useState } from 'react';
import { useNavigate } from '@umijs/max';
import { PageContainer, ProForm } from '@ant-design/pro-components';
import { message, Button, Select, Input, InputNumber, DatePicker } from 'antd';
import { useModel } from '@umijs/max';

const InventoryCreatePage = () => {
  const navigate = useNavigate();
  const { useInventoryInbound } = useModel('inventory');
  const { submitInbound, loading } = useInventoryInbound({
    success: () => {
      message.success('库存创建成功');
      navigate('/inventory');
    },
  });

  return (
    <PageContainer
      title="新建库存"
      extra={[
        <Button key="back" onClick={() => navigate('/inventory')}>
          返回
        </Button>
      ]}
    >
      <ProForm
        layout="vertical"
        onFinish={submitInbound}
        loading={loading}
      >
        <ProForm.Group title="基本信息">
          <ProForm.Item
            name="drugId"
            label="药品"
            rules={[{ required: true, message: '请选择药品' }]}
          >
            <Select placeholder="请选择药品" />
          </ProForm.Item>
          <ProForm.Item
            name="pharmacyId"
            label="药房"
            rules={[{ required: true, message: '请选择药房' }]}
          >
            <Select placeholder="请选择药房" />
          </ProForm.Item>
          <ProForm.Item
            name="batchNumber"
            label="批次号"
            rules={[{ required: true, message: '请输入批次号' }]}
          >
            <Input placeholder="请输入批次号" />
          </ProForm.Item>
          <ProForm.Item
            name="quantity"
            label="数量"
            rules={[{ required: true, message: '请输入数量' }]}
          >
            <InputNumber placeholder="请输入数量" />
          </ProForm.Item>
          <ProForm.Item
            name="unitPrice"
            label="单价"
            rules={[{ required: true, message: '请输入单价' }]}
          >
            <InputNumber placeholder="请输入单价" />
          </ProForm.Item>
          <ProForm.Item
            name="storageLocation"
            label="库存位置"
          >
            <Input placeholder="请输入库存位置" />
          </ProForm.Item>
          <ProForm.Item
            name="validFrom"
            label="有效期起始日期"
            rules={[{ required: true, message: '请选择有效期起始日期' }]}
          >
            <DatePicker style={{ width: '100%' }} placeholder="请选择有效期起始日期" />
          </ProForm.Item>
          <ProForm.Item
            name="validTo"
            label="有效期截止日期"
            rules={[{ required: true, message: '请选择有效期截止日期' }]}
          >
            <DatePicker style={{ width: '100%' }} placeholder="请选择有效期截止日期" />
          </ProForm.Item>
          <ProForm.Item
            name="reason"
            label="入库原因"
          >
            <Input.TextArea placeholder="请输入入库原因" />
          </ProForm.Item>
        </ProForm.Group>
      </ProForm>
    </PageContainer>
  );
};

export default InventoryCreatePage;