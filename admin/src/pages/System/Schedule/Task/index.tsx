import { PageContainer } from '@ant-design/pro-components';
import React from 'react';

const TaskList: React.FC = () => {
  return (
    <PageContainer
      ghost
      header={{
        title: '任务管理',
      }}
    >
      <div>任务管理页面</div>
    </PageContainer>
  );
};

export default TaskList;