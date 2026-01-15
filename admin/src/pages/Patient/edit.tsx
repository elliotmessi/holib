import { PageContainer, ProForm } from '@ant-design/pro-components';
import { Button, message, Radio } from 'antd';
import React from 'react';
import { useModel } from '@umijs/max';
import { history } from '@@/core/history';
import { useParams } from '@umijs/max';

const PatientEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { useUpdatePatient, usePatientDetail } = useModel('patient');
  
  // 获取患者详情
  const { patientDetail, loading: detailLoading } = usePatientDetail(id || '');
  
  // 更新患者
  const { submitUpdate, loading: updateLoading } = useUpdatePatient({
    success: () => {
      message.success('患者更新成功');
      history.push('/patient');
    }
  });
  
  return (
    <PageContainer title="编辑患者">
      <ProForm
        initialValues={patientDetail}
        onFinish={(values) => submitUpdate(id || '', values)}
        layout="vertical"
        loading={detailLoading}
        submitter={{
          render: (props, dom) => [
            <Button key="back" onClick={() => history.push('/patient')}>
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
        />
      </ProForm>
    </PageContainer>
  );
};

export default PatientEdit;