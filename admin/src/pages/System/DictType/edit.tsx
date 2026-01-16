import { PageContainer, ProForm, ProFormText, ProFormSelect, ProFormTextArea } from '@ant-design/pro-components';
import React, { useState, useEffect } from 'react';
import { Button, message } from 'antd';
import { useNavigate, useParams } from '@umijs/max';

const DictTypeEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<any>({});

  // 模拟获取数据
  useEffect(() => {
    setFormData({
      dictName: '用户状态',
      dictType: 'user_status',
      status: '1',
      remark: '用户状态字典',
    });
  }, [id]);

  const handleSubmit = (values: any) => {
    console.log('提交数据:', values);
    message.success('编辑成功');
    navigate('/system/dict-type/list');
  };

  return (
    <PageContainer
      ghost
      header={{
        title: '编辑字典',
        extra: [
          <Button onClick={() => navigate('/system/dict-type/list')}>取消</Button>,
        ],
      }}
    >
      <ProForm
        onFinish={handleSubmit}
        layout="vertical"
        initialValues={formData}
      >
        <ProFormText
          name="dictName"
          label="字典名称"
          rules={[{ required: true, message: '请输入字典名称' }]}
        />
        <ProFormText
          name="dictType"
          label="字典类型"
          rules={[{ required: true, message: '请输入字典类型' }]}
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

export default DictTypeEdit;