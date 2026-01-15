import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import { Button } from 'antd';
import React from 'react';
import { useModel } from '@umijs/max';
import { history } from '@@/core/history';
import { useParams } from '@umijs/max';

const PrescriptionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { usePrescriptionDetail } = useModel('prescription');
  
  // 获取处方详情
  const { prescriptionDetail, loading: detailLoading } = usePrescriptionDetail(id || '');
  
  return (
    <PageContainer title="处方详情">
      <div style={{ marginBottom: 16 }}>
        <Button onClick={() => history.push('/prescription')}>返回</Button>
        <Button type="primary" style={{ marginLeft: 8 }} onClick={() => history.push(`/prescription/edit/${id}`)}>
          编辑
        </Button>
      </div>
      <ProDescriptions
        title=""
        column={2}
        loading={detailLoading}
        dataSource={prescriptionDetail}
        columns={[
          {
            title: '处方编号',
            dataIndex: 'prescriptionNumber',
          },
          {
            title: '患者姓名',
            dataIndex: 'patientName',
          },
          {
            title: '医生姓名',
            dataIndex: 'doctorName',
          },
          {
            title: '所属科室',
            dataIndex: 'departmentName',
          },
          {
            title: '诊断',
            dataIndex: 'diagnosis',
          },
          {
            title: '总金额',
            dataIndex: 'totalAmount',
          },
          {
            title: '状态',
            dataIndex: 'status',
            valueEnum: {
              pending: { text: '待审核', status: 'Warning' },
              approved: { text: '已审核', status: 'Success' },
              rejected: { text: '已拒绝', status: 'Error' },
              completed: { text: '已完成', status: 'Default' },
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

export default PrescriptionDetail;