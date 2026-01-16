import { PageContainer, ProForm } from '@ant-design/pro-components';
import React from 'react';
import { Button, message } from 'antd';
import { useNavigate } from 'umi';

const DictItemCreate: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (values: any) => {
    console.log('提交数据:', values);
    message.success('创建成功');
    navigate('/system/dict-item/list');
  };

  return (
    <PageContainer
      ghost
      header={{
        title: '新建字典项',
        extra: [
          <Button onClick={() => navigate('/system/dict-item/list')}>取消</Button>,
        ],
      }}
    >
      <ProForm
        onFinish={handleSubmit}
        layout="vertical"
      >
        <ProForm.Select
          name="dictId"
          label="所属字典"
          options={[
            { value: '1', label: '用户状态' },
            { value: '2', label: '角色类型' },
          ]}
          rules={[{ required: true, message: '请选择所属字典' }]}
        />
        <ProForm.Text
          name="itemName"
          label="字典项名称"
          rules={[{ required: true, message: '请输入字典项名称' }]}
        />
        <ProForm.Text
          name="itemValue"
          label="字典项值"
          rules={[{ required: true, message: '请输入字典项值' }]}
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

export default DictItemCreate;