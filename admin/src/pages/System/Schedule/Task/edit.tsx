import { PageContainer, ProForm } from '@ant-design/pro-components';
import React, { useState, useEffect } from 'react';
import { Button, message } from 'antd';
import { useNavigate, useParams } from 'umi';

const TaskEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<any>({});

  // 模拟获取数据
  useEffect(() => {
    setFormData({
      taskName: '系统备份',
      taskGroup: 'system',
      taskCron: '0 0 * * *',
      taskClass: 'com.hospital.system.task.BackupTask',
      status: '1',
      remark: '每日系统备份',
    });
  }, [id]);

  const handleSubmit = (values: any) => {
    console.log('提交数据:', values);
    message.success('编辑成功');
    navigate('/system/schedule/task/list');
  };

  return (
    <PageContainer
      ghost
      header={{
        title: '编辑任务',
        extra: [
          <Button onClick={() => navigate('/system/schedule/task/list')}>取消</Button>,
        ],
      }}
    >
      <ProForm
        onFinish={handleSubmit}
        layout="vertical"
        initialValues={formData}
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

export default TaskEdit;