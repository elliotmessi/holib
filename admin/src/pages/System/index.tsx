import { PageContainer } from '@ant-design/pro-components';
import React from 'react';

const SystemManagement: React.FC = () => {
  return (
    <PageContainer
      ghost
      header={{
        title: '系统管理',
      }}
    >
      <div>系统管理页面</div>
    </PageContainer>
  );
};

export default SystemManagement;