import { PageContainer } from '@ant-design/pro-components';
import React from 'react';

const LoginLogList: React.FC = () => {
  return (
    <PageContainer
      ghost
      header={{
        title: '登录日志',
      }}
    >
      <div>登录日志页面</div>
    </PageContainer>
  );
};

export default LoginLogList;