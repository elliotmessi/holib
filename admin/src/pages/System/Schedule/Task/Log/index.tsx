import { PageContainer } from '@ant-design/pro-components';
import React from 'react';

const TaskLogList: React.FC = () => {
  return (
    <PageContainer
      ghost
      header={{
        title: '任务日志',
      }}
    >
      <div>任务日志页面</div>
    </PageContainer>
  );
};

export default TaskLogList;