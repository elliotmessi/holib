import { PageContainer } from '@ant-design/pro-components';
import React from 'react';

const HealthCheck: React.FC = () => {
  return (
    <PageContainer
      ghost
      header={{
        title: '健康检查',
      }}
    >
      <div>健康检查页面</div>
    </PageContainer>
  );
};

export default HealthCheck;