import { PageContainer, ProForm, ProFormText, ProFormSelect, ProFormTextArea } from '@ant-design/pro-components';
import React, { useState, useEffect } from 'react';
import { Button, message } from 'antd';
import { useNavigate, useParams } from '@umijs/max';

const ParamConfigEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<any>({});

  // 模拟获取数据
  useEffect(() => {
    setFormData({
      paramName: '系统名称',
      paramKey: 'system.name',
      paramValue: '医院管理系统',
      status: '1',
      remark: '系统显示名称',
    });
  }, [id]);

  const handleSubmit = (values: any) => {
    console.log('提交数据:', values);
    message.success('编辑成功');
    navigate('/system/param-config/list');
  };

  return (
    <PageContainer
      ghost
      header={{
        title: '编辑参数',
        extra: [
          <Button onClick={() => navigate('/system/param-config/list')}>取消</Button>,
        ],
      }}
    >
      <ProForm
        onFinish={handleSubmit}
        layout="vertical"
        initialValues={formData}
      >
        <ProFormText
          name="paramName"
          label="参数名称"
          rules={[{ required: true, message: '请输入参数名称' }]}
        />
        <ProFormText
          name="paramKey"
          label="参数键"
          rules={[{ required: true, message: '请输入参数键' }]}
        />
        <ProFormText
          name="paramValue"
          label="参数值"
          rules={[{ required: true, message: '请输入参数值' }]}
        />
        <ProFormSelect
          name="status"
          label="状态"
          options={[
            { value: '1', label: '启用' },
            { value: '0', label: '禁用' },
          ]}
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

export default ParamConfigEdit;