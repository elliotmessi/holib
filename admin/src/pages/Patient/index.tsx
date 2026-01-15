import { PageContainer } from '@ant-design/pro-components';
import React from 'react';

const PatientList: React.FC = () => {
  return (
    <PageContainer
      ghost
      header={{
        title: '患者管理',
      }}
    >
      <div>患者管理页面</div>
    </PageContainer>
  );
};

export default PatientList;