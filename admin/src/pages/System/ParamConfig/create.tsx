import { PageContainer, ProForm } from '@ant-design/pro-components';
import React from 'react';
import { Button, message } from 'antd';
import { useNavigate } from 'umi';

const ParamConfigCreate: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (values: any) => {
    console.log('提交数据:', values);
    message.success('创建成功');
    navigate('/system/param-config/list');
  };

  return (
    <PageContainer
      ghost
      header={{
        title: '新建参数',
        extra: [
          <Button onClick={() => navigate('/system/param-config/list')}>取消</Button>,
        ],
      }}
    >
      <ProForm
        onFinish={handleSubmit}
        layout="vertical"
      >
        <ProForm.Text
          name="paramName"
          label="参数名称"
          rules={[{ required: true, message: '请输入参数名称' }]}
        />
        <ProForm.Text
          name="paramKey"
          label="参数键"
          rules={[{ required: true, message: '请输入参数键' }]}
        />
        <ProForm.Text
          name="paramValue"
          label="参数值"
          rules={[{ required: true, message: '请输入参数值' }]}
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

export default ParamConfigCreate;