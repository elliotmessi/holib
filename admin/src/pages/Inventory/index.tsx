import { PageContainer } from '@ant-design/pro-components';
import React from 'react';

const InventoryList: React.FC = () => {
  return (
    <PageContainer
      ghost
      header={{
        title: '库存管理',
      }}
    >
      <div>库存管理页面</div>
    </PageContainer>
  );
};

export default InventoryList;