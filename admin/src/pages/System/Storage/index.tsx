import { PageContainer } from '@ant-design/pro-components';
import React from 'react';

const StorageManagement: React.FC = () => {
  return (
    <PageContainer
      ghost
      header={{
        title: '存储管理',
      }}
    >
      <div>存储管理页面</div>
    </PageContainer>
  );
};

export default StorageManagement;