import { PageContainer, ProForm, ProFormText, ProFormSelect, ProFormDatePicker, ProFormTextArea } from '@ant-design/pro-components';
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
        <ProFormSelect
          name="drugId"
          label="药品"
          rules={[{ required: true, message: '请选择药品' }]}
        />
        <ProFormSelect
          name="pharmacyId"
          label="药房"
          rules={[{ required: true, message: '请选择药房' }]}
        />
        <ProFormText
          name="batchNo"
          label="批次号"
          rules={[{ required: true, message: '请输入批次号' }]}
        />
        <ProFormDatePicker
          name="expirationDate"
          label="有效期"
          rules={[{ required: true, message: '请选择有效期' }]}
        />
        <ProFormText
          name="quantity"
          label="入库数量"
          rules={[{ required: true, message: '请输入入库数量' }]}
        />
        <ProFormText
          name="price"
          label="入库价格"
          rules={[{ required: true, message: '请输入入库价格' }]}
        />
        <ProFormText
          name="supplier"
          label="供应商"
        />
        <ProFormTextArea
          name="remark"
          label="备注"
        />
      </ProForm>
    </PageContainer>
  );
};

export default InventoryInbound;