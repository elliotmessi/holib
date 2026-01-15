import { PageContainer, ProForm } from '@ant-design/pro-components';
import { Button, message, Radio } from 'antd';
import React from 'react';
import { useModel } from '@umijs/max';
import { history } from '@@/core/history';

const DoctorCreate: React.FC = () => {
  const { useCreateDoctor } = useModel('doctor');
  
  // 创建医生
  const { submitCreate, loading: createLoading } = useCreateDoctor({
    success: () => {
      message.success('医生创建成功');
      history.push('/doctor');
    }
  });
  
  return (
    <PageContainer title="新建医生">
      <ProForm
        onFinish={submitCreate}
        layout="vertical"
        submitter={{
          render: (props, dom) => [
            <Button key="back" onClick={() => history.push('/doctor')}>
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
          label="医生姓名"
          rules={[{ required: true, message: '请输入医生姓名' }]}
        />
        <ProForm.Item
          name="code"
          label="医生编码"
          rules={[{ required: true, message: '请输入医生编码' }]}
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
          name="phone"
          label="联系电话"
          rules={[{ required: true, message: '请输入联系电话' }]}
        />
        <ProForm.Item
          name="email"
          label="邮箱"
        />
        <ProForm.Item
          name="departmentId"
          label="所属科室"
          rules={[{ required: true, message: '请选择所属科室' }]}
        />
        <ProForm.Item
          name="title"
          label="职称"
          rules={[{ required: true, message: '请输入职称' }]}
        />
        <ProForm.Item
          name="specialty"
          label="专长"
          rules={[{ required: true, message: '请输入专长' }]}
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

export default DoctorCreate;