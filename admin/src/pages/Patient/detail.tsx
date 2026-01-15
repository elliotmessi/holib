import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import { Button } from 'antd';
import React from 'react';
import { useModel } from '@umijs/max';
import { history } from '@@/core/history';
import { useParams } from '@umijs/max';

const PatientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { usePatientDetail } = useModel('patient');
  
  // 获取患者详情
  const { patientDetail, loading: detailLoading } = usePatientDetail(id || '');
  
  return (
    <PageContainer title="患者详情">
      <div style={{ marginBottom: 16 }}>
        <Button onClick={() => history.push('/patient')}>返回</Button>
        <Button type="primary" style={{ marginLeft: 8 }} onClick={() => history.push(`/patient/edit/${id}`)}>
          编辑
        </Button>
      </div>
      <ProDescriptions
        title=""
        column={2}
        loading={detailLoading}
        dataSource={patientDetail}
        columns={[
          {
            title: '患者姓名',
            dataIndex: 'name',
          },
          {
            title: '病历号',
            dataIndex: 'medicalRecordNumber',
          },
          {
            title: '性别',
            dataIndex: 'gender',
            valueEnum: {
              1: { text: '男' },
              2: { text: '女' },
            },
          },
          {
            title: '年龄',
            dataIndex: 'age',
          },
          {
            title: '联系电话',
            dataIndex: 'phone',
          },
          {
            title: '身份证号',
            dataIndex: 'idCard',
          },
          {
            title: '地址',
            dataIndex: 'address',
          },
          {
            title: '病史',
            dataIndex: 'medicalHistory',
            span: 2,
          },
          {
            title: '状态',
            dataIndex: 'status',
            valueEnum: {
              1: { text: '启用', status: 'Success' },
              0: { text: '禁用', status: 'Error' },
            },
          },
          {
            title: '创建时间',
            dataIndex: 'createdAt',
            valueType: 'dateTime',
          },
          {
            title: '更新时间',
            dataIndex: 'updatedAt',
            valueType: 'dateTime',
          },
        ]}
      />
    </PageContainer>
  );
};

export default PatientDetail;