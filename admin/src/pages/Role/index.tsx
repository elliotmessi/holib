import { PageContainer } from '@ant-design/pro-components';
import React from 'react';

const RoleList: React.FC = () => {
  return (
    <PageContainer
      ghost
      header={{
        title: '角色管理',
      }}
    >
      <div>角色管理页面</div>
    </PageContainer>
  );
};

export default RoleList;