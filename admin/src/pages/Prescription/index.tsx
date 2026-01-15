import { PageContainer } from '@ant-design/pro-components';
import React from 'react';

const PrescriptionList: React.FC = () => {
  return (
    <PageContainer
      ghost
      header={{
        title: '处方管理',
      }}
    >
      <div>处方管理页面</div>
    </PageContainer>
  );
};

export default PrescriptionList;