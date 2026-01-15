import { PageContainer } from '@ant-design/pro-components';
import React from 'react';

const DoctorList: React.FC = () => {
  return (
    <PageContainer
      ghost
      header={{
        title: '医生管理',
      }}
    >
      <div>医生管理页面</div>
    </PageContainer>
  );
};

export default DoctorList;