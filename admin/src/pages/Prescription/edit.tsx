import { PageContainer, ProForm, ProFormText, ProFormSelect } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import React from 'react';
import { useModel } from '@umijs/max';
import { history } from '@@/core/history';
import { useParams } from '@umijs/max';

const PrescriptionEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { useUpdatePrescription, usePrescriptionDetail } = useModel('prescription');
  
  // 获取处方详情
  const { prescriptionDetail, loading: detailLoading } = usePrescriptionDetail(id ? Number(id) : undefined);
  
  // 更新处方
  const { submitUpdate, loading: updateLoading } = useUpdatePrescription({
    success: () => {
      message.success('处方更新成功');
      history.push('/prescription');
    }
  });
  
  return (
    <PageContainer title="编辑处方">
      <ProForm
        initialValues={prescriptionDetail}
        onFinish={(values) => submitUpdate(Number(id), values)}
        layout="vertical"
        loading={detailLoading}
        submitter={{
          render: (props, dom) => [
            <Button key="back" onClick={() => history.push('/prescription')}>
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
        <ProFormSelect
          name="status"
          label="状态"
          options={[
            { value: '1', label: '正常' },
            { value: '0', label: '禁用' },
          ]}
        />
      </ProForm>
    </PageContainer>
  );
};

export default PrescriptionEdit;