import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import { Button } from 'antd';
import React from 'react';
import { useModel } from '@umijs/max';
import { history } from '@@/core/history';
import { useParams } from '@umijs/max';

const InventoryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { useInventoryDetail } = useModel('inventory');
  
  // 获取库存详情
  const { inventoryDetail, loading: detailLoading } = useInventoryDetail(id ? Number(id) : undefined);
  
  return (
    <PageContainer title="库存详情">
      <div style={{ marginBottom: 16 }}>
        <Button onClick={() => history.push('/inventory')}>返回</Button>
        <Button type="primary" style={{ marginLeft: 8 }} onClick={() => history.push(`/inventory/edit/${id}`)}>
          编辑
        </Button>
      </div>
      <ProDescriptions
        title=""
        column={2}
        loading={detailLoading}
        dataSource={inventoryDetail}
        columns={[
          {
            title: '药品名称',
            dataIndex: 'drugName',
          },
          {
            title: '药品编码',
            dataIndex: 'drugCode',
          },
          {
            title: '规格',
            dataIndex: 'specification',
          },
          {
            title: '单位',
            dataIndex: 'unit',
          },
          {
            title: '所属药房',
            dataIndex: 'pharmacyName',
          },
          {
            title: '批次号',
            dataIndex: 'batchNo',
          },
          {
            title: '有效期',
            dataIndex: 'expirationDate',
          },
          {
            title: '库存数量',
            dataIndex: 'quantity',
          },
          {
            title: '最低库存',
            dataIndex: 'minQuantity',
          },
          {
            title: '价格',
            dataIndex: 'price',
          },
          {
            title: '状态',
            dataIndex: 'status',
            valueEnum: {
              1: { text: '正常', status: 'Success' },
              0: { text: '禁用', status: 'Error' },
            },
          },
          {
            title: '创建时间',
            dataIndex: 'createdAt',
            valueType: 'dateTime',
          },
          {
            title: '更新时间',
            dataIndex: 'updatedAt',
            valueType: 'dateTime',
          },
        ]}
      />
    </PageContainer>
  );
};

export default InventoryDetail;