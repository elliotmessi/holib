import { PageContainer } from '@ant-design/pro-components';
import React from 'react';

const PharmacyList: React.FC = () => {
  return (
    <PageContainer
      ghost
      header={{
        title: '药房管理',
      }}
    >
      <div>药房管理页面</div>
    </PageContainer>
  );
};

export default PharmacyList;