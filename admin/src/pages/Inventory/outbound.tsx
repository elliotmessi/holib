import { PageContainer, ProForm, ProFormText, ProFormSelect, ProFormTextArea } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import React from 'react';
import { useModel } from '@umijs/max';
import { history } from '@@/core/history';

const InventoryOutbound: React.FC = () => {
  const { useInventoryOutbound } = useModel('inventory');
  
  // 库存出库
  const { submitOutbound, loading: outboundLoading } = useInventoryOutbound({
    success: () => {
      message.success('库存出库成功');
      history.push('/inventory');
    }
  });
  
  return (
    <PageContainer title="库存出库">
      <ProForm
        onFinish={submitOutbound}
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
              loading={outboundLoading}
            >
              确认出库
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
        <ProFormText
          name="quantity"
          label="出库数量"
          rules={[{ required: true, message: '请输入出库数量' }]}
        />
        <ProFormText
          name="prescriptionId"
          label="处方编号"
        />
        <ProFormTextArea
          name="remark"
          label="备注"
        />
      </ProForm>
    </PageContainer>
  );
};

export default InventoryOutbound;