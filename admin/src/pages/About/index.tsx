import { PageContainer } from '@ant-design/pro-components';
import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <PageContainer
      ghost
      header={{
        title: '关于',
      }}
    >
      <div>关于页面</div>
    </PageContainer>
  );
};

export default AboutPage;