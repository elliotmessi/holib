import { PageContainer } from '@ant-design/pro-components';
import React from 'react';

const DrugList: React.FC = () => {
  return (
    <PageContainer
      ghost
      header={{
        title: '药品管理',
      }}
    >
      <div>药品管理页面</div>
    </PageContainer>
  );
};

export default DrugList;