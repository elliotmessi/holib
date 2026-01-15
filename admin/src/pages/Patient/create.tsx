import { PageContainer, ProForm } from '@ant-design/pro-components';
import { Button, message, Radio } from 'antd';
import React from 'react';
import { useModel } from '@umijs/max';
import { history } from '@@/core/history';

const PatientCreate: React.FC = () => {
  const { useCreatePatient } = useModel('patient');
  
  // 创建患者
  const { submitCreate, loading: createLoading } = useCreatePatient({
    success: () => {
      message.success('患者创建成功');
      history.push('/patient');
    }
  });
  
  return (
    <PageContainer title="新建患者">
      <ProForm
        onFinish={submitCreate}
        layout="vertical"
        submitter={{
          render: (props, dom) => [
            <Button key="back" onClick={() => history.push('/patient')}>
              返回
            </Button>,
            <Button
              key="submit"
              type="primary"
              htmlType="submit"
              loading={createLoading}
            >
              确定
            </Button>,
          ],
        }}
      >
        <ProForm.Item
          name="name"
          label="患者姓名"
          rules={[{ required: true, message: '请输入患者姓名' }]}
        />
        <ProForm.Item
          name="medicalRecordNumber"
          label="病历号"
          rules={[{ required: true, message: '请输入病历号' }]}
        />
        <ProForm.Item
          name="gender"
          label="性别"
          initialValue={1}
          rules={[{ required: true, message: '请选择性别' }]}
        >
          <Radio.Group>
            <Radio value={1}>男</Radio>
            <Radio value={2}>女</Radio>
          </Radio.Group>
        </ProForm.Item>
        <ProForm.Item
          name="age"
          label="年龄"
          rules={[{ required: true, message: '请输入年龄' }]}
        />
        <ProForm.Item
          name="phone"
          label="联系电话"
          rules={[{ required: true, message: '请输入联系电话' }]}
        />
        <ProForm.Item
          name="idCard"
          label="身份证号"
          rules={[{ required: true, message: '请输入身份证号' }]}
        />
        <ProForm.Item
          name="address"
          label="地址"
        />
        <ProForm.Item
          name="medicalHistory"
          label="病史"
          valueType="textarea"
        />
        <ProForm.Item
          name="status"
          label="状态"
          initialValue={1}
        />
      </ProForm>
    </PageContainer>
  );
};

export default PatientCreate;