import { PageContainer } from '@ant-design/pro-components';
import React from 'react';

const DictItemList: React.FC = () => {
  return (
    <PageContainer
      ghost
      header={{
        title: '字典项管理',
      }}
    >
      <div>字典项管理页面</div>
    </PageContainer>
  );
};

export default DictItemList;