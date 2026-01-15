import { PageContainer, ProForm } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import React from 'react';
import { useModel } from '@umijs/max';
import { history } from '@@/core/history';

const InventoryInbound: React.FC = () => {
  const { useInventoryInbound } = useModel('inventory');
  
  // 库存入库
  const { submitInbound, loading: inboundLoading } = useInventoryInbound({
    success: () => {
      message.success('库存入库成功');
      history.push('/inventory');
    }
  });
  
  return (
    <PageContainer title="库存入库">
      <ProForm
        onFinish={submitInbound}
        layout="vertical"
        submitter={{
          render: (props, dom) => [
            <Button key="back" onClick={() => history.push('/inventory')}>
              返回
            </Button>,
            <Button
              key="submit"
              type="primary"
              htmlType="submit"
              loading={inboundLoading}
            >
              确认入库
            </Button>,
          ],
        }}
      >
        <ProForm.Item
          name="drugId"
          label="药品"
          rules={[{ required: true, message: '请选择药品' }]}
        />
        <ProForm.Item
          name="pharmacyId"
          label="药房"
          rules={[{ required: true, message: '请选择药房' }]}
        />
        <ProForm.Item
          name="batchNo"
          label="批次号"
          rules={[{ required: true, message: '请输入批次号' }]}
        />
        <ProForm.Item
          name="expirationDate"
          label="有效期"
          rules={[{ required: true, message: '请选择有效期' }]}
          valueType="date"
        />
        <ProForm.Item
          name="quantity"
          label="入库数量"
          rules={[{ required: true, message: '请输入入库数量' }]}
        />
        <ProForm.Item
          name="price"
          label="入库价格"
          rules={[{ required: true, message: '请输入入库价格' }]}
        />
        <ProForm.Item
          name="supplier"
          label="供应商"
        />
        <ProForm.Item
          name="remark"
          label="备注"
          valueType="textarea"
        />
      </ProForm>
    </PageContainer>
  );
};

export default InventoryInbound;