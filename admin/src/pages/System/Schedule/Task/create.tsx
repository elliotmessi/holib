import { PageContainer, ProForm } from '@ant-design/pro-components';
import React from 'react';
import { Button, message } from 'antd';
import { useNavigate } from 'umi';

const TaskCreate: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (values: any) => {
    console.log('提交数据:', values);
    message.success('创建成功');
    navigate('/system/schedule/task/list');
  };

  return (
    <PageContainer
      ghost
      header={{
        title: '新建任务',
        extra: [
          <Button onClick={() => navigate('/system/schedule/task/list')}>取消</Button>,
        ],
      }}
    >
      <ProForm
        onFinish={handleSubmit}
        layout="vertical"
      >
        <ProForm.Text
          name="taskName"
          label="任务名称"
          rules={[{ required: true, message: '请输入任务名称' }]}
        />
        <ProForm.Text
          name="taskGroup"
          label="任务组"
          rules={[{ required: true, message: '请输入任务组' }]}
        />
        <ProForm.Text
          name="taskCron"
          label="Cron表达式"
          rules={[{ required: true, message: '请输入Cron表达式' }]}
        />
        <ProForm.Text
          name="taskClass"
          label="任务类"
          rules={[{ required: true, message: '请输入任务类' }]}
        />
        <ProForm.Select
          name="status"
          label="状态"
          options={[
            { value: '1', label: '启用' },
            { value: '0', label: '禁用' },
          ]}
          initialValue="1"
          rules={[{ required: true, message: '请选择状态' }]}
        />
        <ProForm.TextArea
          name="remark"
          label="备注"
          rows={4}
        />
        <ProForm.Submit>
          保存
        </ProForm.Submit>
      </ProForm>
    </PageContainer>
  );
};

export default TaskCreate;