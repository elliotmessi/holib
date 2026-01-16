import { PageContainer, ProForm, ProFormText, ProFormSelect, ProFormTextArea } from '@ant-design/pro-components';
import React from 'react';
import { Button, message } from 'antd';
import { useNavigate } from '@umijs/max';

const DepartmentCreate: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (values: any) => {
    console.log('提交数据:', values);
    message.success('创建成功');
    navigate('/department/list');
  };

  return (
    <PageContainer
      ghost
      header={{
        title: '新建科室',
        extra: [
          <Button onClick={() => navigate('/department/list')}>取消</Button>,
        ],
      }}
    >
      <ProForm
        onFinish={handleSubmit}
        layout="vertical"
      >
        <ProFormText
          name="departmentName"
          label="科室名称"
          rules={[{ required: true, message: '请输入科室名称' }]}
        />
        <ProFormSelect
          name="hospitalId"
          label="所属医院"
          options={[
            { value: '1', label: '中心医院' },
            { value: '2', label: '人民医院' },
          ]}
          rules={[{ required: true, message: '请选择所属医院' }]}
        />
        <ProFormSelect
          name="status"
          label="状态"
          options={[
            { value: '1', label: '启用' },
            { value: '0', label: '禁用' },
          ]}
          initialValue="1"
          rules={[{ required: true, message: '请选择状态' }]}
        />
        <ProFormTextArea
          name="remark"
          label="备注"
          rows={4}
        />
        <Button type="primary" htmlType="submit">
          保存
        </Button>
      </ProForm>
    </PageContainer>
  );
};

export default DepartmentCreate;