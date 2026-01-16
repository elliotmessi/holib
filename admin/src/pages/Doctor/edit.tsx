import { PageContainer, ProForm, ProFormText, ProFormSelect, ProFormRadio } from '@ant-design/pro-components';
import { Button, message, Radio } from 'antd';
import React from 'react';
import { useModel } from '@umijs/max';
import { history } from '@@/core/history';
import { useParams } from '@umijs/max';

const DoctorEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { useUpdateDoctor, useDoctorDetail } = useModel('doctor');
  
  // 获取医生详情
  const { doctorDetail, loading: detailLoading } = useDoctorDetail(id || '');
  
  // 更新医生
  const { submitUpdate, loading: updateLoading } = useUpdateDoctor({
    success: () => {
      message.success('医生更新成功');
      history.push('/doctor');
    }
  });
  
  return (
    <PageContainer title="编辑医生">
      <ProForm
        initialValues={doctorDetail}
        onFinish={(values) => submitUpdate(id || '', values)}
        layout="vertical"
        loading={detailLoading}
        submitter={{
          render: (props, dom) => [
            <Button key="back" onClick={() => history.push('/doctor')}>
              返回
            </Button>,
            <Button
              key="submit"
              type="primary"
              htmlType="submit"
              loading={updateLoading}
            >
              确定
            </Button>,
          ],
        }}
      >
        <ProFormText
          name="name"
          label="医生姓名"
          rules={[{ required: true, message: '请输入医生姓名' }]}
        />
        <ProFormText
          name="code"
          label="医生编码"
          rules={[{ required: true, message: '请输入医生编码' }]}
        />
        <ProFormRadio
          name="gender"
          label="性别"
          rules={[{ required: true, message: '请选择性别' }]}
        >
          <Radio.Group>
            <Radio value={1}>男</Radio>
            <Radio value={2}>女</Radio>
          </Radio.Group>
        </ProFormRadio>
        <ProFormText
          name="phone"
          label="联系电话"
          rules={[{ required: true, message: '请输入联系电话' }]}
        />
        <ProFormText
          name="email"
          label="邮箱"
        />
        <ProFormSelect
          name="departmentId"
          label="所属科室"
          rules={[{ required: true, message: '请选择所属科室' }]}
        />
        <ProFormText
          name="title"
          label="职称"
          rules={[{ required: true, message: '请输入职称' }]}
        />
        <ProFormText
          name="specialty"
          label="专长"
          rules={[{ required: true, message: '请输入专长' }]}
        />
        <ProFormSelect
          name="status"
          label="状态"
        />
      </ProForm>
    </PageContainer>
  );
};

export default DoctorEdit;