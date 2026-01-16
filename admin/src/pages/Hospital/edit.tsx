import { PageContainer, ProForm } from '@ant-design/pro-components';
import React, { useState, useEffect } from 'react';
import { Button, message } from 'antd';
import { useNavigate, useParams } from 'umi';

const HospitalEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<any>({});

  // 模拟获取数据
  useEffect(() => {
    setFormData({
      hospitalName: '中心医院',
      address: '北京市海淀区',
      phone: '010-12345678',
      status: '1',
      remark: '综合医院',
    });
  }, [id]);

  const handleSubmit = (values: any) => {
    console.log('提交数据:', values);
    message.success('编辑成功');
    navigate('/hospital/list');
  };

  return (
    <PageContainer
      ghost
      header={{
        title: '编辑医院',
        extra: [
          <Button onClick={() => navigate('/hospital/list')}>取消</Button>,
        ],
      }}
    >
      <ProForm
        onFinish={handleSubmit}
        layout="vertical"
        initialValues={formData}
      >
        <ProForm.Text
          name="hospitalName"
          label="医院名称"
          rules={[{ required: true, message: '请输入医院名称' }]}
        />
        <ProForm.Text
          name="address"
          label="地址"
          rules={[{ required: true, message: '请输入地址' }]}
        />
        <ProForm.Text
          name="phone"
          label="电话"
          rules={[{ required: true, message: '请输入电话' }]}
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

export default HospitalEdit;