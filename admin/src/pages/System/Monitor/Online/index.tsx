import { PageContainer } from '@ant-design/pro-components';
import React from 'react';

const OnlineUserList: React.FC = () => {
  return (
    <PageContainer
      ghost
      header={{
        title: '在线用户',
      }}
    >
      <div>在线用户页面</div>
    </PageContainer>
  );
};

export default OnlineUserList;