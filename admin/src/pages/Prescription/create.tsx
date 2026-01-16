import { PageContainer, ProForm, ProFormText, ProFormSelect } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import React from 'react';
import { useModel } from '@umijs/max';
import { history } from '@@/core/history';

const PrescriptionCreate: React.FC = () => {
  const { useCreatePrescription } = useModel('prescription');
  
  // 创建处方
  const { submitCreate, loading: createLoading } = useCreatePrescription({
    success: () => {
      message.success('处方创建成功');
      history.push('/prescription');
    }
  });
  
  return (
    <PageContainer title="新建处方">
      <ProForm
        onFinish={submitCreate}
        layout="vertical"
        submitter={{
          render: (props, dom) => [
            <Button key="back" onClick={() => history.push('/prescription')}>
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
        <ProFormSelect
          name="patientId"
          label="患者"
          rules={[{ required: true, message: '请选择患者' }]}
        />
        <ProFormSelect
          name="departmentId"
          label="所属科室"
          rules={[{ required: true, message: '请选择科室' }]}
        />
        <ProFormText
          name="diagnosis"
          label="诊断"
          rules={[{ required: true, message: '请输入诊断' }]}
        />
        <ProFormSelect
          name="prescriptionDrugs"
          label="处方药品"
          rules={[{ required: true, message: '请添加药品' }]}
        />
      </ProForm>
    </PageContainer>
  );
};

export default PrescriptionCreate;