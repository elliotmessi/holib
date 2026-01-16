import { PageContainer, ProForm } from '@ant-design/pro-components';
import React, { useState, useEffect } from 'react';
import { Button, message } from 'antd';
import { useNavigate, useParams } from 'umi';

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

export default ParamConfigEdit;