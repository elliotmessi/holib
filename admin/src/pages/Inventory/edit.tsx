import { PageContainer, ProForm, ProFormText, ProFormSelect } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import React from 'react';
import { useModel } from '@umijs/max';
import { history } from '@@/core/history';
import { useParams } from '@umijs/max';

const InventoryEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { useUpdateInventory, useInventoryDetail } = useModel('inventory');
  
  // 获取库存详情
  const { inventoryDetail, loading: detailLoading } = useInventoryDetail(id || '');
  
  // 更新库存
  const { submitUpdate, loading: updateLoading } = useUpdateInventory({
    success: () => {
      message.success('库存更新成功');
      history.push('/inventory');
    }
  });
  
  return (
    <PageContainer title="编辑库存">
      <ProForm
        initialValues={inventoryDetail}
        onFinish={(values) => submitUpdate(id || '', values)}
        layout="vertical"
        loading={detailLoading}
        submitter={{
          render: (props, dom) => [
            <Button key="back" onClick={() => history.push('/inventory')}>
              返回
            </Button>,
            <Button
              key="submit"
              type="primary"
              htmlType="submit"
              loading={updateLoading}
            >
              确定
            </Button>,
          ],
        }}
      >
        <ProFormText
          name="minQuantity"
          label="最低库存"
          rules={[{ required: true, message: '请输入最低库存' }]}
        />
        <ProFormText
          name="price"
          label="价格"
          rules={[{ required: true, message: '请输入价格' }]}
        />
        <ProFormSelect
          name="status"
          label="状态"
          options={[
            { value: '1', label: '正常' },
            { value: '0', label: '禁用' },
          ]}
        />
      </ProForm>
    </PageContainer>
  );
};

export default InventoryEdit;