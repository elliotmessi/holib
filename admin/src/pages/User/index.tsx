import { PageContainer } from '@ant-design/pro-components';
import React from 'react';

const UserList: React.FC = () => {
  return (
    <PageContainer
      ghost
      header={{
        title: '用户管理',
      }}
    >
      <div>用户管理页面</div>
    </PageContainer>
  );
};

export default UserList;